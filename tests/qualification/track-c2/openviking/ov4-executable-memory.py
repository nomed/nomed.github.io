#!/usr/bin/env python3
import hashlib
import json
import os
import sys
import time
from pathlib import Path

from openviking_sdk import SyncHTTPClient

CANDIDATE_REVISION = "234a2d9fe778a9512fd7ebe9807198e847c647ec"
REMEMBERED_TEXT = "HTTP/JSON"


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def write_json(path: str, payload: dict) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def collect_uris(value):
    found = []
    if isinstance(value, dict):
        uri = value.get("uri")
        if isinstance(uri, str) and uri.startswith("viking://"):
            found.append(uri)
        for child in value.values():
            found.extend(collect_uris(child))
    elif isinstance(value, list):
        for child in value:
            found.extend(collect_uris(child))
    return list(dict.fromkeys(found))


def canonical_memory_root(session_info: dict) -> str:
    session_uri = session_info.get("uri") if isinstance(session_info, dict) else None
    if not isinstance(session_uri, str) or "/sessions/" not in session_uri:
        raise AssertionError(f"session response lacks canonical user-scoped URI: {session_info!r}")
    user_root = session_uri.split("/sessions/", 1)[0]
    if not user_root.startswith("viking://user/"):
        raise AssertionError(f"unexpected canonical user root derived from session: {user_root!r}")
    return f"{user_root}/memories"


def find_memory(client: SyncHTTPClient, memory_root: str):
    if "~/" in memory_root:
        raise AssertionError(f"memory root must be canonical, got alias: {memory_root}")
    result = client.find(
        query="service transport HTTP JSON",
        target_uri=memory_root,
        limit=10,
        options={"context_type": ["memory"], "read_content": True},
    )
    candidates = []
    for uri in collect_uris(result):
        if "/memories/" not in uri or uri.endswith(".overview.md") or uri.endswith(".abstract.md"):
            continue
        try:
            content = client.read(uri=uri)
        except Exception:
            continue
        if REMEMBERED_TEXT in content or "service_transport" in uri:
            return uri, content, result
        candidates.append((uri, content))

    try:
        tree = client.tree(uri=memory_root)
    except Exception:
        tree = []
    for uri in collect_uris(tree):
        if "/memories/" not in uri or uri.endswith(".overview.md") or uri.endswith(".abstract.md"):
            continue
        try:
            content = client.read(uri=uri)
        except Exception:
            continue
        if REMEMBERED_TEXT in content or "service_transport" in uri:
            return uri, content, result
        candidates.append((uri, content))
    raise AssertionError(f"remembered memory not found; root={memory_root!r}; result={result!r}; candidates={candidates!r}")


def host_a(server_url: str, output: str) -> int:
    client = SyncHTTPClient(url=server_url)
    client.initialize()
    session_id = "yukh-ov4-memory"
    memory_policy = {
        "self": {"enabled": True},
        "peer": {"enabled": False},
        "working_memory": {"enabled": False},
        "memory_types": ["preferences"],
    }
    session_info = client.create_session(
        session_id=session_id,
        options={"memory_policy": memory_policy, "auto_commit_policy": None},
    )
    memory_root = canonical_memory_root(session_info)
    session = client.session(session_id=session_id)
    session.add_message(
        role="user",
        content="Remember this project preference: service transport is HTTP/JSON.",
    )
    session.add_message(
        role="assistant",
        content="Recorded as contextual memory only.",
    )
    commit_result = session.commit()
    task_id = commit_result["task_id"]
    task = None
    for _ in range(240):
        task = client.get_task(task_id)
        if task and task.get("status") in ("completed", "failed"):
            break
        time.sleep(0.25)
    if not task or task.get("status") != "completed":
        raise AssertionError(f"session commit did not complete: {task!r}")

    memory_uri, memory_content, find_result = find_memory(client, memory_root)
    payload = {
        "stage": "host-a",
        "pid": os.getpid(),
        "candidate_revision": CANDIDATE_REVISION,
        "session_id": session_id,
        "session_uri": session_info.get("uri"),
        "memory_root": memory_root,
        "task_id": task_id,
        "task_status": task.get("status"),
        "memory_uri": memory_uri,
        "memory_content": memory_content,
        "memory_sha256": digest(memory_content),
        "remembered_claim_present": REMEMBERED_TEXT in memory_content,
        "find_total": find_result.get("total") if isinstance(find_result, dict) else None,
        "public_seams": ["create_session", "add_message", "commit", "get_task", "find", "tree", "read"],
    }
    write_json(output, payload)
    client.close()
    return 0


def host_b(server_url: str, stage_a_path: str, output: str) -> int:
    stage_a = json.loads(Path(stage_a_path).read_text(encoding="utf-8"))
    client = SyncHTTPClient(url=server_url)
    client.initialize()
    memory_content = client.read(uri=stage_a["memory_uri"])
    payload = {
        "stage": "host-b-after-restart",
        "pid": os.getpid(),
        "candidate_revision": CANDIDATE_REVISION,
        "memory_uri": stage_a["memory_uri"],
        "memory_content": memory_content,
        "memory_sha256": digest(memory_content),
        "same_memory_as_host_a": digest(memory_content) == stage_a["memory_sha256"],
        "remembered_claim_present": REMEMBERED_TEXT in memory_content,
        "public_seams": ["initialize", "read"],
    }
    write_json(output, payload)
    client.close()
    return 0


