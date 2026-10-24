# Yukh Research — clean-sheet discovery

- **Status:** Independent discovery, no architecture selected
- **Started:** 2026-10-24
- **Publication:** https://nomed.github.io/research/

> Yukh is the name of the exploration, not the architecture we intend to preserve.

## Mission

Discover how organizations can combine people and AI agents to deliver work across teams, projects and customer engagements: planning, issue/task management, coding, orchestration, review, remote and local execution, security, and cost allocation.

**This is a genuine restart.** No existing Yukh code, decomposition, RFC, design principle, protocol, service boundary or technology is an input requirement. Complete replacement, no custom software, SaaS, open-source integration, or a total refactor are equally legitimate outcomes.

Existing Yukh repositories and decisions are historical material to evaluate **after** defining needs, market landscape, independent alternatives and evaluation criteria. Existing RFCs govern the *currently deployed/accepted system only*, not the research conclusion. This corpus must not silently alter those RFCs or imply adoption.

## Research method

1. Derive scenarios from real work, independently of the current solution.
2. Continuously discover relevant open-source and commercial projects, including trending GitHub repositories.
3. Classify candidates by problem solved, not hype, stars or resemblance to Yukh.
4. Evaluate deployment, licensing, CLI/SDK/API integration, authentication, work tracking, cost accounting, governance, and security using dated primary sources.
5. Run independent reproducible experiments, including adversarial and failure cases.
6. Compare build, buy, integrate, replace, and do-nothing alternatives on the same criteria.
7. Design greenfield architecture candidates first; inspect the existing Yukh system against the winning alternatives only afterward.

Every claim is tagged as **source-verified**, **observed in experiment**, **inferred**, or **open**. A GitHub trending appearance is a discovery signal, *not* proof of production readiness, security, maintained quality, or functional support.

## Domains

- Human/agent team organization and operational models
- Multi-project work, issue/task/PR automation, GitHub and Jira
- Agent runtimes, CLI/IDE/SDK/API, authentication and subscription constraints
- Local workstations, headless VPS, containers, managed agents
- Multi-agent orchestration, durable workflows, coordination and failure recovery
- FinOps by organization, customer engagement, project, user and work item
- Governance, evidence, permissions, security, quality and accountability
- Scale scenarios for 10, 50 and 200 developers

## Living research documents

- [GitHub project watchlist and scouting protocol](GITHUB-WATCH.md)
- [Paperclip vs Superset technical deep dive](DEEP-DIVE-001-paperclip-superset.md)
- [Open questions and experiment backlog](BACKLOG.md)
- [Evidence register](EVIDENCE.md)

Research notes are published incrementally. Accepted architectural changes, if any, require a separate review, not a retrospective rewrite of this research.
