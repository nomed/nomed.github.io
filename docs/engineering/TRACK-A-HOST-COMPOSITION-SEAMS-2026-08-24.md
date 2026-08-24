# Track A — host-composition public seams — 2026-08-24

- **Status:** seam discovery; no A2 PASS/FAIL yet
- **Governing issue:** #58
- **Gate contract:** `TRACK-A-HOST-COMPOSITION-GATE.md`

## Why this record exists

The first runtime gate proved that both candidates have executable ACP/MCP/permission substrate. A2 requires a stricter result: Yukh must enter through a supported public entrypoint and preserve native security. Source visibility is evidence, not automatically an integration contract.

For each candidate this record therefore separates:

1. **supported/invokable entrypoints** — eligible for an A2 adapter;
2. **documented configuration/protocol surfaces** — eligible inputs to the adapter;
3. **implementation evidence** — source/tests that explain behavior but MUST NOT be imported as private integration hooks.

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

The following are useful to understand the behavior but are NOT themselves public integration contracts:

- `crates/goose/src/acp/` implementation files;
- permission-decision mapping tests;
- ACP new/load/resume/replay tests;
- MCP conversion/server tests.

Useful evidence from substrate run `32705914861`:

- 320 ACP-filtered Rust tests passed;
- permission decisions map allow-once/always and reject-once/always/cancel outcomes;
- approve/smart-approve defer rather than automatically allow in the tested mapping;
- chat rejects and auto allows in the tested mapping;
- ACP MCP configuration is additive/replacement-aware and disabled defaults remain disabled in tested server cases;
- session load/resume/replay behavior exists and is tested.

### A2 seam hypothesis

**Supported ACP server entrypoint + supported MCP/extension configuration is the preferred composition path.** Yukh should present one narrowly scoped synthetic tool/capability through supported configuration/protocol surfaces while the host remains in an approval-capable mode.

Open questions before adapter implementation:

1. What exact supported command/API starts the ACP server profile used by the qualification?
2. Can the test supply a deterministic ACP client permission response while keeping goose in `approve` or `smart-approve` semantics?
3. Can Yukh deny a resource while the host profile would otherwise allow it?
4. Can goose independently deny a resource explicitly allowed by Yukh, through a supported native permission/sandbox/configuration boundary?
5. Can denial happen before file content enters tool output?
6. Can ACP session identifiers and Yukh participant/work/capability IDs be correlated without embedding identity only in prompt text?

If (4) cannot be expressed through a supported public entrypoint/configuration, A2 cannot be `PASS`; record `PARTIAL` or `NO PUBLIC COMPOSITION SEAM` rather than implementing host denial in the Yukh adapter.

## Hermes Agent

Pinned revision: `a0ca7c19204e514f9590ce3b812e029b315ab9e9`

### Supported/invokable entrypoints to qualify

Candidate public surfaces observed at the pinned revision include:

- Hermes CLI ACP launcher/integration;
- documented ACP adapter/server operation exposed through the CLI-supported path;
- documented programmatic integration surface;
- supported MCP configuration/discovery surfaces.

The A2 implementation MUST invoke one of these supported entrypoints. Directly importing arbitrary internal objects from `acp_adapter/` or `tools/approval.py` is not sufficient to claim a public seam unless the project documents that import/API as supported programmatic integration.

### Documented/configuration surfaces

- ACP launch/configuration through Hermes CLI;
- programmatic integration documentation;
- approval configuration/behavior exposed through supported runtime paths;
- MCP discovery/configuration.

The first A2 execution profile remains local. Docker/SSH/serverless execution are separate trust profiles and cannot be silently substituted.

### Implementation evidence only — non-contractual

The following are evidence of implementation behavior but not integration contracts by themselves:

- `acp_adapter/server.py`;
- `tools/approval.py`;
- ACP/session/edit-approval/MCP-discovery tests;
- internal runtime helper modules.

Useful evidence from substrate run `32705914861`:

- repository `.[all,dev]` profile installed successfully on Python 3.11;
- selected ACP/session/approval/MCP corpus passed: 27 tests;
- candidate-neutral evidence generation and verification passed.

### A2 seam hypothesis

**Hermes supported ACP CLI/programmatic entrypoint + supported approval/MCP surfaces is the preferred composition path.** Persistent memory is not required for A2 and must remain non-authoritative.

Open questions before adapter implementation:

1. What exact supported command/API starts the local ACP profile and returns or exposes a stable host session identifier?
2. Can the public ACP/programmatic path accept one bounded Yukh tool/capability without bypassing native approval?
3. Can Yukh deny a resource while the Hermes local profile would otherwise allow it?
4. Can Hermes independently deny a resource explicitly allowed by Yukh through a supported native permission/execution profile?
5. Does the denial surface enough candidate-native identifiers for stable causation without exporting conversation memory?
6. Can persistent memory be disabled or ignored so it cannot become evidence authority?

If the approval/tool routing needed for (4) is available only through an undocumented internal import, A2 cannot be `PASS`; record `PARTIAL` or `NO PUBLIC COMPOSITION SEAM`.

## Two-sided policy proof required

The executable adapter for each candidate MUST demonstrate all three operations from the gate contract:

| Probe | Yukh | Host | Effective | Required enforcement source |
| --- | --- | --- | --- | --- |
| positive | ALLOW | ALLOW | ALLOW | none |
| Yukh-denial | DENY | ALLOW | DENY | yukh |
| host-denial | ALLOW | DENY | DENY | host |

This distinction prevents a Yukh-side resource filter from masquerading as host/Yukh policy composition.

The adapter MUST record its translation separately and `adapter_decision_made=false`. If the adapter itself decides whether an operation is authorized, the candidate fails the composition design regardless of the operation outcome.

## Common implementation rule

The next executable artifact MUST NOT:

- monkey-patch candidate code;
- edit the checked-out external repositories;
- import undocumented internal APIs as if they were supported integration seams;
- set goose to global auto/no-approval merely to make the operation succeed;
- disable Hermes approval machinery;
- implement host-native denial inside the Yukh adapter;
- call a paid model provider;
- infer PASS from upstream unit tests alone.

The adapter may configure candidates only through supported public configuration/protocol/programmatic surfaces available at the pinned revision.

## Current seam verdict

| Candidate | Supported public entrypoint identified? | Permission machinery exists | Two-sided A2 composition proven? |
| --- | --- | --- | --- |
| goose | **CANDIDATE ENTRYPOINTS IDENTIFIED; exact invocation to pin in adapter** | **YES** | **NOT EXECUTED** |
| Hermes | **CANDIDATE ENTRYPOINTS IDENTIFIED; exact invocation to pin in adapter** | **YES** | **NOT EXECUTED** |

This record intentionally no longer says `Public seam exists = YES` merely because implementation source is visible. A2 adapter implementation must pin and execute the actual supported entrypoint before that dimension can receive `PASS`.

Neither candidate is preferred by this discovery record.
