#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit("usage: ov4-public-memory-preflight.py <openviking-source> <output-json>")

source = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
pin = "234a2d9fe778a9512fd7ebe9807198e847c647ec"

sessions_doc = (source / "docs/en/api/05-sessions.md").read_text(encoding="utf-8")
sdk_doc = (source / "sdk/python/README.md").read_text(encoding="utf-8")
flow_doc = (source / "docs/design/session-memory-extraction-flow.md").read_text(encoding="utf-8")

facts = {
    "public_create_session": "create_session()" in sessions_doc and "client.create_session(" in sdk_doc,
    "public_add_message": ".add_message(" in sdk_doc,
    "public_commit": ".commit(" in sdk_doc,
    "memory_policy_public": "memory_policy" in sessions_doc and '"memory_types": ["profile", "preferences"]' in flow_doc,
    "memory_targets_self_peer": '"self": { "enabled": true }' in flow_doc and '"peer": { "enabled": false }' in flow_doc,
    "working_memory_can_be_disabled": '"working_memory": { "enabled": false }' in flow_doc,
    "commit_runs_memory_extraction": "commit still archives messages and runs configured memory extraction" in flow_doc,
    "public_extraction_entry_documented": "extract_long_term_memories` is the only public extraction" in flow_doc,
    "memory_storage_user_namespace": "viking://user/<user_id>/..." in flow_doc,
    "peer_storage_namespace": "viking://user/<user_id>/peers/<peer_id>/..." in flow_doc,
}

for name, value in facts.items():
    if not value:
        raise AssertionError(f"missing pinned public-memory fact: {name}")

report = {
    "schema_version": 1,
    "track": "C2",
    "gate": "OV-4A-public-memory-seam-preflight",
    "candidate": "volcengine/OpenViking",
    "revision": pin,
    "facts": facts,
    "public_flow": [
        "SyncHTTPClient.create_session(memory_policy=...)",
        "client.session(session_id).add_message(...) via HTTP SDK",
        "client.session(session_id).commit(...) via HTTP SDK",
        "user memory persisted under canonical viking://user/<user_id>/ namespace",
    ],
    "bounded_execution_status": {
        "deterministic_offline_end_to_end_proven_at_pin": False,
        "reason": "Pinned public docs establish the session-memory seam, but actual extraction invokes model-driven SessionCompressorV3. OV-4 executable PASS requires a bounded supported model profile rather than private extractor/storage hooks.",
    },
    "authority_boundary": {
        "memory_is_context_only": True,
        "memory_is_accepted_state": False,
        "memory_is_evidence_truth": False,
        "memory_is_capability_authority": False,
        "memory_is_coordination_ownership": False,
    },
    "upstream_risks_to_revalidate": [
        "OpenViking issue #4009 requests an offline public session-memory integration test using a fixed extraction adapter, indicating that this end-to-end profile is not currently covered upstream.",
        "OpenViking issue #4292 reports prompt-injection risk in memory extraction at the same pin; untrusted memory/resource content must never become Yukh authority.",
    ],
    "result": "PASS",
    "result_scope": "Public session-memory seams are sufficient to attempt bounded OV-4 execution. This is not a memory-profile PASS.",
    "next_gate": "OV-4 bounded executable session-memory flow",
}

output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(output)
