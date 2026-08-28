#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: verify-ov5-governance-preflight.py <report.json>")
r = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
assert r["track"] == "C2"
assert r["gate"] == "OV-5-governance-preflight"
assert r["candidate"] == "volcengine/OpenViking"
assert r["revision"] == "234a2d9fe778a9512fd7ebe9807198e847c647ec"
assert r["result"] == "PASS"
assert all(r["facts"].values())
sem = r["candidate_semantics"]
assert "api_key mode" in sem["identity_isolation_candidate"]
assert "immediately revokes" in sem["revocation_candidate"]
assert "not a standalone per-memory ACL revoke" in sem["revocation_semantic_class"]
assert "not established" in sem["team_acl_status"]
assert r["next_gate"] == "OV-5 executable identity isolation and revocation"
print("verified OpenViking OV-5 governance preflight: PASS")
