# Track A — agent-host prequalification — 2026-08-24

- **Status:** documentary prequalification; runtime fixture not yet executed
- **Governing issue:** #58
- **Fixture:** `TRACK-A-HOST-FIXTURE.md`
- **Decision authority:** none; this record cannot select a host

## Candidate revisions observed

| Candidate | Canonical repository | Pinned revision |
| --- | --- | --- |
| goose | `aaif-goose/goose` | `bd16fbfbbe78cadc2cc3ce6295691772df51d71f` |
| Hermes Agent | `NousResearch/hermes-agent` | `a0ca7c19204e514f9590ce3b812e029b315ab9e9` |

These SHAs are discovery/prequalification pins. Runtime qualification MUST either test these revisions or record a new explicit pin.

## What is established before execution

### goose

Observed at the pinned revision:

- ACP server implementation exists under `crates/goose/src/acp/`;
- public documentation describes subagents and their lifecycle;
- subagents expose attributed identifiers in tool activity;
- extension access can be restricted for subagents;
- subagents cannot recursively spawn subagents or modify extension/schedule configuration;
- documentation exposes explicit permission modes;
- external agents can be wired as subagents through public configuration;
- MCP extensions are a first-class integration surface;
- repository license is Apache-2.0.

Important prequalification finding: goose documentation contains examples that disable approval in a delegated Codex configuration. That example is NOT acceptable for Track A. The fixture explicitly requires host-native protections to remain enabled. We must test composition instead of copying that example.

### Hermes Agent

Observed at the pinned revision:

- ACP adapter/server code exists (`acp_adapter/server.py`) together with CLI ACP integration;
- public ACP documentation and developer internals are present;
- MCP is a documented integration surface;
- an explicit approval implementation exists (`tools/approval.py`);
- the project exposes persistent memory, skills and subagent/delegation machinery;
- multiple execution backends are documented, including local/container/remote options;
- provider selection is not tied to one model vendor;
- repository documentation declares an MIT license.

Important prequalification finding: Hermes has a broader persistent-memory/skills model than the minimum Yukh host role. Track A must prove that this context can remain non-authoritative and optional from the perspective of Yukh semantics.

## Same-seam comparison

| Dimension | goose documentary evidence | Hermes documentary evidence | Prequalification result |
| --- | --- | --- | --- |
| Stable public host seam | ACP server + headless/agent APIs exist | ACP adapter + programmatic integration exist | both proceed |
| MCP composition | documented first-class extension surface | documented MCP integration | both proceed |
| ACP | concrete core server implementation | concrete adapter/server implementation | both proceed |
| Native approvals | explicit permission modes | explicit approval machinery | runtime composition required |
| Participant attribution | sessions/subagent IDs observable | session/runtime constructs exist | runtime mapping required |
| Memory separation | context/session machinery exists | persistent memory/skills are major features | mandatory runtime proof |
| Delegation | documented restricted subagents | documented subagents/delegation | runtime causation proof required |
| Execution trust boundary | developer/extension + permission profile to define | backend-specific; must pick exact tested backend | runtime proof required |
| Restart/recovery | session behavior requires fixture execution | persistent session/memory behavior requires fixture execution | NOT EXECUTED |
| Evidence export | tool activity observable; neutral envelope not proven | tool/activity records exist; neutral envelope not proven | NOT EXECUTED |
| Provider neutrality | multi-provider architecture | multi-provider architecture | documentary pass; runtime pin still required |
| License/operability | Apache-2.0 | MIT per repository documentation | no documentary blocker |

## Prequalification verdict

**goose: PROCEED TO RUNTIME QUALIFICATION.**

No documentary blocker prevents running the common fixture. The strongest reasons to test goose are ACP/MCP as explicit public seams and controllable subagent extension access. The highest-risk question is permission composition: the Yukh capability decision must not force `autonomous`/no-approval behavior or duplicate user approval.

**Hermes Agent: PROCEED TO RUNTIME QUALIFICATION.**

No documentary blocker prevents running the same fixture. The strongest reasons to test Hermes are ACP/MCP plus a richer persistent host model. The highest-risk questions are memory/evidence separation and execution-backend trust: the qualification must select one concrete backend and state its boundary precisely.

## Runtime order

To avoid tuning the fixture to one candidate, the fixture is frozen before execution.

Execution order:

1. goose at the recorded pin (or explicitly updated pin);
2. Hermes at the recorded pin (or explicitly updated pin);
3. side-by-side matrix review only after both runs.

No scoring weights may be changed between candidate runs without resetting both qualifications.

## Evidence still missing

Neither candidate may be called a supported/reference Yukh host yet. Mandatory dimensions remain `NOT EXECUTED`:

- real permission-policy composition;
- concrete execution isolation/trust profile;
- restart/recovery with explicit correlation;
- vendor-neutral evidence export;
- end-to-end participant/work/capability causation;
- adapter implementation/maintenance cost.

## Source references observed

### goose

- canonical repository: `https://github.com/aaif-goose/goose`
- ACP implementation: `crates/goose/src/acp/`
- subagent guide: `documentation/docs/guides/context-engineering/subagents.mdx`
- permission guide: `documentation/docs/guides/managing-tools/goose-permissions.md`
- MCP documentation under `documentation/docs/mcp/`
- pinned LICENSE: Apache License 2.0

### Hermes Agent

- canonical repository: `https://github.com/NousResearch/hermes-agent`
- ACP server: `acp_adapter/server.py`
- ACP CLI: `hermes_cli/subcommands/acp.py`
- ACP docs: `website/docs/user-guide/features/acp.md`
- programmatic integration docs: `website/docs/developer-guide/programmatic-integration.md`
- approval implementation: `tools/approval.py`
- security docs: `website/docs/user-guide/security.md`

## Next gate

The next artifact MUST be a runtime qualification result using the frozen fixture, not another feature comparison.
