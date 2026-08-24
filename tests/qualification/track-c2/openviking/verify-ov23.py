#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: verify-ov23.py <report.json>")

report = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
assert report["schema_version"] == 2
assert report["track"] == "C2"
assert report["candidate"] == "volcengine/OpenViking"
assert report["revision"] == "234a2d9fe778a9512fd7ebe9807198e847c647ec"
assert report["gates"] == ["OV-2-host-replaceability", "OV-3-canonical-projection"]

profile = report["profile"]
assert profile["public_surface"] == "openviking-sdk HTTP"
assert profile["auth_mode"] == "dev"
assert profile["vlm_configured"] is False
assert profile["memory_extraction_enabled"] is False
assert profile["account_user_mapping"]["account"] == "dev/default"
assert profile["account_user_mapping"]["user"] == "dev/default"
assert profile["account_user_mapping"]["actor_peers"] == ["host-a", "host-b"]
assert "separate Python process" in profile["host_process_isolation"]
assert profile["embedding"]["configured"] is True
assert profile["embedding"]["successful_model_execution_required"] is False
assert "127.0.0.1:21934" in profile["embedding"]["endpoint"]
assert profile["external_egress"]["observed"] is False
assert len(profile["adapter_assumptions"]) >= 3

assert report["yukh_boundary"]["provider_role"] == "runtime projection only"
assert report["yukh_boundary"]["actor_peer_is_participant_authority"] is False
assert report["yukh_boundary"]["provider_is_accepted_state"] is False
assert report["yukh_boundary"]["provider_is_evidence_truth"] is False

manifest = report["manifest"]
assert manifest["schema_version"] == 1
assert len(manifest["artifacts"]) == 4
assert all(item["class"] == "canonical" for item in manifest["artifacts"])

obs = report["observations"]
assert obs["same_projection_across_hosts"] is True
assert obs["host_replaceability_pass"] is True
assert obs["stale_projection_distinguishable_before_reprojection"] is True
assert obs["reprojection_pass"] is True
assert obs["canonical_checked_in_source_unchanged"] is True
assert obs["host_a"]["actor_peer"] == "host-a"
assert obs["host_b"]["actor_peer"] == "host-b"
assert obs["host_a"]["fresh_process"] is True
assert obs["host_b"]["fresh_process"] is True
assert obs["host_a"]["content_sha256"] == obs["host_b"]["content_sha256"]
assert len(report["canonical_v1"]) == 4
assert len(report["provider_refs"]) == 4
assert report["result"] == "PASS"
assert report["next_gate"] == "OV-4-memory-profile"

print("verified OpenViking OV-2/OV-3: PASS")
