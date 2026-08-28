#!/usr/bin/env python3
import json, sys
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit("usage: cognee-governance-preflight.py <cognee-source> <output-json>")
root=Path(sys.argv[1]); out=Path(sys.argv[2])
pin="690c0ec023719a2a277dc893cdecfec1ca8012cc"
perm=(root/"cognee/api/v1/permissions/routers/get_permissions_router.py").read_text()
auth=(root/"cognee/tests/api/test_backend_auth.py").read_text()
skill=(root/".claude/skills/cognee-permissions/SKILL.md").read_text()
facts={
 "public_register":"/api/v1/auth/register" in auth,
 "public_login":"/api/v1/auth/login" in auth,
 "api_key_auth":"X-Api-Key" in auth,
 "grant_endpoint":'@permissions_router.post("/datasets/{principal_id}")' in perm,
 "revoke_endpoint":'@permissions_router.delete("/datasets/{principal_id}")' in perm,
 "permissions_read_write_delete_share":all(x in perm for x in ["read", "write", "delete", "share"]),
 "principal_user_role_tenant":all(x in skill for x in ["User", "Role", "Tenant"]),
 "share_gates_grant_revoke":"share` is the meta-permission" in skill,
 "search_read_enforced":"search` / `recall` / visualize" in skill and "`read`" in skill,
 "denied_read_empty":"Denied reads return empty results, not 403" in skill,
}
for k,v in facts.items():
    if not v: raise AssertionError(k)
report={"schema_version":1,"track":"C2","candidate":"topoteretes/cognee","revision":pin,"gate":"specialist-cognee-governance-preflight","facts":facts,"protected_object":"dataset","decision":"EXECUTABLE_CANDIDATE","next_gate":"A owns dataset M; B denied; grant read; B reads; revoke read with A/B/M alive; B denied; restart; enforcement persists","limitations":["ACL granularity is dataset/collection, not individual memory atom","denied search intentionally returns empty results, so executable evidence must prove M is non-empty before denial"]}
out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(report,indent=2)+"\n")
print(out)
