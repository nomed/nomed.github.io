# Yukh agent systems landscape — 2026-08-24

> **Status:** research record, not an accepted architecture decision.
>
> **Governing issue:** #56
>
> This record deliberately allows existing Yukh components to be narrowed, replaced, merged, or retired. Inclusion of an external project does not imply adoption.

## Question

What should Yukh own as durable semantics, and what should it obtain from existing agent runtimes, workspaces, sandboxes, and interoperability projects?

The current accepted architecture remains RFC-0003 until superseded. This review tests that architecture against the current ecosystem instead of protecting it from change.

## Current Yukh decomposition

| Component | Current responsibility | Distinct value today | Main risk |
| --- | --- | --- | --- |
| Yukh MCP | Policy-governed capability gateway | Explicit `intent → capability → policy → plan → approval → execution → verification → audit`; capability instead of credential custody | May duplicate runtime-native permissions if it remains only another tool gateway |
| Yukh Projects | Durable delivery/project state reconciled into GitHub Projects | Reviewed, idempotent, dry-run-first reconciliation and accepted-state boundary | GitHub Projects may be an adapter rather than a universal architectural pillar |
| Yukh Coordination | Cross-session claims, questions, evidence, review and handoff | Client-neutral coordination semantics with explicit non-authority and deterministic conflict/handoff behavior | Could overlap with collaborative workspaces if its protocol grows into a product shell |

### Initial internal assessment

**Yukh MCP — retain the semantic boundary; implementation remains under challenge.**  
The policy/evidence boundary is differentiated when it governs capabilities across runtimes. It becomes much less useful if it merely reimplements approvals already provided by one runtime. Qualification should therefore test whether external runtimes can call or embed the Yukh capability contract without surrendering their own sandbox controls.

**Yukh Coordination — retain the protocol kernel; resist product expansion.**  
The strongest distinctive semantics are attributed claims, observable conflict, explicit handoff, evidence references, deterministic replay, and the rule that messaging does not grant authority. Those remain useful even when Buzz, Matrix, Slack, an IDE, or another workspace becomes the human surface. A future result may still show that an external event model can implement most of the relay.

**Yukh Projects — narrow the claim now.**  
The implementation is useful and mature relative to the rest of the suite, but its current GitHub Projects focus is not evidence that `Projects` is a universal Yukh layer. Treat it provisionally as the first accepted-state adapter. The more general semantic need is **accepted work/delivery state**; GitHub Projects is one realization. A superseding RFC should be considered if this distinction survives qualification.

## External landscape

The table rates architectural relevance, not product quality. `High` means there is a strong fit with a Yukh responsibility; it does not mean adopt.

| Project | Primary strength | Runtime | Durable execution facts | Human/agent workspace | Multi-agent coordination | Sandbox / execution isolation | MCP / ACP interoperability | Evaluation | Yukh relevance |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Apache Maka | Local-first event-sourced agent runtime | High | **High** | Medium | Low | High | Medium / to verify | **High** | **High: AgentRun and execution evidence** |
| goose | Vendor-neutral agent host / developer kit | **High** | Medium, growing | High | Medium/High via subagents | Medium/High | **High: MCP + ACP** | Medium, growing | **Very high: reference host / integration substrate** |
| OpenHands | Agent server + sandbox/runtime infrastructure | **High** | Medium | High | Medium | **High** | Medium | Medium | **High: sandboxed/remote execution adapter** |
| Buzz | Shared workspace for humans and agents over a signed event log | Medium | Medium/High | **High** | **High** | Medium | ACP agent + MCP tools | Low/Medium | **High: collaborative surface and identity model** |
| Codex | Production coding-agent runtime | **High** | Medium | Medium | Medium | **High** | MCP; client/runtime specific | High internally | High as a supported participant, low as Yukh-owned substrate |
| Claude Code | Coding runtime with subagents/teams/hooks | **High** | Medium | Medium | **High** inside its runtime | **High** | MCP; runtime-specific team semantics | Medium | High as participant; useful coordination comparison |

## What is genuinely distinctive

### Apache Maka

Observed project direction: local-first; one Runtime Host; recoverable `Runtime Event Log`; `AgentRun` ledger; model/tool/termination events treated as execution facts; UI, context and recovery are projections; evaluation is first-class.

**Why it matters to Yukh**

- It already implements much of the execution-history model Yukh has only partially specified.
- `context is not history` is compatible with Yukh's rule that model-local context is ephemeral and non-authoritative.
- Its event sourcing offers a plausible implementation for a future Yukh `AgentRun` / execution-evidence contract.

