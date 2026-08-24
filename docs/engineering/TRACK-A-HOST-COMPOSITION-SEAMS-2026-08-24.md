# Track A — host-composition public seams — 2026-08-24

- **Status:** seam discovery; no A2 PASS/FAIL yet
- **Governing issue:** #58
- **Gate contract:** `TRACK-A-HOST-COMPOSITION-GATE.md`

## Why this record exists

The first runtime gate proved that both candidates have executable ACP/MCP/permission substrate. A2 requires a stricter result: Yukh must enter through a public seam and preserve native security. This record identifies what can be used without patching candidate internals.

## goose

Pinned revision: `bd16fbfbbe78cadc2cc3ce6295691772df51d71f`

Observed public/runtime seams:

- ACP server implementation under `crates/goose/src/acp/`;
- ACP permission decision mappings exercised by the passing upstream corpus;
- ACP server new/load/resume session behavior exercised by the passing upstream corpus;
- MCP extension/server conversion through ACP exercised by upstream tests;
- explicit permission modes including approve/smart-approve/chat/auto in current code/tests;
- external extensions/subagents can be constrained by configured extension scope.

Useful evidence from substrate run `32705914861`:

- 320 ACP-filtered Rust tests passed;
- permission decisions map allow-once/always and reject-once/always/cancel outcomes;
- approve/smart-approve defer rather than automatically allow in the tested mapping;
- chat rejects and auto allows in the tested mapping;
- ACP MCP configuration is additive/replacement-aware and disabled defaults remain disabled in tested server cases;
- session load/resume/replay behavior exists and is tested.

A2 seam hypothesis:

**ACP server + candidate extension/MCP configuration is the preferred public composition path.** Yukh should present one narrowly scoped synthetic tool/capability through a public MCP/extension seam and require an approval-capable host mode. `auto` is not acceptable as evidence of policy composition because it would erase the native approval boundary.

Open questions before adapter implementation:

1. Can the test supply a deterministic ACP client permission response while keeping goose in `approve` or `smart-approve` semantics?
2. Can filesystem scope be reduced to one fixture path without relying on a broad developer extension permission?
3. Can an out-of-scope tool invocation be denied before file content enters tool output?
4. Can ACP session identifiers and Yukh participant/work/capability IDs be correlated without embedding identity only in prompt text?

If the answer to (2) requires changing goose internals, A2 must record a FAIL/PARTIAL rather than widen the Yukh capability.

## Hermes Agent

Pinned revision: `a0ca7c19204e514f9590ce3b812e029b315ab9e9`

Observed public/runtime seams:

- ACP adapter/server under `acp_adapter/`;
- CLI ACP launcher/integration under `hermes_cli/subcommands/acp.py`;
- documented/programmatic integration surface;
- explicit approval machinery in `tools/approval.py`;
- ACP session tests, edit-approval tests and ACP/MCP discovery tests are executable at the pinned revision;
- multiple terminal/execution backends exist, but no backend is assumed qualified by A1.

Useful evidence from substrate run `32705914861`:

- repository `.[all,dev]` profile installed successfully on Python 3.11;
- selected ACP/session/approval/MCP corpus passed: 27 tests;
- candidate-neutral evidence generation and verification passed.

A2 seam hypothesis:

**Hermes ACP adapter + explicit approval machinery is the preferred public composition path.** The first implementation should use the local test profile only; Docker/SSH/serverless backends are separate trust profiles and must not be conflated.

Open questions before adapter implementation:

1. Can the ACP path expose/accept one bounded Yukh tool without bypassing `tools/approval.py`?
2. Can local filesystem scope be expressed narrowly enough to deny the forbidden fixture path?
3. Does the approval result surface enough candidate-native identifiers for stable causation without exporting conversation memory?
4. Can persistent memory be disabled or ignored for the qualification so that it cannot become evidence authority?

If memory/approval/tool routing requires broad agent initialization unrelated to the bounded operation, adapter cost and coupling must be recorded explicitly.

## Common implementation rule

The next executable artifact MUST NOT:

- monkey-patch candidate code;
- edit the checked-out external repositories;
- set goose to global auto/no-approval merely to make the operation succeed;
- disable Hermes approval machinery;
- call a paid model provider;
- infer PASS from upstream unit tests alone.

The adapter may configure candidates only through public configuration/protocol/programmatic surfaces available at the pinned revision.

## Current seam verdict

| Candidate | Public seam exists | Permission machinery exists | A2 executable composition proven? |
| --- | --- | --- | --- |
| goose | **YES** — ACP + MCP/extension surfaces | **YES** | **NOT EXECUTED** |
| Hermes | **YES** — ACP adapter + programmatic/approval surfaces | **YES** | **NOT EXECUTED** |

Both candidates proceed to adapter implementation. Neither is preferred by this discovery record.
