#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit("usage: ov5-governance-preflight.py <openviking-source> <output-json>")

source = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
pin = "234a2d9fe778a9512fd7ebe9807198e847c647ec"
admin = (source / "docs/en/api/08-admin.md").read_text(encoding="utf-8")
client = (source / "sdk/python/openviking_sdk/client.py").read_text(encoding="utf-8")

facts = {
    "api_key_role_from_key": "effective role is always derived from the presented API key" in admin,
    "trusted_identity_headers": "X-OpenViking-Account" in admin and "X-OpenViking-User" in admin,
    "user_scoped_memory_namespace": "User memory uses user-scoped namespaces" in admin,
    "public_create_account": "admin_create_account" in admin and "admin_create_account" in client,
    "public_register_user": "admin_register_user" in admin and "admin_register_user" in client,
    "public_remove_user": "admin_remove_user" in admin and "admin_remove_user" in client,
    "remove_revokes_key_immediately": "API key is revoked immediately" in admin,
    "remove_has_deletion_fence": "Write a deletion fence and revoke the user's API key" in admin,
    "remove_cleanup_async": "owned data cleanup runs asynchronously" in admin,
    "remove_returns_task": "Return the deletion task ID" in admin,
    "cannot_conflate_delete_with_acl_revoke": True,
}
for name, value in facts.items():
    if not value:
        raise AssertionError(f"missing pinned OV-5 governance fact: {name}")

report = {
    "schema_version": 1,
    "track": "C2",
    "gate": "OV-5-governance-preflight",
    "candidate": "volcengine/OpenViking",
    "revision": pin,
    "facts": facts,
    "candidate_semantics": {
        "identity_isolation_candidate": "api_key mode with account/user keys and user-scoped memory namespaces",
        "revocation_candidate": "admin_remove_user immediately revokes the user API key and starts fenced asynchronous owned-data cleanup",
        "revocation_semantic_class": "identity/key revocation plus user deletion; not a standalone per-memory ACL revoke",
        "team_acl_status": "not established by this preflight; self/peer routing must not be reported as ACL until executable evidence proves enforcement",
    },
    "execution_plan": [
        "create synthetic account + users A/B through public admin SDK",
        "create memory as user A through public session commit",
        "prove A can read and B cannot read A canonical memory URI using independent API keys/processes",
        "remove A through public admin_remove_user and prove A key fails immediately",
        "wait for public deletion task completion and prove fresh B/root observations distinguish access revocation from cleanup",
        "restart same storage and prove revoked A access does not reappear",
        "record peer/team behavior separately without inferring ACL from namespace shape",
    ],
    "result": "PASS",
    "result_scope": "Pinned public identity and revocation seams are sufficient to attempt executable OV-5. This is not an OV-5 PASS.",
    "next_gate": "OV-5 executable identity isolation and revocation",
}
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(output)
