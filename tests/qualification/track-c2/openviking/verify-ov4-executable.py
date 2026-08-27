#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: verify-ov4-executable.py <report.json>")

r = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
assert r["track"] == "C2"
assert r["gate"] == "OV-4-executable-memory-profile"
assert r["candidate"] == "volcengine/OpenViking"
assert r["revision"] == "234a2d9fe778a9512fd7ebe9807198e847c647ec"
assert r["result"] == "PASS"
profile = r["profile"]
assert profile["public_surface"] == "openviking-sdk HTTP"
assert profile["auth_mode"] == "dev"
assert profile["model_path"] == "documented OpenAI-compatible VLM + embedding endpoints"
assert "127.0.0.1:21935" in profile["model_endpoint"]
assert profile["external_model_egress_configured"] is False
assert "loopback" in profile["external_model_egress_basis"]
assert "general process egress was not instrumented or observed" in profile["external_model_egress_basis"]
assert "external_egress_observed" not in profile
assert "separate Python processes" in profile["host_isolation"]
assert "same local storage workspace" in profile["server_restart"]
memory = r["provider_memory"]
assert memory["uri"].startswith("viking://") and "/memories/" in memory["uri"]
assert memory["classification"] == "remembered" and "HTTP/JSON" in memory["claim"] and len(memory["sha256"]) == 64
accepted = r["accepted_fact"]
assert accepted["fact_id"] == "service-transport" and accepted["value"] == "gRPC/protobuf"
assert accepted["class"] == "accepted" and accepted["authority"] == "yukh-external-fixture" and len(accepted["sha256"]) == 64
traffic = r["model_traffic"]
assert traffic["chat_completion_calls"] >= 1 and traffic["embedding_calls"] >= 1 and traffic["request_paths"]
for path in traffic["request_paths"]:
    assert path == "/health" or path.startswith("/v1/")
obs = r["observations"]
for key in ("host_processes_distinct", "commit_completed", "canonical_memory_root_used", "remembered_claim_persisted", "cross_host_reuse", "restart_persistence", "accepted_fact_conflicts_with_memory", "accepted_fact_remains_authoritative", "outage_correctness", "bounded_vlm_calls", "bounded_embedding_calls"):
    assert obs[key] is True, key
assert obs["memory_classification"] == "remembered"
assert obs["accepted_fact_classification"] == "accepted"
assert obs["memory_is_accepted_state"] is False and obs["memory_is_evidence_truth"] is False
assert r["next_gate"] == "OV-5-visibility-revocation"
print("verified OpenViking OV-4 executable memory profile: PASS")
