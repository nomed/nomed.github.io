#!/usr/bin/env python3
import json,sys
from pathlib import Path
r=json.loads(Path(sys.argv[1]).read_text())
assert r["track"]=="C2"
assert r["gate"]=="OV-5-executable-governance"
assert r["candidate"]=="volcengine/OpenViking"
assert r["revision"]=="234a2d9fe778a9512fd7ebe9807198e847c647ec"
assert r["result"]=="PARTIAL"
o=r["observations"]
for k in ("identity_isolation","immediate_key_revocation","cleanup_completed","revocation_survives_restart","unrelated_identity_survives_restart"):
    assert o[k] is True,k
assert o["team_acl_proven"] is False
assert o["standalone_per_memory_acl_revoke"] is False
assert o["memory_is_authority"] is False
assert "identity/key revocation" in r["revocation_semantic_class"]
assert r["next_action"]=="evaluate complementary memory-governance specialist"
print("verified OpenViking OV-5 executable governance: PARTIAL")
