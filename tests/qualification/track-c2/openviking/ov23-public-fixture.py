#!/usr/bin/env python3
import hashlib
import json
import sys
from pathlib import Path

from openviking_sdk import SyncHTTPClient, use_actor_peer

CANDIDATE_REVISION = "234a2d9fe778a9512fd7ebe9807198e847c647ec"
BASE_URI = "viking://resources/yukh-track-c2"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def envelope(source_path: str, source_revision: str, content: str) -> str:
    digest = sha256_text(content)
    return (
        "---\n"
        "yukh_context_class: canonical\n"
        f"yukh_source_path: {source_path}\n"
        f"yukh_source_revision: {source_revision}\n"
        f"yukh_source_sha256: {digest}\n"
        "---\n\n"
        f"{content}"
    )


def main() -> int:
    if len(sys.argv) != 4:
        raise SystemExit("usage: ov23-public-fixture.py <server-url> <fixture-dir> <output-json>")

    server_url, fixture_dir_arg, output_arg = sys.argv[1:]
    fixture_dir = Path(fixture_dir_arg).resolve()
    output = Path(output_arg).resolve()

    fixture_files = [
        "adr/ADR-001.md",
        "rfcs/RFC-001.md",
        "golden-path/java.md",
        "src/example.py",
    ]

    canonical = {}
    for rel in fixture_files:
        content = (fixture_dir / rel).read_text(encoding="utf-8")
        canonical[rel] = {
            "content": content,
            "sha256": sha256_text(content),
            "revision": "git-fixture-v1",
        }

    client = SyncHTTPClient(url=server_url)
    client.initialize()

    provider_refs = {}
    for rel, record in canonical.items():
        uri = f"{BASE_URI}/{rel}"
        projected = envelope(rel, record["revision"], record["content"])
        result = client.write(uri=uri, content=projected, mode="create", wait=False)
        provider_refs[rel] = {
            "uri": uri,
            "root_uri": result.get("root_uri") if isinstance(result, dict) else None,
            "projected_sha256": sha256_text(projected),
        }

    target_rel = "adr/ADR-001.md"
    target_uri = provider_refs[target_rel]["uri"]
    expected_v1 = envelope(target_rel, canonical[target_rel]["revision"], canonical[target_rel]["content"])

    with use_actor_peer("host-a"):
        host_a_content = client.read(uri=target_uri)

    with use_actor_peer("host-b"):
        host_b_content = client.read(uri=target_uri)

    host_replaceability_pass = host_a_content == expected_v1 and host_b_content == expected_v1

    # Construct an isolated canonical-v2 test copy without mutating the checked-in source file.
    v2_content = canonical[target_rel]["content"].replace(
        "HTTP/JSON for internal synchronous calls",
        "gRPC/protobuf for internal synchronous calls",
    ).replace("Revision: v1", "Revision: v2")
    if v2_content == canonical[target_rel]["content"]:
        raise AssertionError("failed to construct deterministic canonical v2 fixture")

    accepted_v2 = {
        "source_path": target_rel,
        "revision": "isolated-canonical-v2",
        "sha256": sha256_text(v2_content),
        "content": v2_content,
    }

    stale_projection_before_update = client.read(uri=target_uri)
    stale_is_distinguishable = (
        stale_projection_before_update == expected_v1
        and canonical[target_rel]["sha256"] != accepted_v2["sha256"]
        and f"yukh_source_sha256: {canonical[target_rel]['sha256']}" in stale_projection_before_update
        and f"yukh_source_sha256: {accepted_v2['sha256']}" not in stale_projection_before_update
    )

    expected_v2_projection = envelope(target_rel, accepted_v2["revision"], v2_content)
    client.write(uri=target_uri, content=expected_v2_projection, mode="replace", wait=False)

    with use_actor_peer("host-b"):
        host_b_after_reprojection = client.read(uri=target_uri)

    reprojection_pass = host_b_after_reprojection == expected_v2_projection

    canonical_source_unchanged = (fixture_dir / target_rel).read_text(encoding="utf-8") == canonical[target_rel]["content"]

    report = {
        "schema_version": 1,
        "track": "C2",
        "gates": ["OV-2-host-replaceability", "OV-3-canonical-projection"],
        "candidate": "volcengine/OpenViking",
        "revision": CANDIDATE_REVISION,
        "profile": {
            "public_surface": "openviking-sdk HTTP",
            "server_url": server_url,
            "auth_mode": "dev",
            "semantic_wait": False,
            "vlm_configured": False,
            "memory_extraction_enabled": False,
        },
        "yukh_boundary": {
            "canonical_source": "checked-in synthetic fixture / isolated canonical-v2 copy",
            "provider_role": "runtime projection only",
            "actor_peer_is_participant_authority": False,
            "provider_is_accepted_state": False,
            "provider_is_evidence_truth": False,
        },
        "canonical_v1": {
            rel: {"sha256": rec["sha256"], "revision": rec["revision"]}
            for rel, rec in canonical.items()
        },
        "provider_refs": provider_refs,
        "observations": {
            "host_a": {"actor_peer": "host-a", "content_sha256": sha256_text(host_a_content)},
            "host_b": {"actor_peer": "host-b", "content_sha256": sha256_text(host_b_content)},
            "same_projection_across_hosts": host_a_content == host_b_content,
            "host_replaceability_pass": host_replaceability_pass,
            "accepted_v2": {
                "source_path": accepted_v2["source_path"],
                "revision": accepted_v2["revision"],
                "sha256": accepted_v2["sha256"],
            },
            "stale_projection_distinguishable_before_reprojection": stale_is_distinguishable,
            "reprojection_pass": reprojection_pass,
            "canonical_checked_in_source_unchanged": canonical_source_unchanged,
        },
        "result": "PASS" if all([
            host_replaceability_pass,
            stale_is_distinguishable,
            reprojection_pass,
            canonical_source_unchanged,
        ]) else "FAIL",
        "next_gate": "OV-4-memory-profile" if all([
            host_replaceability_pass,
            stale_is_distinguishable,
            reprojection_pass,
            canonical_source_unchanged,
        ]) else None,
    }

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    client.close()

    if report["result"] != "PASS":
        raise AssertionError(json.dumps(report["observations"], indent=2))
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