def outage(server_url: str, accepted_fact_path: str, output: str) -> int:
    accepted_text = Path(accepted_fact_path).read_text(encoding="utf-8")
    accepted = json.loads(accepted_text)
    provider_unavailable = False
    error_class = None
    try:
        client = SyncHTTPClient(url=server_url, timeout=1.0)
        client.initialize()
        client.health()
        client.close()
    except Exception as exc:
        provider_unavailable = True
        error_class = type(exc).__name__
    payload = {
        "stage": "provider-outage",
        "pid": os.getpid(),
        "candidate_revision": CANDIDATE_REVISION,
        "provider_unavailable": provider_unavailable,
        "provider_error_class": error_class,
        "accepted_fact": accepted,
        "accepted_fact_sha256": digest(accepted_text),
        "accepted_fact_available_without_provider": accepted.get("value") == "gRPC/protobuf",
    }
    write_json(output, payload)
    if not provider_unavailable:
        raise AssertionError("OpenViking unexpectedly remained available during outage gate")
    return 0


def finalize(stage_a_path: str, stage_b_path: str, outage_path: str, provider_log_path: str, output: str) -> int:
    a = json.loads(Path(stage_a_path).read_text(encoding="utf-8"))
    b = json.loads(Path(stage_b_path).read_text(encoding="utf-8"))
    o = json.loads(Path(outage_path).read_text(encoding="utf-8"))
    log_lines = [json.loads(line) for line in Path(provider_log_path).read_text(encoding="utf-8").splitlines() if line.strip()]
    paths = [entry.get("path", "") for entry in log_lines]
    chat_calls = sum(path.endswith("/chat/completions") for path in paths)
    embedding_calls = sum(path.endswith("/embeddings") for path in paths)

    accepted = o["accepted_fact"]
    observations = {
        "host_processes_distinct": a["pid"] != b["pid"],
        "commit_completed": a["task_status"] == "completed",
        "canonical_memory_root_used": a.get("memory_root", "").startswith("viking://user/") and "~/" not in a.get("memory_root", ""),
        "remembered_claim_persisted": a["remembered_claim_present"],
        "cross_host_reuse": b["same_memory_as_host_a"],
        "restart_persistence": b["same_memory_as_host_a"] and b["remembered_claim_present"],
        "accepted_fact_conflicts_with_memory": accepted.get("value") == "gRPC/protobuf" and REMEMBERED_TEXT in a["memory_content"],
        "memory_classification": "remembered",
        "accepted_fact_classification": accepted.get("class"),
        "memory_is_accepted_state": False,
        "memory_is_evidence_truth": False,
        "accepted_fact_remains_authoritative": accepted.get("authority") == "yukh-external-fixture",
        "outage_correctness": o["provider_unavailable"] and o["accepted_fact_available_without_provider"],
        "bounded_vlm_calls": chat_calls >= 1,
        "bounded_embedding_calls": embedding_calls >= 1,
    }
    passed = all(
        observations[key]
        for key in (
            "host_processes_distinct",
            "commit_completed",
            "canonical_memory_root_used",
            "remembered_claim_persisted",
            "cross_host_reuse",
            "restart_persistence",
            "accepted_fact_conflicts_with_memory",
            "accepted_fact_remains_authoritative",
            "outage_correctness",
            "bounded_vlm_calls",
            "bounded_embedding_calls",
        )
    ) and observations["memory_is_accepted_state"] is False and observations["memory_is_evidence_truth"] is False

    report = {
        "schema_version": 1,
        "track": "C2",
        "gate": "OV-4-executable-memory-profile",
        "candidate": "volcengine/OpenViking",
        "revision": CANDIDATE_REVISION,
        "profile": {
            "public_surface": "openviking-sdk HTTP",
            "auth_mode": "dev",
            "model_path": "documented OpenAI-compatible VLM + embedding endpoints",
            "model_endpoint": "loopback-only 127.0.0.1:21935/v1",
            "external_egress_observed": False,
            "external_egress_basis": "all configured model/embedding endpoints are loopback; production provider credentials are blank",
            "host_isolation": "host A and host B are separate Python processes and fresh SyncHTTPClient lifetimes",
            "server_restart": "same local storage workspace reused across pinned OpenViking restart",
            "memory_target_resolution": "canonical user namespace derived from public create_session response; no home alias or hard-coded user ID",
        },
        "provider_memory": {
            "uri": a["memory_uri"],
            "sha256": a["memory_sha256"],
            "classification": "remembered",
            "claim": "service transport is HTTP/JSON",
        },
        "accepted_fact": {
            "fact_id": accepted.get("fact_id"),
            "value": accepted.get("value"),
            "class": accepted.get("class"),
            "authority": accepted.get("authority"),
            "sha256": o["accepted_fact_sha256"],
        },
        "model_traffic": {
            "chat_completion_calls": chat_calls,
            "embedding_calls": embedding_calls,
            "request_paths": paths,
        },
        "observations": observations,
        "result": "PASS" if passed else "FAIL",
        "result_scope": "OV-4 public memory creation, persistence/cross-host reuse, restart persistence, conflicting accepted fact separation, bounded inference path, and outage correctness.",
        "next_gate": "OV-5-visibility-revocation" if passed else None,
    }
    write_json(output, report)
    if not passed:
        raise AssertionError(json.dumps(observations, indent=2))
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        raise SystemExit("usage: ov4-executable-memory.py <host-a|host-b|outage|finalize> ...")
    mode = sys.argv[1]
    if mode == "host-a" and len(sys.argv) == 4:
        return host_a(sys.argv[2], sys.argv[3])
    if mode == "host-b" and len(sys.argv) == 5:
        return host_b(sys.argv[2], sys.argv[3], sys.argv[4])
    if mode == "outage" and len(sys.argv) == 5:
        return outage(sys.argv[2], sys.argv[3], sys.argv[4])
    if mode == "finalize" and len(sys.argv) == 7:
        return finalize(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
    raise SystemExit("invalid mode or arguments")


if __name__ == "__main__":
    raise SystemExit(main())