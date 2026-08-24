<p align="center">
  <a href="https://nomed.github.io/">
    <img src="./public/brand/nomed.svg" width="112" alt="Nomed">
  </a>
</p>

<h1 align="center">Nomed</h1>

<p align="center">
  <strong>Open governance semantics for replaceable agent systems.</strong>
</p>

<p align="center">
  <a href="https://nomed.github.io/"><img alt="Public home" src="https://img.shields.io/badge/public_home-nomed.github.io-FF3B30?style=for-the-badge"></a>
  <a href="https://nomed.github.io/manifesto/"><img alt="Manifesto" src="https://img.shields.io/badge/manifesto-plans_before_mutations-111111?style=for-the-badge"></a>
  <a href="https://github.com/nomed"><img alt="Open source" src="https://img.shields.io/badge/open_source-public_repositories-7C3AED?style=for-the-badge"></a>
</p>

---

**Agent systems need authority, coordination and evidence that survive replacement of the model, runtime, workspace or vendor.** This repository owns the public Yukh thesis, suite-level architecture and durable cross-repository governance records.

The hard problem is no longer starting an agent loop. Modern hosts already provide tools, approvals, subagents, memory, sandboxes and workflow machinery. The harder problem is deciding which semantics must remain stable when any of those implementations changes.

> Own the semantics. Reuse the machinery.

[Enter the public home →](https://nomed.github.io/)

## The thesis

- **Semantics before machinery.** Yukh should own only contracts that must survive host/runtime replacement.
- **Capability, not custody.** Agents receive bounded authority; neither Yukh nor a host gets to hide or widen the other side's policy.
- **Observable coordination.** Claims, conflict, attribution and handoff remain explicit across sessions and workspaces.
- **Evidence, not declarations.** Operational facts remain independently checkable without persisting private reasoning.
- **Memory is context, not authority.** Persistent memory may be reusable and shared without becoming accepted state or evidence truth.
- **Runtime-neutral by design.** Agent hosts, sandboxes, workflow engines, memory systems and human workspaces should remain replaceable where possible.
- **Honest maturity.** Qualification candidates are not adopted components, and passing an upstream test is not a Yukh architecture decision.

Read the [Nomed Manifesto](https://nomed.github.io/manifesto/) and the current [agent systems landscape](https://nomed.github.io/landscape/).

## Yukh — accepted boundaries, replaceable implementations

[RFC-0003](docs/rfcs/RFC-0003-yukh-reference-architecture-and-minimum-runtime.md) remains the accepted reference architecture until superseded. It separates capability authority, accepted delivery state and live coordination. The current repositories implement those responsibilities, but architecture review explicitly allows them to shrink, become adapters, be replaced or disappear when equivalent external machinery preserves the required semantics.

<table>
  <tr>
    <td align="center" width="18%">
      <a href="https://nomed.github.io/work/#yukh-mcp">
        <img src="./public/brand/yukh-mcp.svg" width="64" alt="Yukh MCP"><br>
        <strong>Yukh MCP</strong>
      </a>
    </td>
    <td>
      <strong>Capability policy + evidence</strong><br>
      Current foundation implementation of the Yukh capability boundary. Track A is testing two-sided composition with host-native permissions rather than duplicating or bypassing them; durable production readiness remains unproven.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://nomed.github.io/work/#yukh-projects">
        <img src="./public/brand/yukh-projects.svg" width="64" alt="Yukh Projects"><br>
        <strong>Yukh Projects</strong>
      </a>
    </td>
    <td>
      <strong>GitHub accepted-state adapter</strong><br>
      Published and synthetically qualified GitHub Projects implementation of accepted delivery state. The architecture review is testing whether the stable concern should become an explicit abstract contract with multiple adapters; no live apply qualification is implied.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://nomed.github.io/work/#yukh-coordination">
        <img src="./public/brand/yukh-coordination.svg" width="64" alt="Yukh Coordination"><br>
        <strong>Yukh Coordination</strong>
      </a>
    </td>
    <td>
      <strong>Coordination kernel</strong><br>
      Current implementation of claims, conflict, handoff, attribution and replay. Preparation evidence exists, while public/live runtime qualification remains unproven and transports/workspaces stay replaceable.
    </td>
  </tr>
</table>

[Understand the current system →](https://nomed.github.io/system/)  
[Inspect implementation and qualification work →](https://nomed.github.io/work/)

Deep dives: [MCP](https://nomed.github.io/system/mcp/) · [Projects](https://nomed.github.io/system/projects/) · [Coordination](https://nomed.github.io/system/coordination/)

## Architecture qualification

The current review has moved from feature comparison to executable qualification:

- **Track A / agent host:** goose and Hermes both passed the first runtime-substrate gate. Neither is selected. Gate A2 requires observable Yukh/host policy composition through supported public seams before either can pass Yukh-specific host qualification.
- **Durable execution:** Apache Maka is the first AgentRun/execution-evidence candidate.
- **Execution isolation:** OpenHands is the first external sandbox/execution-provider candidate.
- **Orchestration:** OpenHuman is a workflow/checkpoint/approval challenger, not an accepted Yukh control plane.
- **Shared memory / Track C2:** TencentDB Agent Memory is the primary team-memory candidate. Memory must remain contextual and non-authoritative; Hermes and OpenHuman provide comparison points.
- **Human-agent workspace:** Buzz is being evaluated as a replaceable collaboration surface over Yukh coordination semantics.
- **Agent participants:** Codex, Claude Code and other runtimes are participants/candidates, not core architecture dependencies.

Governing records: [architecture review #56](https://github.com/nomed/nomed.github.io/issues/56), [host qualification #58](https://github.com/nomed/nomed.github.io/issues/58), [shared memory #63](https://github.com/nomed/nomed.github.io/issues/63).

## Documentation ownership

[RFC-0004](docs/rfcs/RFC-0004-yukh-documentation-architecture.md) defines one suite-level discovery surface and component-owned technical documentation.

`nomed.github.io` owns:

- the public thesis and system narrative;
- suite architecture and authority boundaries;
- maturity and qualification summaries;
- cross-suite RFCs and governance records;
- routing to canonical component documentation.

Component repositories own installation, configuration, APIs, operations, security, releases, migrations and troubleshooting. The suite site summarizes those facts but does not create a second technical source of truth.

## Engineering method

Cross-suite work follows the lightweight [Yukh systems engineering management plan](docs/engineering/YUKH-SEMP.md): mission threads become authority boundaries, executable contracts, adversarial vertical slices and independently verifiable evidence.

Accepted RFCs are immutable; changes to topology, component authority or shared contracts require a later superseding RFC. Qualification results do not silently rewrite accepted architecture.

## This repository

```text
app/       current editorial application and routes
public/    public identity and brand assets
docs/      reviewed governance records
tests/     executable publication checks
build/     hosting build integration
worker/    hosting runtime integration
```

Historical material predating the current site is preserved on the designated archive branch and is intentionally absent from `main`. New top-level directories require a documented current responsibility.

## Build locally

```bash
npm install
npm run dev
```

Before proposing a change:

```bash
npm run lint
npm test
npm run build
```

For deterministic static-site qualification with Node.js 22 or later:

```bash
npm ci
npm run e2e
npm run test:network-denial
```

The site checks build the GitHub Pages export, visit primary routes, verify internal pages/fragments/assets and canonical Yukh repository exits. The network-denial test repeats qualification inside an OS network sandbox where available.

---

<p align="center">
  <strong>Nomed</strong><br>
  Stable governance semantics. Replaceable agent machinery.
</p>
