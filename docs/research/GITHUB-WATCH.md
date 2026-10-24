# GitHub radar — continuous relevant-project scouting

**First scan:** 2026-10-24. **Status:** candidates discovered, **not validated**.

## Why and how

GitHub Trending, topics, curated orchestration lists, release feeds and new repositories are discovery inputs. Each scan should capture the observation date and source, deduplicate forks/renames, check the **original GitHub repository**, and promote candidates to experiments only when relevant to at least one target scenario.

Review weekly during active discovery, and on significant releases/new tool emergence. **This is a manual editorial cadence, not an already-configured automated monitor.**

Metrics to record: repository URL, commit/release freshness, contributors, issue/PR responsiveness, license, governance/maintainers, stars gained over a stated interval (never stars alone), installation and actual execution, supported providers, local/headless/remote mode, Jira/GitHub integration, economics, security model, operational complexity, maintenance risk and alternatives.

Suggested ranking: **scenario relevance 30%, execution/integration fit 20%, verification maturity 20%, security & portability 15%, maintenance/operability 10%, momentum 5%**. A missing critical feature or unsafe license/security posture overrides popularity. Missing metrics stay unknown, never scored as zero or pass.

## First candidates (signals, not recommendations)

| Project | Hypothesis to test | GitHub source |
| --- | --- | --- |
| Paperclip | Team/task/cost control plane for several agent workers | https://github.com/paperclipai/paperclip |
| Ruflo | Meta-harness for coordinated agent swarms and cross-machine work | https://github.com/ruvnet/ruflo |
| Orca | Concurrent local/remote coding agents and git worktrees | https://github.com/stablyai/orca |
| Multica | Issue-driven workspace assigning tasks to coding agents | https://github.com/multica-ai/multica |
| Herdr | Persistent sessions and multi-agent terminal supervision | https://github.com/herdrdev/herdr |
| Superset | Parallel agent IDE / worktree experience | https://github.com/superset-sh/superset |
| OpenHands | Agent execution / isolation and automation candidate | https://github.com/OpenHands/OpenHands |
| OpenCode | Alternative terminal-based coding agent | https://github.com/anomalyco/opencode |
| DeerFlow | Long-horizon subagent and sandbox orchestration | https://github.com/bytedance/deer-flow |
| ECC | Harness patterns, skills, verification and agent engineering | https://github.com/affaan-m/ECC |
| Harness2 | Optimization of the agent harness itself | https://github.com/google-research/harness2 |
| Claude Sandbox Runtime | Process-level filesystem/network isolation | https://github.com/anthropics/sandbox-runtime |

Other source lists to scan:
- https://github.com/trending
- https://github.com/topics/agent-orchestration
- https://github.com/erson/awesome-coding-agent-orchestration

Discovery signals observed 2026-10-24: https://github.locker/topics/agent-orchestration and https://ossradar.net/topic/agent-orchestration. Third-party trending rankings are *leads* and require independent checks of repository identity, commits, features, and licenses. This table does not assert successful builds or current compatibility.

## Investigation loop

**Discover → verify repository → characterize capability → document evidence → compare alternatives → run spike → record verdict → revisit on meaningful change.**

A candidate may be **watch**, **shortlist**, **in experiment**, **verified fit**, **rejected** or **stale**. Record rejection reasons and revisit triggers; avoid forcing every discovered project into the eventual architecture.
