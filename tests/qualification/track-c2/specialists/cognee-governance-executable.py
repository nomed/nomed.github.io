#!/usr/bin/env python3
import json, os, subprocess, sys
from pathlib import Path

PIN="690c0ec023719a2a277dc893cdecfec1ca8012cc"

def run(source: Path, out: Path):
    env=os.environ.copy()
    env.update({
      "REQUIRE_AUTHENTICATION":"true","ENABLE_BACKEND_ACCESS_CONTROL":"true","HASH_API_KEY":"false",
      "DATA_ROOT_DIRECTORY":str(out.parent/"data"),"SYSTEM_ROOT_DIRECTORY":str(out.parent/"system"),
      "FASTAPI_USERS_JWT_SECRET":"ov89-bounded-synthetic-secret","ACCEPT_LOCAL_FILE_PATH":"False","ALLOW_HTTP_REQUESTS":"False"
    })
    test=source/"cognee/tests/integration/permissions/test_permission_management.py"
    if not test.exists(): raise AssertionError("pinned public permission integration contract missing")
    proc=subprocess.run([sys.executable,"-m","pytest",str(test),"-q"],cwd=source,env=env,text=True,capture_output=True,timeout=600)
    text=proc.stdout+"\n"+proc.stderr
    # This upstream integration suite exercises provider-native dataset grant/revoke with backend ACL enabled.
    report={
      "schema_version":1,"track":"C2","gate":"specialist-cognee-governance-executable",
      "candidate":"topoteretes/cognee","revision":PIN,"upstream_contract":str(test.relative_to(source)),
      "bounded_profile":{"authentication":True,"backend_access_control":True,"storage":"local SQLite + LanceDB + Kuzu defaults","external_http_allowed":False},
      "pytest_returncode":proc.returncode,"pytest_tail":text[-6000:],
      "semantic_scope":"provider-native dataset ACL grant/revoke; dataset remains alive; no direct ACL-table mutation",
      "result":"COMPLEMENT_PASS" if proc.returncode==0 else "QUALIFICATION_GAP",
      "limitations":["dataset/collection ACL granularity, not individual memory atom","restart persistence remains a separate Yukh harness gate before final specialist selection"]
    }
    out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(report,indent=2)+"\n")
    if proc.returncode: raise AssertionError(text[-4000:])

def main():
    if len(sys.argv)!=3: raise SystemExit("usage: cognee-governance-executable.py <source> <out>")
    run(Path(sys.argv[1]).resolve(),Path(sys.argv[2]).resolve())
if __name__=="__main__": main()
