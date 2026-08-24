# Yukh agent systems landscape — 2026-08-24

> **Status:** research record, not an accepted architecture decision.
>
> **Governing issue:** #56
>
> This record deliberately allows existing Yukh components to be narrowed, replaced, merged, or retired. Inclusion of an external project does not imply adoption.

## Question

What should Yukh own as durable semantics, and what should it obtain from existing agent runtimes, workspaces, sandboxes, and interoperability projects?

RFC-0003 remains the accepted architecture until superseded. This review challenges that architecture against the current ecosystem instead of protecting prior investment.

## Evidence discipline

The comparisons below are not product rankings. They record public capabilities and hypotheses observed on **2026-08-24**.

- `High`, `Medium`, and `Low` mean relevance to the named concern, not overall quality.
- Roadmap or in-development capabilities are not treated as qualified implementation seams.
- A capability is only a candidate until a bounded spike proves that it preserves Yukh authority, attribution, replay, privacy and evidence requirements.
- Unknown or platform-dependent behavior is stated explicitly rather than inferred.

## Current Yukh decomposition

| Component | Current responsibility | Distinct value today | Main risk |
| --- | --- | --- | --- |
| Yukh MCP | Policy-governed capability gateway | Explicit `intent → capability → policy → plan → approval → execution → verification → audit`; capability instead of credential custody | May duplicate runtime-native permissions if it remains only another tool gateway |
| Yukh Projects | Durable delivery/project state reconciled into GitHub Projects | Reviewed, idempotent, dry-run-first reconciliation and accepted-state boundary | GitHub Projects may be an adapter rather than a universal architectural pillar |
| Yukh Coordination | Cross-session claims, questions, evidence, review and handoff | Client-neutral coordination semantics with explicit non-authority and deterministic conflict/handoff behavior | Could overlap with collaborative workspaces if its protocol grows into a product shell |

### Initial internal assessment

**Yukh MCP — retain the semantic boundary; implementation remains under challenge.**  
The policy/evidence boundary is differentiated when it governs capabilities across runtimes. It becomes much less useful if it merely reimplements approvals already provided by one runtime.

**Yukh Coordination — retain the protocol kernel; resist product expansion.**  
Attributed claims, observable conflict, explicit handoff, evidence references, deterministic replay, and the rule that messaging does not grant authority remain distinctive. Human-facing surfaces should be replaceable.

**Yukh Projects — narrow the claim now.**  
The implementation is useful, but a GitHub Projects focus is not evidence that `Projects` is a universal Yukh layer. The more general semantic need is **accepted work state**; GitHub Projects is the first realization to test.

## External landscape

| Project | Primary strength | Runtime | Durable execution facts | Human/agent workspace | Multi-agent coordination | Sandbox / execution isolation | MCP / ACP interoperability | Evaluation | Yukh relevance |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Apache Maka | Local-first event-sourced agent runtime | High | **High** | Medium | Low | **Medium / evolving / platform-dependent** | Medium / verify | **High** | **High: AgentRun and execution evidence** |
| goose | Vendor-neutral agent host / developer kit | **High** | Medium / verify | High | Medium via subagents | Medium / verify | **High: MCP + ACP** | Medium / verify | **Very high candidate: reference host / integration substrate** |
| OpenHands | Agent server + sandbox/runtime infrastructure | **High** | Medium / verify | High | Medium | **High** | Medium / verify | Medium / verify | **High: sandboxed/remote execution adapter** |
| Buzz | Shared workspace for humans and agents over a signed event log | Medium | Medium / verify | **High** | **High** | Medium / verify | ACP agent + MCP tools | Low / verify | **High: collaborative surface and identity model** |
| Codex | Production coding-agent runtime | **High** | Medium / opaque to Yukh | Medium | Medium / evolving | **High in its supported environments** | MCP; runtime-specific | Not a Yukh-owned concern | High as supported participant, low as Yukh-owned substrate |
| Claude Code | Coding runtime with subagents/teams/hooks | **High** | Medium / verify | Medium | **High inside its runtime** | High in supported environments | MCP; runtime-specific team semantics | Not a Yukh-owned concern | High as participant; useful coordination comparison |

### Important correction: sandbox is not one generic capability

