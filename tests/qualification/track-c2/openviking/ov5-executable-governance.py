#!/usr/bin/env python3
import hashlib, json, os, sys, time
from pathlib import Path
from openviking_sdk import SyncHTTPClient

PIN="234a2d9fe778a9512fd7ebe9807198e847c647ec"
ROOT_KEY="9f1f5ed0f7f94f8d8fb7554011f5bdb02f3d37a6a6d94b2f8c0df4beaa61a7e"

def write(path,payload):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(payload,indent=2,sort_keys=True)+"\n")

def sha(s): return hashlib.sha256(s.encode()).hexdigest()

def wait_task(client, task_id, timeout=90):
    end=time.time()+timeout
    last=None
    while time.time()<end:
        last=client.get_task(task_id)
        if last and last.get("status") in ("completed","failed"):
            return last
        time.sleep(.25)
    raise AssertionError(f"task timeout: {last!r}")

def memory_root(info):
    uri=info.get("uri")
    assert isinstance(uri,str) and "/sessions/" in uri and uri.startswith("viking://user/")
    return uri.split("/sessions/",1)[0]+"/memories"

def collect_uris(v):
    out=[]
    if isinstance(v,dict):
        u=v.get("uri")
        if isinstance(u,str) and u.startswith("viking://"): out.append(u)
        for x in v.values(): out.extend(collect_uris(x))
    elif isinstance(v,list):
        for x in v: out.extend(collect_uris(x))
    return list(dict.fromkeys(out))

def find_memory(c,root):
    r=c.find(query="OV5 private transport preference",target_uri=root,limit=10,options={"context_type":["memory"],"read_content":True})
    for u in collect_uris(r)+collect_uris(c.tree(uri=root)):
        if "/memories/" not in u or u.endswith(".overview.md") or u.endswith(".abstract.md"): continue
        try: text=c.read(uri=u)
        except Exception: continue
        if "HTTP/JSON" in text or "service_transport" in u: return u,text
    raise AssertionError(f"memory not found: {r!r}")

def setup(url,out):
    root=SyncHTTPClient(url=url,api_key=ROOT_KEY); root.initialize()
    acct=root.admin_create_account(account_id="yukh-ov5",admin_user_id="admin",seed="admin-seed")
    a=root.admin_register_user(account_id="yukh-ov5",user_id="alice",role="user",seed="alice-seed")
    b=root.admin_register_user(account_id="yukh-ov5",user_id="bob",role="user",seed="bob-seed")
    ak=a["user_key"]; bk=b["user_key"]
    ca=SyncHTTPClient(url=url,api_key=ak); ca.initialize()
    info=ca.create_session(session_id="ov5-private",options={"memory_policy":{"self":{"enabled":True},"peer":{"enabled":False},"working_memory":{"enabled":False},"memory_types":["preferences"]},"auto_commit_policy":None})
    s=ca.session("ov5-private"); s.add_message(role="user",content="Remember this private preference: OV5 private transport preference is HTTP/JSON."); s.add_message(role="assistant",content="Stored as contextual memory only.")
    t=wait_task(ca,s.commit()["task_id"]); assert t.get("status")=="completed"
    root_uri=memory_root(info); uri,text=find_memory(ca,root_uri)
    a_read=ca.read(uri=uri); assert a_read==text
    cb=SyncHTTPClient(url=url,api_key=bk); cb.initialize()
    b_denied=False; b_error=None
    try: cb.read(uri=uri)
    except Exception as e: b_denied=True; b_error=type(e).__name__
    if not b_denied: raise AssertionError("user B unexpectedly read user A memory")
    payload={"stage":"before-revocation","pin":PIN,"pid":os.getpid(),"account":"yukh-ov5","alice_key":ak,"bob_key":bk,"memory_uri":uri,"memory_sha256":sha(text),"alice_read":True,"bob_denied":b_denied,"bob_error":b_error,"user_scoped":uri.startswith("viking://user/alice/")}
    write(out,payload); ca.close(); cb.close(); root.close()

