#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: verify-ov4-preflight.py <report.json>")

r = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
assert r["track"] == "C2"
assert r["gate"] == "OV-4A-public-memory-seam-preflight"
assert r["candidate"] == "volcengine/OpenViking"
assert r["revision"] == "234a2d9fe778a9512fd7ebe9807198e847c647ec"
assert r["result"] == "PASS"
for value in r["facts"].values():
    assert value is True
assert r["bounded_execution_status"]["deterministic_offline_end_to_end_proven_at_pin"] is False
assert r["authority_boundary"]["memory_is_context_only"] is True
assert r["authority_boundary"]["memory_is_accepted_state"] is False
assert r["authority_boundary"]["memory_is_evidence_truth"] is False
assert r["authority_boundary"]["memory_is_capability_authority"] is False
assert r["authority_boundary"]["memory_is_coordination_ownership"] is False
assert len(r["upstream_risks_to_revalidate"]) == 2
assert r["next_gate"] == "OV-4 bounded executable session-memory flow"
print("verified OpenViking OV-4 public memory preflight: PASS")
