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

**Nomed explores and builds the operating systems of governed agentic development.** It turns a clear point of view into public protocols, bounded components, golden paths, and durable engineering records for a future where people and autonomous agents can work together without surrendering control, context, or trust.

Nomed is a point of view made operational: a public laboratory and an open engineering project.

The work starts from a concrete failure mode. Agentic development works surprisingly well inside one session, but becomes fragile across multiple agents, repositories, tools, model providers, and asynchronous handoffs. Intent disappears. Authority becomes ambiguous. Work is duplicated. Evidence and memory fragment.

Nomed exists to make that larger system **legible, governable, durable, and worthy of trust**.

> The goal is not merely to make agents faster.  
> The goal is to make human–agent collaboration capable of carrying real responsibility.

[Enter the public home →](https://nomed.github.io/)

## The thesis

- **Capability, not custody.** Agents receive narrowly governed capabilities, not unrestricted credentials or invisible authority.
- **Plans before mutations.** Consequential actions begin as inspectable intent and end with verifiable evidence.
- **Memory outside the session.** Decisions, claims, handoffs, and outcomes survive any single chat, agent, or vendor.
- **Coordination in the open.** Parallel work becomes legible through explicit ownership, state, dependencies, and review.
- **Vendor-neutral by design.** The contracts must work across Codex, ChatGPT, Claude, Gemini, local agents, and future runtimes.
- **Honest maturity.** Research, foundations, compatibility layers, and production systems are named for what they really are.

Read the [Nomed Manifesto](https://nomed.github.io/manifesto/) for the full position.

## Yukh — the system taking shape

Yukh is the open system taking shape within this architecture. It is a family of bounded instruments rather than a monolithic platform: each component owns one part of the control plane and exposes explicit contracts to the others.

<table>
  <tr>
    <td align="center" width="18%">
      <a href="https://nomed.github.io/projects/#yukh-mcp">
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
      <a href="https://nomed.github.io/projects/#yukh-projects">
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
      <a href="https://nomed.github.io/projects/#yukh-coordination">
        <img src="./public/brand/yukh-coordination.svg" width="64" alt="Yukh Coordination"><br>
        <strong>Yukh Coordination</strong>
      </a>
    </td>
    <td>
      <strong>Cross-session coordination</strong><br>
      Open claims, signals, reviews, evidence, and explicit handoffs. It coordinates work; it does not grant authority.<br>
      <sub>Research / design</sub>
    </td>
  </tr>
</table>

The original [Yukh reconciler](https://github.com/nomed/yukh) remains available as a compatibility implementation while its reusable capabilities migrate into Yukh Projects.

[Explore the system map →](https://nomed.github.io/projects/) · [Read the coordination thesis →](https://nomed.github.io/coordination/)

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