def revoke(url,before_path,out):
    x=json.loads(Path(before_path).read_text()); root=SyncHTTPClient(url=url,api_key=ROOT_KEY); root.initialize()
    res=root.admin_remove_user("yukh-ov5","alice"); task_id=res["task_id"]
    ca=SyncHTTPClient(url=url,api_key=x["alice_key"],timeout=2); ca.initialize(); immediate=False; err=None
    try: ca.list_sessions()
    except Exception as e: immediate=True; err=type(e).__name__
    if not immediate: raise AssertionError("removed user's API key still works")
    task=wait_task(root,task_id); assert task.get("status")=="completed"
    users=root.admin_list_users(account_id="yukh-ov5")
    alice_absent=all(u.get("user_id")!="alice" for u in users)
    payload={"stage":"after-revocation","pin":PIN,"pid":os.getpid(),"task_id":task_id,"task_status":task.get("status"),"immediate_key_revocation":immediate,"revoked_error":err,"alice_absent_from_users":alice_absent,"semantic_class":"identity/key revocation plus fenced asynchronous user deletion","per_memory_acl_revoke":False}
    write(out,payload); ca.close(); root.close()

def after_restart(url,before_path,out):
    x=json.loads(Path(before_path).read_text()); ca=SyncHTTPClient(url=url,api_key=x["alice_key"],timeout=2); ca.initialize(); still_revoked=False; err=None
    try: ca.list_sessions()
    except Exception as e: still_revoked=True; err=type(e).__name__
    if not still_revoked: raise AssertionError("revoked identity became valid after restart")
    cb=SyncHTTPClient(url=url,api_key=x["bob_key"]); cb.initialize(); bob_ok=True
    try: cb.list_sessions()
    except Exception: bob_ok=False
    if not bob_ok: raise AssertionError("unrelated user B lost access after restart")
    payload={"stage":"after-restart","pin":PIN,"pid":os.getpid(),"alice_still_revoked":still_revoked,"alice_error":err,"bob_still_valid":bob_ok}
    write(out,payload); ca.close(); cb.close()

def finalize(before_path,revoke_path,restart_path,out):
    a=json.loads(Path(before_path).read_text()); r=json.loads(Path(revoke_path).read_text()); s=json.loads(Path(restart_path).read_text())
    obs={"identity_isolation":a["alice_read"] and a["bob_denied"] and a["user_scoped"],"immediate_key_revocation":r["immediate_key_revocation"],"cleanup_completed":r["task_status"]=="completed" and r["alice_absent_from_users"],"revocation_survives_restart":s["alice_still_revoked"],"unrelated_identity_survives_restart":s["bob_still_valid"],"team_acl_proven":False,"standalone_per_memory_acl_revoke":False,"memory_is_authority":False}
    required=all(obs[k] for k in ("identity_isolation","immediate_key_revocation","cleanup_completed","revocation_survives_restart","unrelated_identity_survives_restart"))
    result="PARTIAL" if required else "FAIL"
    report={"schema_version":1,"track":"C2","gate":"OV-5-executable-governance","candidate":"volcengine/OpenViking","revision":PIN,"observations":obs,"revocation_semantic_class":r["semantic_class"],"decision_basis":"Identity-scoped isolation and durable identity/key revocation are executable PASS. The pinned public model does not establish standalone per-memory/team ACL revocation; self/peer routing is not promoted to ACL evidence.","result":result,"next_action":"evaluate complementary memory-governance specialist" if result=="PARTIAL" else None}
    write(out,report)
    if result=="FAIL": raise AssertionError(json.dumps(obs,indent=2))

def main():
    m=sys.argv[1]
    if m=="setup" and len(sys.argv)==4: setup(sys.argv[2],sys.argv[3]); return
    if m=="revoke" and len(sys.argv)==5: revoke(sys.argv[2],sys.argv[3],sys.argv[4]); return
    if m=="after-restart" and len(sys.argv)==5: after_restart(sys.argv[2],sys.argv[3],sys.argv[4]); return
    if m=="finalize" and len(sys.argv)==6: finalize(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]); return
    raise SystemExit("invalid args")
if __name__=="__main__": main()
