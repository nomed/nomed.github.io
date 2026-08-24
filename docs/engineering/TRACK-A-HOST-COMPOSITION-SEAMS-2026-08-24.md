# Track A — host-composition public seams — 2026-08-24

- **Status:** seam discovery; no A2 PASS/FAIL yet
- **Governing issue:** #58
- **Gate contract:** `TRACK-A-HOST-COMPOSITION-GATE.md`

## Why this record exists

The first runtime gate proved that both candidates have executable ACP/MCP/permission substrate. A2 requires a stricter result: Yukh must enter through a supported public entrypoint and preserve native security. Source visibility is evidence, not automatically an integration contract.

For each candidate this record separates:

1. **supported/invokable entrypoints** — eligible for an A2 adapter;
2. **documented configuration/protocol surfaces** — eligible inputs to the adapter;
3. **implementation evidence** — source/tests that explain behavior but MUST NOT be imported as private integration hooks.

A2 also requires **observed native controls**. A configured allow/deny is not sufficient: the candidate seam must emit or directly expose behavior proving the host ALLOW/DENY used in the composition claim.

## goose

Pinned revision: `bd16fbfbbe78cadc2cc3ce6295691772df51d71f`

### Supported/invokable entrypoints to qualify

Candidate public surfaces observed at the pinned revision include:

- goose ACP server mode / ACP-facing server entrypoint exposed by the project;
- supported MCP/extension configuration consumed by goose;
- documented/headless goose execution surfaces where applicable to session startup.

The A2 implementation MUST name the exact command/protocol endpoint/configuration it invokes. Merely importing a Rust module from `crates/goose/src/acp/` is not acceptable evidence of a public seam.

### Documented/configuration surfaces

- MCP extension/server configuration;
- explicit goose permission modes such as approve/smart-approve/chat/auto;
- extension scoping/configuration available to external tools/subagents.

`auto` remains disallowed as A2 proof because it would erase the native approval boundary.

### Implementation evidence only — non-contractual

The following are useful to understand behavior but are NOT themselves public integration contracts:

- `crates/goose/src/acp/` implementation files;
- permission-decision mapping tests;
- ACP new/load/resume/replay tests;
- MCP conversion/server tests.

Useful substrate evidence from run `32705914861`: 320 ACP-filtered Rust tests passed, including permission mappings, approval-mode behavior, MCP conversion and session/replay behavior.

### A2 seam hypothesis

**Supported ACP server entrypoint + supported MCP/extension configuration is the preferred composition path.** Yukh should present one narrowly scoped synthetic tool/capability through supported configuration/protocol surfaces while the host remains in an approval-capable mode.

Open questions before adapter implementation:

1. What exact supported command/API starts the ACP server profile?
2. Can the test supply a deterministic ACP client permission response while keeping goose in `approve` or `smart-approve` semantics?
3. Can a host-only control for `forbidden.txt` be executed through the same profile and produce an observable native ALLOW reference before the Yukh-denied composed probe?
4. Can goose independently deny `host-denied.txt`, explicitly allowed by Yukh, and emit an observable native DENY reference through a supported boundary?
5. Can denial happen before file content enters tool output?
6. Can ACP session identifiers and Yukh participant/work/capability IDs be correlated without prompt-only identity?

If (3) or (4) cannot be observed through a supported public entrypoint/configuration, A2 cannot be `PASS`; record `PARTIAL` or `NO PUBLIC COMPOSITION SEAM` rather than inferring the host decision.

## Hermes Agent

Pinned revision: `a0ca7c19204e514f9590ce3b812e029b315ab9e9`

### Supported/invokable entrypoints to qualify

Candidate public surfaces observed at the pinned revision include:

- Hermes CLI ACP launcher/integration;
- documented ACP adapter/server operation exposed through the CLI-supported path;
- documented programmatic integration surface;
- supported MCP configuration/discovery surfaces.

