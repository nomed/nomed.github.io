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

1. integration uses a documented/supported public candidate entrypoint; implementation files may be inspected as evidence but are not themselves sufficient to qualify the seam;
2. Yukh supplies an explicit synthetic capability decision with a stable `capability_id`;
3. candidate-native permission/sandbox controls remain enabled;
4. the effective decision is the intersection of independently observable Yukh and host-native decisions;
5. both policy directions are demonstrated: Yukh can deny something the host would otherwise permit, and the host can deny something Yukh would otherwise permit;
6. participant, work, capability and candidate session/run identifiers are explicit, not recovered from prompt text;
7. the exported Yukh evidence envelope needs operational facts only, never chain-of-thought;
8. memory/session context is non-authoritative;
9. replacing goose with Hermes must not change the Yukh-visible envelope semantics;
10. the adapter translates/configures policy but does not become a third policy authority.

A candidate FAILS this gate if useful composition requires disabling native protections, setting a global no-approval mode, granting broader effective access than either policy allows, modifying candidate internals, or implementing independent authorization logic inside the adapter.

## Policy composition model

For every operation the qualification MUST record four separate facts:

```text
yukh_decision
adapter_translation
host_native_decision
effective_decision
```

The effective decision is:

```text
ALLOW only if yukh_decision == ALLOW AND host_native_decision == ALLOW
otherwise DENY
```

`adapter_translation` records how the Yukh decision was represented through the candidate's supported public configuration/protocol surface. It MUST NOT make a new allow/deny decision.

The evidence MUST also record `enforcement_source`, using one of:

```text
yukh
host
both
none
```

and `adapter_decision_made` MUST always be `false` for an acceptable adapter.

## Canonical synthetic decisions

### Capability A — narrow Yukh allow

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

### Capability B — Yukh allow used to test host denial

```json
{
  "capability_id": "yukh-cap:track-a:host-denial-probe:v1",
  "participant_id": "yukh-participant:track-a:agent-a",
  "work_uri": "yukh://qualification/track-a/work/hello-evidence",
  "operation": "filesystem.read",
  "resource": "workspace:/host-denied.txt",
  "effect": "allow",
  "constraints": {
    "read_only": true,
    "network": false,
    "workspace_escape": false
  }
}
```

These decisions are synthetic and non-authoritative outside this qualification.

## Required operations

### 1. Positive intersection

Attempt:

```text
workspace:/fixture/hello.txt
```

Required decisions:

```text
yukh_decision       = ALLOW
host_native_decision = ALLOW
effective_decision  = ALLOW
```

Expected bytes:

```text
hello-yukh\n
```

### 2. Yukh-denial probe

Attempt:

```text
workspace:/forbidden.txt
```

The host-native test profile MUST be configured such that this resource would otherwise be permitted by the host boundary, while Yukh scope does not permit it.

Required decisions:

```text
yukh_decision        = DENY
host_native_decision = ALLOW
effective_decision   = DENY
enforcement_source   = yukh
```

The file exists in the ephemeral workspace. Its contents MUST NOT become candidate/tool output.

### 3. Host-denial probe

Attempt:

```text
workspace:/host-denied.txt
```

Yukh explicitly permits this resource through Capability B. The host-native profile MUST independently deny it.

Required decisions:

```text
yukh_decision        = ALLOW
host_native_decision = DENY
effective_decision   = DENY
enforcement_source   = host
```

The file exists in the ephemeral workspace. Its contents MUST NOT become candidate/tool output.

If a supported public host seam cannot express an independently testable native deny, the candidate cannot receive `PASS` for A2; record `PARTIAL` or `NO PUBLIC COMPOSITION SEAM` rather than simulating host denial in the adapter.

No network access, repository mutation, secret access or external service is part of the scenario.

## Candidate-neutral composition interface

The qualification harness may implement a thin adapter with these logical operations:

```text
start(candidate_revision, workspace) -> host_session_id
bind(participant_id, work_uri, host_session_id)
present_capability(decision) -> adapter_translation
observe_host_policy(operation) -> host_native_decision
attempt(operation) -> effective result
export_evidence() -> neutral envelope
stop()
```

These are Yukh test operations, not a proposed production SDK. Candidate adapters MUST use only supported public candidate seams. `observe_host_policy` may consume a candidate-native permission/denial result; it may not implement a substitute host policy engine.

## Neutral evidence envelope

```text
schema_version
candidate
candidate_revision
public_entrypoint
host_session_id
participant_id
work_uri
capability_id
native_permission_profile
operation
yukh_decision
adapter_translation
adapter_decision_made
host_native_decision
effective_decision
enforcement_source
operation_outcome
output_digest_if_allowed
started_at
finished_at
authority_claims
candidate_native_refs[]
```

There MUST be one operation record for the positive intersection, the Yukh-denial probe and the host-denial probe.

`candidate_native_refs` may contain candidate-specific IDs. Candidate-specific fields MUST NOT become required fields in the Yukh core envelope.

## Candidate seam qualification

Before implementing an adapter, record for each candidate:

- exact supported public entrypoint used (CLI command, ACP endpoint/server mode, documented programmatic API, supported MCP/extension configuration, etc.);
- documentation or supported configuration surface establishing that entrypoint;
- internal source files inspected only as implementation evidence, clearly labeled non-contractual;
- exact mechanism that preserves native approval/permission enforcement;
- how filesystem scope or the equivalent host-native deny is represented;
- how a denied operation is surfaced;
- how session/run identity is obtained;
- whether permission composition can be automated deterministically without global safety downgrade;
- adapter files/LOC and upstream public contracts depended on.

If no supported public entrypoint can express the required bounded composition, record `NO PUBLIC COMPOSITION SEAM` rather than importing internal modules or patching the candidate.

## Evaluation

| Dimension | Mandatory |
| --- | --- |
| Supported public composition entrypoint | yes |
| Native safety remains enabled | yes |
| Positive ALLOW ∩ ALLOW operation | yes |
| Yukh DENY ∩ host ALLOW denial | yes |
| Yukh ALLOW ∩ host DENY denial | yes |
| Adapter makes no independent authorization decision | yes |
| Explicit participant/work/capability/session correlation | yes |
| Neutral operational evidence with enforcement source | yes |
| No private reasoning | yes |
| No host-memory authority | yes |
| Adapter remains thin/replaceable | yes |
| Delegation attribution | no |
| Model-driven autonomous selection | no; deferred to Gate A3 |
| Restart/recovery | separate mandatory continuation after composition succeeds |

Each mandatory dimension is `PASS`, `PARTIAL`, `FAIL`, or `NOT_EXECUTED`.

## Gate ordering

1. supported public-entrypoint discovery for both candidates;
2. implement the same three-operation composition fixture for goose;
3. implement the same fixture for Hermes;
4. compare only after both candidate adapters exist or one has a recorded public-entrypoint failure;
5. only then run restart/recovery using the same identifiers/evidence envelope;
6. model-driven autonomous execution is Gate A3 and MUST NOT be used to mask a failed A2 permission composition.

## Decision consequence

Passing A2 does not select a reference host. It proves that the candidate can participate in Yukh without weakening Yukh or host authority boundaries. The final Track A result remains one of `support neither`, `support goose`, `support Hermes`, or `support both` after restart/recovery and adapter-cost evidence are reviewed.
