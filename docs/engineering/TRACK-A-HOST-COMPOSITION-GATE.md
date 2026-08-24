# Track A — Yukh host-composition gate

- **Status:** executable qualification contract; not yet a result
- **Governing issue:** #58
- **Prior gate:** `TRACK-A-RUNTIME-SUBSTRATE-2026-08-24.md`
- **Candidates:** goose, Hermes Agent
- **Accepted architecture:** RFC-0003 remains authoritative

## Purpose

The runtime-substrate gate proved that both pinned candidates expose executable ACP/MCP/permission machinery. This gate tests the architectural question that actually matters to Yukh: can a Yukh capability decision compose with host-native security and produce portable attribution/evidence without making the host authoritative?

This gate deliberately excludes model quality. A model call is not required to prove authority composition.

## Invariants

A candidate PASS requires all of the following:

1. integration uses a documented/public candidate seam; no source patching or private internal hooks;
2. Yukh supplies an explicit synthetic capability decision with a stable `capability_id`;
3. candidate-native permission/sandbox controls remain enabled;
4. the effective decision is the intersection of Yukh scope and host-native scope;
5. an in-scope read is allowed and an out-of-scope read is denied;
6. participant, work, capability and candidate session/run identifiers are explicit, not recovered from prompt text;
7. the exported Yukh evidence envelope needs operational facts only, never chain-of-thought;
8. memory/session context is non-authoritative;
9. replacing goose with Hermes must not change the Yukh-visible envelope semantics.

A candidate FAILS this gate if useful composition requires disabling native protections, setting a global no-approval mode, granting broader filesystem access than the Yukh capability, or modifying candidate internals.

## Canonical synthetic decision

```json
{
  "capability_id": "yukh-cap:track-a:read-fixture:v1",
  "participant_id": "yukh-participant:track-a:agent-a",
  "work_uri": "yukh://qualification/track-a/work/hello-evidence",
  "operation": "filesystem.read",
  "resource": "workspace:/fixture/hello.txt",
  "effect": "allow",
  "constraints": {
    "read_only": true,
    "network": false,
    "workspace_escape": false
  }
}
```

The decision is synthetic and non-authoritative outside this qualification.

## Positive and negative operations

### Positive

Read exactly:

```text
workspace:/fixture/hello.txt
```

Expected bytes:

```text
hello-yukh\n
```

### Negative

Attempt to read:

```text
workspace:/forbidden.txt
```

The file exists in the ephemeral qualification workspace but is outside the Yukh capability resource. The attempt MUST be denied by the composed policy before its contents become candidate/tool output.

No network access, repository mutation, secret access or external service is part of the scenario.

## Candidate-neutral composition interface

The qualification harness may implement a thin adapter with these logical operations:

```text
start(candidate_revision, workspace) -> host_session_id
bind(participant_id, work_uri, host_session_id)
install_capability(decision)
read(in_scope_path) -> allowed result
read(out_of_scope_path) -> denied result
export_evidence() -> neutral envelope
stop()
```

These are Yukh test operations, not a proposed production SDK. Candidate adapters MUST use only public candidate seams.

## Neutral evidence envelope

```text
schema_version
candidate
candidate_revision
host_session_id
participant_id
work_uri
capability_id
native_permission_profile
positive_operation
positive_outcome
positive_digest
negative_operation
negative_outcome
started_at
finished_at
authority_claims
candidate_native_refs[]
```

`candidate_native_refs` may contain candidate-specific IDs. Candidate-specific fields MUST NOT become required fields in the Yukh core envelope.

## Candidate seam qualification

Before implementing an adapter, record for each candidate:

- exact public seam used (ACP server/client, MCP tool surface, extension/plugin API, programmatic API, etc.);
- exact mechanism that preserves native approval/permission enforcement;
- how filesystem scope is represented;
- how a denied operation is surfaced;
- how session/run identity is obtained;
- whether permission composition can be automated deterministically without global safety downgrade;
- adapter files/LOC and upstream APIs depended on.

If no public seam can express the required bounded composition, record `NO PUBLIC COMPOSITION SEAM` rather than patching the candidate.

## Evaluation

| Dimension | Mandatory |
| --- | --- |
| Public composition seam | yes |
| Native safety remains enabled | yes |
| Positive scoped operation | yes |
| Negative out-of-scope denial | yes |
| Explicit participant/work/capability/session correlation | yes |
| Neutral operational evidence | yes |
| No private reasoning | yes |
| No host-memory authority | yes |
| Adapter remains thin/replaceable | yes |
| Delegation attribution | no |
| Model-driven autonomous selection | no; deferred to Gate A3 |
| Restart/recovery | separate mandatory continuation after composition succeeds |

Each mandatory dimension is `PASS`, `PARTIAL`, `FAIL`, or `NOT_EXECUTED`.

## Gate ordering

1. seam discovery for both candidates;
2. implement the same positive/negative composition fixture for goose;
3. implement the same fixture for Hermes;
4. compare only after both candidate adapters exist or one has a recorded public-seam failure;
5. only then run restart/recovery using the same identifiers/evidence envelope;
6. model-driven autonomous execution is Gate A3 and MUST NOT be used to mask a failed A2 permission composition.

## Decision consequence

Passing A2 does not select a reference host. It proves that the candidate can participate in Yukh without weakening Yukh or host authority boundaries. The final Track A result remains one of `support neither`, `support goose`, `support Hermes`, or `support both` after restart/recovery and adapter-cost evidence are reviewed.
