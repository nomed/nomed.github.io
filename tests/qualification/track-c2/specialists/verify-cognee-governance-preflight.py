#!/usr/bin/env python3
import json,sys
from pathlib import Path
r=json.loads(Path(sys.argv[1]).read_text())
assert r["track"]=="C2" and r["candidate"]=="topoteretes/cognee"
assert r["revision"]=="690c0ec023719a2a277dc893cdecfec1ca8012cc"
assert r["gate"]=="specialist-cognee-governance-preflight"
assert r["decision"]=="EXECUTABLE_CANDIDATE"
assert all(r["facts"].values())
assert r["protected_object"]=="dataset"
assert len(r["limitations"])==2
print("verified Cognee governance complement preflight: EXECUTABLE_CANDIDATE")