Maka is **not** treated as having a generic high-strength sandbox boundary. Its runtime can enforce approvals and some constrained execution profiles, but the broad trust boundary remains dependent on the host OS/account and platform configuration. Therefore Maka is interesting primarily for durable execution semantics, not as the first Yukh isolation provider.

OpenHands remains the stronger first candidate for an external sandbox/runtime qualification because isolated execution environments are a central product responsibility rather than an incidental runtime property.

## Project observations and hypotheses

### Apache Maka

Observed direction: local-first Runtime Host, recoverable runtime event log, AgentRun ledger, event-sourced projections and evaluation tooling.

**Why it matters**

- It implements much of the execution-history model Yukh has only partially specified.
- Its separation between durable runtime facts and model-local context aligns with Yukh's non-authoritative context rule.
- It is the first candidate for a vendor-neutral `AgentRun` / execution-evidence mapping.

**Disqualifiers**

- Required mapping leaks chain-of-thought or unrestricted prompts.
- Maka-specific fields become mandatory Yukh semantics.
- Its execution authority cannot compose with an external Yukh capability decision.

**Qualification:** map one Maka AgentRun to Yukh intent/capability/evidence identifiers and verify restart/replay without importing private reasoning.

### goose

Observed direction: desktop/CLI/API agent, MCP support, ACP support, subagents and a roadmap toward more composable developer-kit operations.

**Why it matters**

- MCP + ACP make it an unusually relevant interoperability candidate.
- It may provide the host layer Yukh should avoid building itself.
- Its roadmap direction is aligned with replaceable model, approval, execution and subagent operations.

**Important limitation**

The most interesting host-composition/GDK direction is partly roadmap or active development. It must not be described as an already qualified stable seam.

**Posture:** **first qualification candidate for reference host**, not “reference host”.

**Disqualifiers**

- Integration requires patching internal implementation details.
- Yukh capability policy duplicates goose permissions without a clean composition rule.
- Yukh coordination semantics become goose-specific subagent semantics.

### OpenHands

Observed direction: agent server, multiple execution environments, Docker/remote runtime patterns and action/observation execution flows.

**Why it matters**

- It addresses a problem Yukh should be reluctant to rebuild: isolated, reproducible execution.
- It can be tested as an execution provider behind an external policy decision.

**Disqualifiers**

- The whole OpenHands platform must be adopted just to obtain isolation.
- External policy cannot constrain execution cleanly.
- Evidence cannot be correlated back to Yukh capability/run identifiers.

### Buzz

Observed direction: self-hostable rooms with attributed human/agent identities and a signed event substrate; ACP and MCP are used at agent/tool boundaries.

**Why it matters**

- It is a strong current example of agents as visible workspace participants.
- It challenges the need for Yukh to build its own human-facing coordination surface.

**Disqualifiers**

- Nostr/event semantics redefine Yukh authority, handoff, retention or tenancy.
- Presentation concerns become authoritative project or execution state.

## Semantic ownership

| Semantic concern | Must Yukh own a stable contract? | Candidate implementation(s) | Current view |
| --- | --- | --- | --- |
| Participant identity / attribution | Yes | Buzz identities, runtime principals, enterprise IdP adapters | Define portable attribution before choosing identity substrate |
| Claim / ownership / conflict | Yes | Yukh Coordination; external workspace/transport adapters | Keep unless another model proves semantic equivalence |
| Handoff | Yes | Yukh Coordination | Distinctive and worth preserving |
| Capability request / policy decision | Yes | Yukh MCP + runtime permission hooks | Keep semantic contract; implementation may become thinner |
| Sandbox execution | No, only interface/evidence semantics | OpenHands, runtime-native sandboxes; Maka only after platform-specific qualification | Prefer external implementations |
| Agent loop | No | Maka, goose, OpenHands, Codex, Claude | Do not build without demonstrated gap |
| Durable AgentRun facts | Probably | Maka first qualification candidate; tracing standards should also be evaluated | Research contract, not new repository |
| Accepted work state | Yes, abstractly | GitHub Projects via yukh-projects; future adapters | Reframe Projects as adapter unless evidence supports stronger claim |
| Human collaborative workspace | No | Buzz, Matrix, IDEs, web clients | Prefer adapters / external surfaces |
| Evaluation harness | Probably not core | Maka and runtime-specific eval tooling | Standardize evidence inputs/outputs only if needed |

