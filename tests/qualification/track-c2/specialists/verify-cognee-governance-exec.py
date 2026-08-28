#!/usr/bin/env python3
import json,sys
from pathlib import Path
r=json.loads(Path(sys.argv[1]).read_text())
assert r["track"]=="C2"
assert r["gate"]=="cognee-governance-complement-executable"
assert r["candidate"]=="topoteretes/cognee"
assert r["revision"]=="690c0ec023719a2a277dc893cdecfec1ca8012cc"
assert r["protected_object"]=="dataset"
assert r["result"]=="COMPLEMENT_PASS"
for k,v in r["observations"].items(): assert v is True,k
assert "explicit public grant/revoke" in r["acl_semantics"]
assert "dataset/collection granularity" in r["limitations"][0]
assert "Yukh accepted-state/evidence authority remains external" in r["authority_boundary"]
print("verified Cognee governance complement executable: COMPLEMENT_PASS")
