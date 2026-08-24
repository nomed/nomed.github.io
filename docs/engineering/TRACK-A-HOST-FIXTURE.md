# Track A — Yukh agent-host qualification fixture

- **Status:** qualification fixture; not an adoption decision
- **Governing issue:** #58
- **Parent landscape:** #56
- **Accepted architecture:** RFC-0003 remains authoritative
- **Candidates:** goose, Hermes Agent

## Purpose

Determine whether Yukh can use a replaceable external agent host instead of building a Yukh-owned agent loop/runtime host.

The same fixture MUST be used for every candidate. A candidate may pass, partially pass, or fail. Feature count is not a substitute for evidence.

## Semantic invariants

The host MUST NOT become authoritative merely because it owns a session, memory, tool loop, subagents, approvals, or an execution backend.

The fixture preserves these boundaries:

- Yukh Coordination owns accepted coordination events, claims, conflict and handoff semantics.
- Yukh MCP owns the Yukh capability decision/evidence contract for the capability under test.
- Host-native permission/sandbox controls remain active and are not bypassed.
- Host/session memory is context, not accepted project state or evidence truth.
- Accepted work state remains outside the host.
- No private chain-of-thought is required or captured.

## Candidate pinning

Each qualification record MUST identify:

- canonical repository;
- tested commit SHA or released version;
- public integration seam used;
- host configuration relevant to permissions, memory and execution;
- external dependencies required by the tested profile.

A later candidate revision is a new qualification input, not an implicit pass.

## Synthetic mission thread

Canonical work URI:

```text
yukh://qualification/track-a/work/hello-evidence
```

Synthetic operation:

```text
Read an invented local fixture file containing `hello-yukh`, compute its SHA-256,
and return the digest plus the exact byte length.
```

The operation is intentionally read-only, local, deterministic and credential-free.

Expected fixture bytes:

```text
hello-yukh
```

including one trailing newline.

The fixture MUST be created inside an ephemeral candidate-specific workspace and deleted after qualification.

## Required flow

### 1. Participant start

Start one isolated host session.

Evidence:

- host/runtime identity;
- candidate revision;
- generated session/run identifier;
- participant identity binding chosen by the adapter.

Pass condition: Yukh can attribute subsequent events to a stable participant without adopting a candidate-native identity as the Yukh identity model.

### 2. Coordination join

Using a public integration seam, represent a Yukh `join`/presence interaction against a synthetic Coordination adapter or deterministic fixture.

Pass condition: no host-specific field becomes required in the Yukh coordination envelope.

### 3. Work correlation

Associate the canonical work URI with the host task/session.

Pass condition: correlation can be recovered from explicit identifiers rather than prompt text or chat history.

### 4. Capability decision

Present a synthetic Yukh capability decision for read-only access to exactly the ephemeral fixture file.

The host's own permission/sandbox mechanism MUST remain enabled.

Evidence:

- Yukh capability identifier;
- candidate-native permission/sandbox profile;
- whether one or two user approvals are required;
- exact composition rule.

Fail condition: the candidate requires disabling its native safety model, setting global `never ask`, or granting broader access merely to consume the bounded Yukh decision.

### 5. Execution

Read the fixture, compute SHA-256 and byte length.

No network, repository mutation, credential or external service is permitted.

Pass condition: execution can be bounded to the intended workspace/profile and the trust boundary is stated precisely.

### 6. Evidence export

Return a vendor-neutral evidence record containing at minimum:

```text
participant_id
host
host_revision
session_or_run_id
work_uri
capability_id
operation
input_ref
output_digest
output_length
started_at
finished_at
outcome
```

Optional candidate-native references MAY be attached.

Fail condition: evidence requires chain-of-thought, unrestricted prompt/session export, or candidate-specific fields in the Yukh core record.

### 7. Restart / reconnect

Terminate and restart/reconnect using only candidate-supported public mechanisms.

Pass condition:

- enough context can be restored to correlate the participant, work URI and prior evidence;
- restoration does not assert that host memory is accepted Yukh state;
- loss of host memory does not invalidate already accepted Yukh evidence.

### 8. Delegation

If the candidate supports subagents/delegation, repeat only the digest operation through one child participant.

Evidence MUST retain parent/child attribution and causation.

A candidate without delegation support does not automatically fail the host track; it receives `not available` for this dimension.

### 9. Handoff projection

Produce the candidate-neutral inputs needed for a synthetic Yukh progress → review → handoff sequence.

Pass condition: replacing goose with Hermes, or vice versa, does not change the Yukh-visible semantics.

## Evaluation matrix

Each dimension receives one of:

- `PASS` — demonstrated through the pinned public seam;
- `PARTIAL` — usable but with bounded limitations;
- `FAIL` — violates an invariant or requires unacceptable coupling;
- `NOT AVAILABLE` — capability is absent but not a mandatory host criterion;
- `NOT EXECUTED` — documentary evidence exists but runtime qualification has not occurred.

| Dimension | Mandatory for host recommendation? |
| --- | --- |
| Stable public integration seam | yes |
| MCP composition | yes for current reference scenario |
| ACP/client interoperability | no, but strategically relevant |
| Native permission composition | yes |
| Participant attribution | yes |
| Memory separation | yes |
| Delegation attribution | no |
| Explicit execution trust boundary | yes |
| Restart/recovery | yes |
| Evidence export without private reasoning | yes |
| Model/provider neutrality | yes |
| Thin adapter / maintenance burden | yes |
| Compatible license/operability profile | yes |

## Decision rule

A candidate cannot be recommended as a Yukh reference host if any mandatory dimension is `FAIL`.

A candidate with mandatory `NOT EXECUTED` items can only remain a **qualification candidate**.

Possible Track A conclusions:

- `support neither`;
- `support goose`;
- `support Hermes`;
- `support both`.

Only after both candidate records are reviewed may Track A answer whether a Yukh-owned host is still necessary.

## Non-goals

- benchmark model quality;
- compare UX aesthetics;
- compare popularity or feature count;
- deploy either candidate into production;
- fork external source code;
- change RFC-0003;
- create a Yukh runtime repository.
