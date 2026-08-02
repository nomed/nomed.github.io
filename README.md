# Nomed

Nomed is an independent systems practice building open infrastructure for governed agentic development.

The hard problem is no longer making one agent produce more output. It is enabling people and agents to work across sessions, tools, repositories, and model providers without losing intent, authority, evidence, or memory. Nomed turns that problem into public protocols, bounded components, golden paths, and durable engineering records.

This repository is the public home and governance hub for that work: [nomed.github.io](https://nomed.github.io/).

## The operating thesis

- **Capability, not custody.** Agents receive narrowly governed capabilities; they do not inherit unrestricted credentials or invisible authority.
- **Plans before mutations.** Consequential actions begin as inspectable intent and end with verifiable evidence.
- **Memory outside the session.** Decisions, claims, handoffs, and outcomes survive any single chat, agent, or vendor.
- **Coordination in the open.** Parallel work is made legible through explicit ownership, state, dependencies, and review.
- **Vendor-neutral by design.** The contracts must work across Codex, ChatGPT, Claude, Gemini, local agents, and future runtimes.
- **Honest maturity.** Research, foundations, compatibility layers, and production-ready systems are named for what they are.

Read the [manifesto](https://nomed.github.io/manifesto/) for the full position.

## The Yukh suite

Yukh is a family of bounded instruments, not a monolithic agent platform. Each component owns one part of the control plane and exposes explicit contracts to the others.

| Component | Responsibility | Current maturity |
| --- | --- | --- |
| [Yukh MCP](https://github.com/nomed/yukh-mcp) | Exposes policy-governed, typed capabilities with an intent-to-evidence lifecycle. | Foundation |
| [Yukh Projects](https://github.com/nomed/yukh-projects) | Reconciles declarative portfolio and delivery state in GitHub Projects without binding it to one consumer. | Foundation bootstrap |
| [Yukh Coordination](https://github.com/nomed/yukh-coordination) | Defines open claims, signals, reviews, evidence, and handoffs across isolated sessions. It coordinates; it does not grant authority. | Research / design |
| [Yukh legacy](https://github.com/nomed/yukh) | Preserves the original GitHub Projects reconciler while compatible capabilities migrate into Yukh Projects. | Compatibility |

See the [public project map](https://nomed.github.io/projects/) and the [coordination thesis](https://nomed.github.io/coordination/) for the boundaries between these components.

## What belongs here

`nomed.github.io` contains the current editorial site and the reviewed, cross-repository governance records that define how the wider system evolves. Runtime implementations remain in their own repositories; project facts link to those canonical sources rather than being duplicated here.

```text
app/       current editorial application and routes
public/    public assets
docs/      reviewed governance records
tests/     executable publication checks
build/     hosting build integration
worker/    hosting runtime integration
```

Historical material predating the current site is preserved exactly on the `archive/legacy-site-2026-08-02` branch and is intentionally absent from `main`.

New top-level directories require a documented, current responsibility. `main` is not an archive, scratch space, or session store.

## Local development

```bash
npm install
npm run dev
```

Before proposing a change, run:

```bash
npm run lint
npm test
npm run build
```