**Why not simply adopt it**

- Maka intentionally has one execution authority inside Runtime Host; Yukh must verify how this composes with an external capability-policy boundary.
- The project is still actively evolving and its public integration seams must be tested, not inferred.
- Yukh should not make local-first desktop assumptions part of its protocol semantics.

**Qualification hypothesis:** build a thin adapter/prototype that maps one Maka AgentRun to Yukh intent/capability/evidence identifiers without copying chain-of-thought or requiring Maka-specific fields in Yukh contracts.

### goose

Observed project direction: open agent for desktop/CLI/API, strong MCP support, ACP server and ACP-agent provider support, subagents, recipes, and a 2026 roadmap moving toward a composable developer kit (GDK) with replaceable model-call, approval, execution, compaction, retry and subagent operations.

**Why it matters to Yukh**

- It is currently the strongest candidate for a vendor-neutral **reference agent host**.
- ACP and MCP are already first-class boundaries rather than features bolted onto a proprietary loop.
- The GDK direction may provide exactly the composition seam needed for Yukh policy, coordination and evidence adapters.

**Why not simply adopt it**

- The most interesting GDK composition work is roadmap/current-development material and must be qualified against released/public APIs.
- goose permissions and Yukh capability policy may overlap; duplication would make the combined system worse.
- Yukh coordination semantics should not become goose-specific subagent semantics.

**Qualification hypothesis:** attempt the first external Yukh-compatible host integration with goose before building a Yukh runtime.

### OpenHands

Observed project direction: agent server separable from Agent Canvas, multiple execution environments, Docker sandbox, remote runtime, action/observation event flow, automation support.

**Why it matters to Yukh**

- It solves a concrete problem Yukh should be reluctant to rebuild: reproducible isolated execution environments.
- A remote agent server maps well to a bounded execution adapter behind a policy decision.
- Its separation of canvas/server/runtime creates useful integration seams.

**Why not simply adopt it**

- Its runtime/event model is primarily designed for OpenHands agents, not as a neutral governance protocol.
- Running a sandbox is not the same as governing authority; Yukh must not confuse isolation with authorization.
- The full platform is much larger than the execution capability Yukh may need.

**Qualification hypothesis:** assess OpenHands sandbox/agent-server as an execution provider, not as the Yukh control plane.

### Buzz

Observed project direction: self-hostable rooms where people and agents have attributed identities; Nostr signed events unify messages, reactions, workflow, review and git events; agent participation uses ACP and tool access uses MCP.

**Why it matters to Yukh**

- It offers the clearest currently visible implementation of **agent as workspace participant**, rather than agent as hidden integration.
- Its signed event log and shared rooms could provide a compelling human experience for Yukh coordination.
- It is a useful challenge to Yukh's assumption that a separate coordination relay is necessary.

**Why not simply adopt it**

- Buzz deliberately puts many event classes into one event substrate; Yukh deliberately separates communication from project/execution authority.
- Nostr semantics must not silently redefine Yukh handoff, evidence, retention or tenancy semantics.
- Workspace UX strength is not proof that the underlying event model should become Yukh's canonical protocol.

**Qualification hypothesis:** map Yukh Coordination events to/from a Buzz room as a presentation/transport adapter and identify any irreducible semantic mismatch.

## Two complementary matrices

### Semantic ownership

| Semantic concern | Must Yukh own a stable contract? | Candidate implementation(s) | Current view |
| --- | --- | --- | --- |
| Participant identity / attribution | Yes | Buzz identities, runtime principals, enterprise IdP adapters | Missing cross-suite contract; define before adopting identity substrate |
| Claim / ownership / conflict | Yes | Yukh Coordination, possibly Buzz event adapter | Keep Yukh semantics unless external model proves equivalent |
| Handoff | Yes | Yukh Coordination | Strongly distinctive; keep |
| Capability request / policy decision | Yes | Yukh MCP + runtime permission hooks | Keep contract; implementation may compose with runtime-native controls |
| Sandbox execution | No, only interface/evidence semantics | OpenHands, Maka, Codex, Claude, goose sandbox | Prefer external implementations |
| Agent loop | No | Maka, goose, OpenHands, Codex, Claude | Do not build without a demonstrated gap |
| Durable AgentRun facts | Probably | Maka first candidate; OpenTelemetry/trace formats worth evaluating | Add research contract, not a new repository |
| Accepted work state | Yes, at abstract level | GitHub Projects via Yukh Projects; future Jira/Linear/etc. adapters | Reframe Projects as adapter unless evidence supports stronger claim |
| Human collaborative workspace | No | Buzz, Matrix, IDEs, web clients | Prefer adapters / external surfaces |
| Evaluation harness | Probably not core | Maka eval, goose tooling, OpenHands eval | Reuse; only standardize evidence inputs/outputs if necessary |