The A2 implementation MUST invoke one of these supported entrypoints. Directly importing arbitrary internal objects from `acp_adapter/` or `tools/approval.py` is insufficient unless the project documents that API as supported programmatic integration.

### Documented/configuration surfaces

- ACP launch/configuration through Hermes CLI;
- programmatic integration documentation;
- approval behavior exposed through supported runtime paths;
- MCP discovery/configuration.

The first A2 execution profile remains local. Docker/SSH/serverless execution are separate trust profiles.

### Implementation evidence only — non-contractual

The following are evidence of behavior but not integration contracts by themselves:

- `acp_adapter/server.py`;
- `tools/approval.py`;
- ACP/session/edit-approval/MCP-discovery tests;
- internal runtime helpers.

Useful substrate evidence from run `32705914861`: the `.[all,dev]` profile installed on Python 3.11 and the selected ACP/session/approval/MCP corpus passed 27 tests.

### A2 seam hypothesis

**Hermes supported ACP CLI/programmatic entrypoint + supported approval/MCP surfaces is the preferred composition path.** Persistent memory is not required for A2 and must remain non-authoritative.

Open questions before adapter implementation:

1. What exact supported command/API starts the local ACP profile and exposes a stable host session identifier?
2. Can the public ACP/programmatic path accept one bounded Yukh capability without bypassing native approval?
3. Can a host-only control for `forbidden.txt` produce an observable native ALLOW reference through the same profile before Yukh denies it in the composed probe?
4. Can Hermes independently deny `host-denied.txt`, allowed by Yukh, and emit an observable native DENY reference through a supported permission/execution profile?
5. Does the candidate-native observation surface enough IDs for causation without conversation-memory export?
6. Can persistent memory be disabled or ignored so it cannot become evidence authority?

If (3) or (4) is available only through an undocumented import, A2 cannot be `PASS`; record `PARTIAL` or `NO PUBLIC COMPOSITION SEAM`.

## Two-sided policy proof with controls

The executable adapter for each candidate MUST demonstrate the following through candidate-native observations:

| Probe | Yukh | Observed host | Effective | Required source |
| --- | --- | --- | --- | --- |
| positive | ALLOW | ALLOW | ALLOW | none |
| host-only control for forbidden | neutral/absent resource restriction | ALLOW | host ALLOW observed | host control |
| Yukh-denial composed probe | DENY | ALLOW from control | DENY | yukh |
| host-denial control/composed probe | ALLOW | DENY | DENY | host |

Every host observation must carry a `candidate_native_ref` directly attributable to the supported candidate seam. Documentation or configuration alone cannot populate `host_native_decision`.

The adapter records translation separately and `adapter_decision_made=false`. If it decides authorization itself, the candidate fails the composition design.

## Common implementation rule

The next executable artifact MUST NOT:

- monkey-patch candidate code;
- edit checked-out external repositories;
- import undocumented internal APIs as supported seams;
- set goose to global auto/no-approval merely to pass;
- disable Hermes approval machinery;
- implement or infer host-native denial/allow inside the Yukh adapter;
- call a paid model provider;
- infer PASS from upstream unit tests alone.

The adapter may configure candidates only through supported public configuration/protocol/programmatic surfaces available at the pinned revision.

## Current seam verdict

| Candidate | Supported public entrypoint identified? | Permission machinery exists | Native controls observed for A2? | Two-sided A2 proven? |
| --- | --- | --- | --- | --- |
| goose | **CANDIDATE ENTRYPOINTS IDENTIFIED; exact invocation to pin in adapter** | **YES** | **NOT EXECUTED** | **NOT EXECUTED** |
| Hermes | **CANDIDATE ENTRYPOINTS IDENTIFIED; exact invocation to pin in adapter** | **YES** | **NOT EXECUTED** | **NOT EXECUTED** |

This record intentionally does not say `Public seam exists = YES` merely because source is visible. A2 must pin the actual supported entrypoint and observe its native controls before PASS.

Neither candidate is preferred by this discovery record.
