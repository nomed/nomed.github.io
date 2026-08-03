<p align="center">
  <a href="https://nomed.github.io/">
    <img src="./public/brand/nomed.svg" width="112" alt="Nomed">
  </a>
</p>

<h1 align="center">Nomed</h1>

<p align="center">
  <strong>Open infrastructure for governed agentic development.</strong>
</p>

<p align="center">
  <a href="https://nomed.github.io/"><img alt="Public home" src="https://img.shields.io/badge/public_home-nomed.github.io-FF3B30?style=for-the-badge"></a>
  <a href="https://nomed.github.io/manifesto/"><img alt="Manifesto" src="https://img.shields.io/badge/manifesto-plans_before_mutations-111111?style=for-the-badge"></a>
  <a href="https://github.com/nomed"><img alt="Open source" src="https://img.shields.io/badge/building_in_public-open_source-7C3AED?style=for-the-badge"></a>
</p>

---

**Governed agentic development needs explicit authority, durable memory and verifiable evidence.** This repository develops that position through public protocols, bounded components, golden paths and durable engineering records.

The work starts from a concrete failure mode. Agentic development works surprisingly well inside one session, but becomes fragile across multiple agents, repositories, tools, model providers, and asynchronous handoffs. Intent disappears. Authority becomes ambiguous. Work is duplicated. Evidence and memory fragment.

The aim is to make that larger system **legible, governable, durable, and worthy of trust**.

> The goal is not merely to make agents faster.  
> The goal is to make human–agent collaboration capable of carrying real responsibility.

[Enter the public home →](https://nomed.github.io/)

## The thesis

- **Capability, not custody.** Agents receive narrowly governed capabilities, not unrestricted credentials or invisible authority.
- **Plans before mutations.** Consequential actions begin as inspectable intent and end with verifiable evidence.
- **Memory outside the session.** Decisions, claims, handoffs, and outcomes survive any single chat, agent, or vendor.
- **Observable coordination.** Parallel work becomes legible through explicit ownership, state, dependencies, and review.
- **Vendor-neutral by design.** The contracts must work across Codex, ChatGPT, Claude, Gemini, local agents, and future runtimes.
- **Honest maturity.** Research, foundations, compatibility layers, and production systems are named for what they really are.

Read the [Nomed Manifesto](https://nomed.github.io/manifesto/) for the full position.

## Yukh — an open system in formation

**Yukh turns these principles into an architecture.** Its components separate governed execution, durable project state and cross-session coordination rather than collapsing them into a monolithic platform.

<table>
  <tr>
    <td align="center" width="18%">
      <a href="https://nomed.github.io/work/#yukh-mcp">
        <img src="./public/brand/yukh-mcp.svg" width="64" alt="Yukh MCP"><br>
        <strong>Yukh MCP</strong>
      </a>
    </td>
    <td>
      <strong>Governed capabilities</strong><br>
      A typed, policy-governed gateway that turns agent intent into bounded execution and verifiable evidence.<br>
      <sub>Foundation</sub>
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
      <strong>Durable project state</strong><br>
      Declarative, secure, consumer-neutral reconciliation for portfolio and delivery state in GitHub Projects.<br>
      <sub>Foundation bootstrap</sub>
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
      <strong>Cross-session coordination</strong><br>
      Open claims, signals, reviews, evidence, and explicit handoffs. It coordinates work; it does not grant authority.<br>
      <sub>Foundation / reference implementation</sub>
    </td>
  </tr>
</table>

The original [Yukh reconciler](https://github.com/nomed/yukh) remains available as a compatibility implementation while its reusable capabilities migrate into Yukh Projects.

[Inspect current maturity and work →](https://nomed.github.io/work/)

Deep dives: [MCP](https://nomed.github.io/system/mcp/) · [Projects](https://nomed.github.io/system/projects/) · [Coordination](https://nomed.github.io/system/coordination/)

## Engineering method

Cross-suite work follows the lightweight [Yukh systems engineering management plan](docs/engineering/YUKH-SEMP.md): mission threads become authority boundaries, executable contracts, adversarial vertical slices and independently verifiable evidence.

The accepted architecture is [RFC-0003 — Yukh reference architecture and minimum runtime](docs/rfcs/RFC-0003-yukh-reference-architecture-and-minimum-runtime.md), governed by [issue #29](https://github.com/nomed/nomed.github.io/issues/29). JetStream is the first distributed adapter and Matrix the first human bridge; their implementation remains owned by Yukh Coordination.

## This repository

`nomed.github.io` is Nomed's public home and governance hub. It contains the current editorial site and the reviewed cross-repository records that define how the wider system evolves. Runtime implementations remain in their own repositories; facts link to canonical sources instead of being copied into parallel documentation.

```text
app/       current editorial application and routes
public/    public identity and brand assets
docs/      reviewed governance records
tests/     executable publication checks
build/     hosting build integration
worker/    hosting runtime integration
```

Historical material predating the current site is preserved exactly on the `archive/legacy-site-2026-08-02` branch and is intentionally absent from `main`.

New top-level directories require a documented, current responsibility. `main` is not an archive, scratch space, or session store.

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

---

<p align="center">
  <strong>Nomed</strong><br>
  Identity into intent. Intent into governed action. Action into evidence.
</p>
