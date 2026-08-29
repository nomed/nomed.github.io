#!/usr/bin/env python3
import json,sys
from pathlib import Path
r=json.loads(Path(sys.argv[1]).read_text())
assert r["track"]=="C2" and r["candidate"]=="topoteretes/cognee"
assert r["revision"]=="690c0ec023719a2a277dc893cdecfec1ca8012cc"
assert r["gate"]=="specialist-cognee-governance-executable"
assert r["upstream_contract"]=="cognee/tests/api/test_multi_tenant_access_control_e2e.py"
assert r["bounded_profile"]["authentication"] is True
assert r["bounded_profile"]["backend_access_control"] is True
assert r["bounded_profile"]["external_http_allowed"] is False
assert r["pytest_returncode"]==0 and r["result"]=="BASELINE_PASS"
assert "not yet the normalized live" in r["limitations"][0]
print("verified Cognee executable ACL baseline: BASELINE_PASS")