### Adoption posture

| Component | Posture now | What would increase confidence | What would disqualify it |
| --- | --- | --- | --- |
| Yukh MCP | **Keep semantics; qualify composition** | Successful external-runtime policy/evidence integration | Requires agents to bypass their native security model or duplicates every approval path |
| Yukh Coordination | **Keep kernel; integrate surfaces** | Cross-runtime replay/handoff works through at least one external workspace/runtime | External protocol provides equivalent semantics with less custom code and no authority regression |
| Yukh Projects | **Narrow to first accepted-state adapter** | Demonstrated reusable accepted-state contract independent of GitHub Projects | Core contracts remain GitHub-specific or another system becomes the canonical state owner |
| Maka | **Evaluate deeply** | Stable public runtime seam; lossless AgentRun/evidence mapping; compatible authority model | Requires Maka to become source of project authority or leaks private reasoning into required records |
| goose | **Evaluate first as reference host** | Released GDK/ACP seams can host Yukh adapters cleanly | Integration requires patching internals or Yukh contracts become goose-specific |
| OpenHands | **Evaluate as execution provider** | Remote/sandbox execution can consume bounded capabilities and emit verifiable evidence | Requires adopting the whole platform to get sandbox functionality or authority cannot be externally constrained |
| Buzz | **Evaluate as workspace/coordination adapter** | Yukh event round-trip and attribution work without semantic loss | Nostr/event model forces authority or handoff semantics incompatible with Yukh |
| Codex / Claude Code | **Support as participants, not architecture dependencies** | Stable adapters/hooks/MCP paths | Vendor-specific behavior becomes required Yukh semantics |

## Plausible pivots we should admit now

### Pivot A — `Yukh Projects` stops being a top-level conceptual pillar

Target semantics become `Accepted Work State`; `yukh-projects` is the GitHub Projects adapter/reference implementation. This is currently the most plausible architecture change.

### Pivot B — Maka or goose becomes the reference runtime

Yukh never creates its own agent loop. `AgentRun` and capability/evidence contracts are implemented by an external runtime adapter. Maka is currently strongest on durable execution; goose is currently strongest on interoperability and host composition. They may be complementary rather than alternatives.

### Pivot C — Buzz replaces most human-facing coordination UI work

Yukh Coordination remains a semantic kernel and conformance suite, while Buzz (or another workspace) is the default human/agent surface. If Buzz can preserve Yukh semantics directly, parts of the custom relay could also become unnecessary.

### Pivot D — OpenHands supplies execution isolation

Yukh MCP authorizes a bounded capability; OpenHands provides the sandbox/remote execution environment; evidence flows back to Yukh. This could remove pressure to build execution infrastructure in Yukh.

### Pivot E — a current Yukh repository is retired

This is an acceptable result. Repository survival is not a success criterion. The success criterion is a smaller, more interoperable system with clearer authority and evidence.

## Proposed target layering for qualification

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

This is **not** a proposed replacement architecture yet. It is the model to test.

## Recommended qualification order

1. **goose compatibility spike** — test whether Yukh can integrate with a neutral host without owning the loop.
2. **Maka AgentRun mapping** — test durable execution facts and evidence boundaries.
3. **Buzz coordination mapping** — test participant identity, rooms, replay and handoff without authority leakage.
4. **OpenHands execution-provider spike** — test policy-to-sandbox-to-evidence composition.
5. Reassess `yukh-projects` as `Accepted Work State / GitHub Projects adapter` using the results above.
6. Only then decide whether RFC-0003 needs a superseding RFC.

## Sources observed on 2026-08-24

- Apache Maka: https://github.com/apache/maka and its runtime architecture documentation.
- Buzz: https://github.com/block/buzz.
- goose: https://block.github.io/goose/ and https://github.com/aaif-goose/goose, including the 2026 Q3 roadmap.
- OpenHands: https://github.com/OpenHands/OpenHands and OpenHands runtime documentation.
- Current Yukh component repositories and accepted RFC-0003 in this repository.

External projects move quickly. Revalidate these observations before an adoption or replacement decision.