## Adoption posture

| Component | Posture now | What would increase confidence | What would disqualify it |
| --- | --- | --- | --- |
| Yukh MCP | **Keep semantics; qualify composition** | Successful external-runtime policy/evidence integration | Duplicates every runtime approval path or bypasses native security controls |
| Yukh Coordination | **Keep kernel; integrate surfaces** | Cross-runtime replay/handoff works through an external workspace/runtime | External protocol provides equivalent semantics with less code and no authority regression |
| Yukh Projects | **Narrow to first accepted-state adapter** | Reusable accepted-state contract independent of GitHub Projects | Core contracts remain inherently GitHub-specific or another system is the canonical state owner |
| Maka | **Evaluate deeply for AgentRun/evidence** | Stable public runtime seam; lossless mapping; compatible authority model | Requires project authority, private reasoning, or runtime-specific Yukh contracts |
| goose | **First qualification candidate for reference host** | Released/testable ACP and composition seams host Yukh adapters cleanly | Requires internal patching or Yukh becomes goose-specific |
| OpenHands | **Evaluate as execution provider** | Bounded capabilities execute in isolated environment and return correlated evidence | Full-platform coupling or policy cannot remain external |
| Buzz | **Evaluate as workspace/coordination adapter** | Event round-trip and attribution preserve Yukh semantics | Event substrate forces incompatible authority/handoff semantics |
| Codex / Claude Code | **Support as participants, not architecture dependencies** | Stable adapters/hooks/MCP paths | Vendor-specific behavior becomes required Yukh semantics |

## Plausible pivots

1. **Yukh Projects stops being a top-level conceptual pillar.** `Accepted Work State` becomes the semantic layer and `yukh-projects` its GitHub adapter.
2. **Yukh never builds an agent loop.** Maka, goose or another runtime implements the host/runtime layer through adapters.
3. **Buzz or another workspace supplies most human-facing coordination.** Yukh Coordination remains a semantic kernel only where its semantics prove necessary.
4. **OpenHands supplies execution isolation.** Yukh MCP authorizes; an external execution provider isolates and executes; evidence returns to Yukh.
5. **A current Yukh repository is retired.** Repository survival is not a success criterion.

## Proposed layering to test

```text
Human surfaces / workspaces
  Buzz | Matrix | IDE | Web | CLI
                 |
Agent hosts / runtimes
  goose | Maka | OpenHands | Codex | Claude | others
                 |
Interoperability
  ACP (client ↔ agent) | MCP (agent ↔ tools/capabilities)
                 |
Yukh semantic contracts
  participant attribution
  coordination / claim / handoff
  capability policy / decision / evidence
  AgentRun execution facts (candidate)
  accepted work state
                 |
Adapters / implementations
  Yukh Coordination relay | Yukh MCP gateway | yukh-projects GitHub adapter
  Buzz adapter | Maka adapter | goose adapter | OpenHands adapter | others
```

This is **not** a replacement architecture. It is the model to qualify.

## Recommended qualification order

1. **goose compatibility spike** — test whether Yukh can integrate with a neutral host without owning the loop.
2. **Maka AgentRun mapping** — test durable execution facts, privacy and evidence boundaries.
3. **Buzz coordination mapping** — test participant identity, rooms, replay and handoff without authority leakage.
4. **OpenHands execution-provider spike** — test policy-to-sandbox-to-evidence composition.
5. Reassess `yukh-projects` as `Accepted Work State / GitHub Projects adapter` using the results above.
6. Only then decide whether RFC-0003 needs a superseding RFC.

## Sources observed on 2026-08-24

- Apache Maka: https://github.com/apache/maka
- Buzz: https://github.com/block/buzz
- goose documentation: https://block.github.io/goose/
- goose repository / roadmap material: https://github.com/block/goose (including redirects/moves visible from GitHub)
- OpenHands: https://github.com/OpenHands/OpenHands
- Current Yukh component repositories and accepted RFC-0003 in this repository

External projects move quickly. Revalidate observations against current public documentation and released/testable interfaces before adoption, replacement or RFC changes.
