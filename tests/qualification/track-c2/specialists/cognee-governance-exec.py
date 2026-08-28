#!/usr/bin/env python3
import json, sys
from pathlib import Path
from fastapi.testclient import TestClient
from cognee.api.client import app

PIN="690c0ec023719a2a277dc893cdecfec1ca8012cc"
DATASET_NAME="yukh-governance-m"
PASS="synthetic-password-OV89!"

def write(path,payload):
    p=Path(path); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(payload,indent=2,sort_keys=True)+"\n")

def register_and_key(c,email):
    r=c.post("/api/v1/auth/register",json={"email":email,"password":PASS}); assert r.status_code in (201,400),r.text
    r=c.post("/api/v1/auth/login",data={"username":email,"password":PASS}); assert r.status_code==200,r.text
    token=r.json()["access_token"]
    me=c.get("/api/v1/auth/me",headers={"Authorization":f"Bearer {token}"}); assert me.status_code==200,me.text
    key=c.post("/api/v1/auth/api-keys",json={"name":"yukh-ov89"},headers={"Authorization":f"Bearer {token}"}); assert key.status_code==200,key.text
    return me.json(),key.json()["key"]

def hdr(key): return {"X-Api-Key":key}

def visible_ids(c,key):
    r=c.get("/api/v1/datasets",headers=hdr(key)); assert r.status_code==200,r.text
    return {str(x["id"]):x for x in r.json()}

def setup(out):
    with TestClient(app) as c:
        a,ak=register_and_key(c,"ov89-alice@example.invalid")
        b,bk=register_and_key(c,"ov89-bob@example.invalid")
        aid=str(a["id"]); bid=str(b["id"])
        tenants=c.get("/api/v1/permissions/tenants/me",headers=hdr(ak)); assert tenants.status_code==200,tenants.text
        tlist=tenants.json(); assert tlist,tlist
        tenant_id=str(tlist[0]["id"])
        add=c.post(f"/api/v1/permissions/users/{bid}/tenants",params={"tenant_id":tenant_id},headers=hdr(ak)); assert add.status_code==200,add.text
        sel=c.post("/api/v1/permissions/tenants/select",json={"tenant_id":tenant_id},headers=hdr(bk)); assert sel.status_code==200,sel.text
        ds=c.post("/api/v1/datasets",json={"name":DATASET_NAME},headers=hdr(ak)); assert ds.status_code==200,ds.text
        dataset=ds.json(); did=str(dataset["id"])
        assert did in visible_ids(c,ak)
        before=visible_ids(c,bk)
        assert did not in before, f"B saw A dataset before grant: {before}"
        write(out,{"pin":PIN,"alice_id":aid,"bob_id":bid,"alice_key":ak,"bob_key":bk,"tenant_id":tenant_id,"dataset_id":did,"dataset_name":DATASET_NAME,"a_visible_before":True,"b_denied_before":True})

def grant(state_path,out):
    x=json.loads(Path(state_path).read_text())
    with TestClient(app) as c:
        g=c.post(f"/api/v1/permissions/datasets/{x['bob_id']}",params={"permission_name":"read"},json=[x["dataset_id"]],headers=hdr(x["alice_key"])); assert g.status_code==200,g.text
        ids=visible_ids(c,x["bob_key"]); assert x["dataset_id"] in ids,ids
        a=visible_ids(c,x["alice_key"]); assert x["dataset_id"] in a
        write(out,{"pin":PIN,"grant_status":"public-api-success","b_reads_after_grant":True,"a_still_reads":True})

def revoke(state_path,out):
    x=json.loads(Path(state_path).read_text())
    with TestClient(app) as c:
        r=c.request("DELETE",f"/api/v1/permissions/datasets/{x['bob_id']}",params={"permission_name":"read"},json=[x["dataset_id"]],headers=hdr(x["alice_key"])); assert r.status_code==200,r.text
        ids=visible_ids(c,x["bob_key"]); assert x["dataset_id"] not in ids,ids
        a=visible_ids(c,x["alice_key"]); assert x["dataset_id"] in a
        write(out,{"pin":PIN,"revoke_status":"public-api-success","b_denied_after_revoke":True,"a_still_reads":True,"users_remain_alive":True,"dataset_remains_alive":True})

def restart(state_path,out):
    x=json.loads(Path(state_path).read_text())
    with TestClient(app) as c:
        b=visible_ids(c,x["bob_key"]); a=visible_ids(c,x["alice_key"])
        assert x["dataset_id"] not in b,b
        assert x["dataset_id"] in a,a
        me_b=c.get("/api/v1/auth/me",headers=hdr(x["bob_key"])); assert me_b.status_code==200,me_b.text
        write(out,{"pin":PIN,"revocation_persists_after_fresh_app_process":True,"b_still_active":True,"b_still_denied":True,"a_still_allowed":True,"dataset_still_alive":True})

def finalize(state_path,grant_path,revoke_path,restart_path,out):
    s=json.loads(Path(state_path).read_text()); g=json.loads(Path(grant_path).read_text()); r=json.loads(Path(revoke_path).read_text()); z=json.loads(Path(restart_path).read_text())
    obs={"initial_denial":s["b_denied_before"],"explicit_grant":g["b_reads_after_grant"],"explicit_revoke":r["b_denied_after_revoke"],"subjects_survive_revoke":r["users_remain_alive"],"object_survives_revoke":r["dataset_remains_alive"],"restart_persistence":z["revocation_persists_after_fresh_app_process"],"owner_access_preserved":z["a_still_allowed"],"revoked_subject_active":z["b_still_active"]}
    ok=all(obs.values())
    report={"schema_version":1,"track":"C2","gate":"cognee-governance-complement-executable","candidate":"topoteretes/cognee","revision":PIN,"protected_object":"dataset","acl_semantics":"principal × permission × dataset; explicit public grant/revoke","observations":obs,"result":"COMPLEMENT_PASS" if ok else "FAIL","limitations":["dataset/collection granularity, not per-memory atom","qualified with dataset metadata visibility rather than LLM retrieval to keep the ACL test model-free and bounded"],"authority_boundary":"Cognee ACL governs contextual dataset visibility only; Yukh accepted-state/evidence authority remains external."}
    write(out,report)
    assert ok

def main():
    mode=sys.argv[1]
    if mode=="setup": setup(sys.argv[2])
    elif mode=="grant": grant(sys.argv[2],sys.argv[3])
    elif mode=="revoke": revoke(sys.argv[2],sys.argv[3])
    elif mode=="restart": restart(sys.argv[2],sys.argv[3])
    elif mode=="finalize": finalize(*sys.argv[2:])
    else: raise SystemExit(mode)
if __name__=="__main__": main()
