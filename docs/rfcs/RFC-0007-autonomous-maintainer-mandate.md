# RFC-0007 — Autonomous maintainer mandate: session-separated delegation and bounded execution

- **Status:** Accepted
- **Date:** 2026-08-09
- **Accepted:** 2026-08-09 by `@nomed`
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#45](https://github.com/nomed/nomed.github.io/issues/45)
- **Affected repositories:** `nomed.github.io`, `yukh`, `yukh-projects`, `yukh-mcp`, `yukh-coordination`
- **Supersedes:** [RFC-0006 — Bounded delegation policy for suite governance decisions](RFC-0006-bounded-delegation-policy.md) (now Superseded; RFC-0001 through RFC-0005 are unaffected)

## Summary

RFC-0006 introduced a Class A/B/C decision taxonomy so narrowly-scoped, independently
reviewed, already-authorized decisions could avoid a fresh owner acceptance event every
time. Its Class B pathway requires acceptance by "a specific named human GitHub identity"
distinct from the change's author. This suite has exactly one human maintainer and no
second maintainer to name. That makes Class B **structurally unusable**: the owner is the
effective author of essentially everything (by instructing the work), which — under
RFC-0006's own conflict-of-interest rule — disqualifies the owner from also being the
accepting delegate. The result is that every decision above Class A still routes to the
owner personally: exactly the single undifferentiated gate RFC-0006's own Context section
identified as the problem.

The owner has directed, in explicit terms, that this be solved durably: *"dobbiamo
risolvere in modo definitivo questo problema. troppe autorizzazioni devi essere più
indipendente"* — "we have to solve this problem definitively; too many authorizations,
[the agent] needs to be more independent."

This RFC **fully supersedes RFC-0006 on acceptance** and is self-contained — it restates
what remains true (Class A, the fail-closed philosophy, the immutable record, the
exhaustive-list approach to owner-only gates) and replaces what did not work in practice:

1. **Class B no longer requires a named human delegate.** It requires three distinct,
   non-overlapping **session roles** — author, independent reviewer, executor/merger —
   under stricter evidentiary and fail-closed rules than before.
2. **A new bounded execution class, Class B-X**, lets agents autonomously implement, test,
   and produce exact synthetic/ephemeral, non-production effects strictly inside an
   already-**Accepted** mission envelope (RFC-0005 is the paradigm case), under explicit
   ceilings, allowlists, and review requirements.
3. **Class C is re-precised into a short, exhaustive, owner-only list** targeting real
   consequence — production/adopter data, persistent secrets, irreversible loss, spend,
   mission-authority expansion, public readiness claims, and the policy itself — instead of
   gating every provider call, credential, or deployment step merely for being external.
4. **Suite-wide activation is self-executing** on this RFC's own acceptance, superseding
   RFC-0006's per-repository adoption bootstrap, while every repository remains free to
   narrow (never widen) locally and retains its own more restrictive local authority.
5. **Moving any new-authority RFC — including this one — to Accepted remains Class C,
   human-owner-only, without exception.**

**The owner accepted this exact text on 2026-08-09** (see Acceptance record). Class A, the
role-separated Class B, Class B-X, the Class C hard-gate list, and the default ceilings are
therefore effective immediately in every repository listed under Affected repositories, and
RFC-0006 is superseded. Acceptance activates the policy mechanic itself, not any specific
action: no component change, deployment, credential, or execution described in the Worked
example below has been performed by this RFC or its governing PR.

## Context

### Why RFC-0006's Class B cannot operate as written

RFC-0006 (Accepted 2026-08-09) requires, for every Class B decision:

- "a specific named human GitHub identity (never a bot, service account, agent, or team
  alias)" as delegate; and
- "Author/decider separation ... A single actor cannot both propose and delegate-accept."

The suite has one human owner (`@nomed`) and no second maintainer. Every consequential
change currently originates from the owner's own instruction to an agent session. Under
RFC-0006 as written, that makes the owner the effective author of essentially everything,
which — by RFC-0006's own conflict-of-interest rule — disqualifies the owner from also
being the accepting delegate. There is no other human to name. Class B is therefore
accepted text with zero operational capacity: every decision above Class A still requires
the owner personally, the exact bottleneck RFC-0006 was written to relieve.

### The owner's direction

On 2026-08-09, via cross-session coordination from the "Stato progetto yulh" session, the
owner stated:

> "dobbiamo risolvere in modo definitivo questo problema. troppe autorizzazioni devi
> essere più indipendente."

("We have to solve this problem definitively. Too many authorizations — you need to be
more independent.")

This RFC is the proposed durable resolution: replace the unusable named-human-delegate
mechanic with role-separated agent sessions, and add a bounded execution tier so inert
implementation, testing, and synthetic sandbox work do not each require a fresh owner
event — while keeping every decision that touches real production state, real data,
persistent secrets, irreversible loss, spend, or the policy itself strictly owner-only,
exactly as before.

### What carries forward from RFC-0006, restated here rather than only referenced

- The class philosophy: narrow, evidenced, fail-closed classes rather than one
  undifferentiated gate.
- Class A (editorial/non-semantic maintenance) is unchanged in substance.
- "Agents and skills are mechanisms, not authority" — restated and tightened below.
- The immutable per-decision record, required-evidence, and fail-closed denial-semantics
  philosophy — extended to the new class, not abandoned.
- That moving any new-authority RFC (including this one) to Accepted is Class C,
  human-owner-only, without exception.
- That RFC-0001 through RFC-0005 remain independently authoritative and are not
  reinterpreted by this RFC.

### What changes relative to RFC-0006

| RFC-0006 element | Disposition under this RFC |
| --- | --- |
| Class A (automated merge after checks) | Unchanged, restated below |
| Class C exhaustive list | Re-precised into explicit hard gates (see Class C); every real/production/persistent/irreversible/spend/authority-expansion/public-claim/policy-change instance remains absolutely C |
| Class B named-human-delegate mechanic | **Superseded** — replaced by session-role separation |
| Class B's five substantive conditions | Retained, reworded so the "decider" is a distinct session/model rather than a distinct human |
| Authority source (policy + authenticated GitHub evidence) | Retained, tightened for the shared-identity case |
| Conflict of interest rule | Retained; extended to sessions/models |
| Expiration/version pinning/emergency stop | Retained; emergency stop strengthened to not depend on finding a second human |
| Immutable decision record | Retained; template restated precisely |
| Denial semantics | Retained; extended to Class B-X |
| Migration (per-repository adoption bootstrap) | **Superseded** — suite-wide self-activation on this RFC's own acceptance |
| Rollback | Retained; extended |

## Non-goals

- This RFC does not authorize any live GitHub mutation, deployment, credential
  materialization, infrastructure provisioning, or release on its own — it has no effect
  before acceptance, and even after acceptance only within the exact bounds defined below.
- It does not grant any agent, skill, session, or model authority independent of an
  Accepted mandate text plus authenticated, verifiable repository evidence; it does not
  treat any tool call, transcript, or agent self-assessment as authority.
- It does not authorize production data, adopter data, persistent or broadly reusable
  secrets, or any public production-readiness or SLA claim, under any class this RFC
  defines.
- It does not reinterpret, widen, or supersede RFC-0005's authority matrix, approval
  requirements, or non-goals (including "autonomous approval or acceptance") — the Worked
  example below states this boundary explicitly.
- It does not change who may move an RFC that establishes new authority to Accepted —
  that remains Class C without exception, including for this RFC.
- It does not touch repository creation/archival, release publication, tag movement, or
  permission changes — these remain owner-only regardless of class, consistent with this
  repository's standing `AGENTS.md`.
- It does not require or assume a second human exists, now or later; it is designed to be
  durable for a single-human-owner suite, without precluding a future repository from
  using additional human reviewers if it gains them.

## Decision

### Authority source

Authority to treat a decision as Class A, B, or B-X — never Class C — comes only from
**both**, together:

1. this mandate, Accepted, unrevoked, unexpired, at the exact version (commit SHA)
   recorded; and
2. authenticated, verifiable, immutable GitHub evidence for the exact decision: a commit
   on the named repository, a CI check run, a PR review, or an issue/PR comment — each
   independently attributable to the specific session/role that produced it, by an
   explicit, timestamped, session-tagged statement in that artifact's own text.

An agent's tool call, private transcript, internal reasoning, or self-declared confidence
is never evidence and never authority by itself. A GitHub artifact that does not exist, is
unmerged, is force-pushed away, or is edited after the fact does not count; the record is
what is durably on the remote, not what a session claims happened.

**On identity.** Where all sessions act through the same authenticated GitHub account (the
common case for a single-owner suite with no separate bot identity), "independent" is
established by **session and process separation**, not by distinct GitHub accounts: a
different conversation/session instance, sharing no authoring context, operating under a
distinct declared role, that did not itself author the change under review. This is weaker
than true dual-identity control and is named as a residual risk below — it is compensated
by mandatory role tagging in every record, read-only scope during review, and permanent
auditability, never by access control alone. Where a repository has a distinct bot/service
identity or a second human, that stronger separation is preferred and this mandate does
not discourage it.

### Class A — editorial/non-semantic maintenance (unchanged)

Eligible for automated merge after checks, with no acceptance event required, subject to
standing branch protection and required status checks. In scope only when **all** hold:

- the change alters no meaning: no code semantics, no contract, no schema, no RFC status,
  no authority statement, no security control, no numeric threshold, no external link
  target that changes what it resolves to;
- the change is limited to prose correction, dead-link repair to the same referent,
  whitespace/lint conformance, or a mechanical rename a passing test suite verifies is
  behavior-preserving;
- all required CI checks (build, test, lint) pass on the exact proposed commit;
- the change carries no new top-level directory, no new dependency, and no change to
  `AGENTS.md`, `docs/rfcs/`, or any file this mandate or an Accepted RFC designates as
  governance-bearing.

Any doubt about whether a change is non-semantic moves it to Class B or C.

### Class B — governance-only/inert decisions, session-role separation instead of a named delegate

Class B decisions — governance-only/inert decisions strictly within already-Accepted
authority — no longer require a named human delegate. Every Class B (and Class B-X)
decision instead requires three **distinct session roles**, none of which may be the same
session or share authoring context:

1. **Author** — the session that drafts the change (text, code, configuration) and states
   its exact proposed scope.
2. **Independent reviewer** — a distinct session or model instance, opened specifically to
   review, with **read-only** repository scope for the duration of its review (no write,
   push, merge, or execution capability). It did not author the change, is not the
   executor, and confirms the exact diff matches the stated scope and that no Class C
   criterion is met. Its confirmation is posted as a dated, session-identified comment on
   the exact commit/PR/issue.
3. **Executor/merger** — a distinct session that performs the merge or execution step only
   after the independent reviewer's confirmation is visible on the exact commit. The
   executor is never the author and never the independent reviewer for that decision.

Each role is recorded by an explicit statement in the governing issue or PR — model/session
identifier, role, and timestamp — because there is no separate GitHub account to infer
roles from. A record missing any of the three distinct roles, or showing role overlap, is
not a Class B decision; it fails closed to Class C.

Class B's substantive conditions, carried forward from RFC-0006 and reworded only to
remove the human-delegate requirement:

1. **Strictly within already-Accepted authority.** The decision creates no new authority,
   changes no Accepted RFC's meaning, and does not itself move an RFC that establishes new
   authority to Accepted.
2. **Independent review** by a distinct session as defined above.
3. **All required checks green** on the exact commit being accepted — no override, no
   admin merge, no skipped check.
4. **No unresolved conflict with Accepted records** (see Conflict resolution below for the
   specific tie-break this RFC adds for Proposed-vs-Proposed conflicts).
5. **Exact scope and evidence.** The governing issue states the exact artifact(s) changed,
   the exact prior authorization being invoked, and the exact commit SHA. Vague or
   paraphrased scope disqualifies the decision from Class B.
6. **Author/executor separation.** The authoring session is never the executing session.

If any condition cannot be evidenced, the decision fails closed to Class C. Class B never
applies to the decision that first moves an RFC establishing new authority to Accepted.

### Class B-X — bounded autonomous execution (new)

Class B-X sits between Class B (inert, no external effect) and Class C (owner-only). It is
eligible only when **every** condition below holds.

**Scope.** The work is implementation, automated tests, local build/lint artifacts,
release-candidate assembly (not publication), ephemeral infrastructure, short-lived
credentials scoped to that infrastructure, and/or an exact, named, synthetic,
non-production effect — strictly inside the boundary an already-**Accepted** RFC has
defined as its mission envelope. RFC-0005 is the paradigm case: an ephemeral sandbox,
synthetic repository/Project/issue targets, redacted evidence, one-attempt fail-closed
semantics, and discard-without-production-consequence.

**Boundary to RFC-0005 specifically.** Class B-X does not reinterpret, widen, or grant
autonomous authority over RFC-0005's own authority matrix. RFC-0005's row "Approve each
exact plan or capability → Independent human-governed approval authority" and its
non-goal of "autonomous approval or acceptance" are untouched — B-X never performs that
approval step itself. B-X only lets an agent session autonomously perform the surrounding,
non-approval work (writing the code, running the reference/adversarial test corpus,
standing up and tearing down the ephemeral sandbox, preparing — never publishing — a
release candidate) whose own effects never leave the synthetic/ephemeral/non-production
boundary.

**Conditions, all required:**

1. **Least privilege.** Credentials, tokens, and scopes are the minimum needed for the
   exact bounded action, never broader.
2. **Allowlists.** Providers, targets, repositories, and operations are drawn only from an
   explicit allowlist an Accepted RFC or this mandate's ceilings already name; nothing
   outside the allowlist is B-X-eligible.
3. **Ceilings.** Cost, time, and resource ceilings (below) are declared before the action
   and independently confirmed not exceeded after.
4. **Dry-run/preflight.** A non-effecting preflight or dry-run validates preconditions
   before any effecting step, wherever the target supports one.
5. **Independent review, plus security review where relevant.** The same session
   separation rules as Class B; any action with a security-sensitive element (credential
   handling, network egress, provider/capability admission, identity or trust-boundary
   surface) additionally requires a distinct security-focused review session (see
   Independent review below).
6. **Redacted evidence.** Records reference artifact digests, logical bindings, and
   outcomes — never raw credentials, unrestricted transcripts, or private infrastructure
   identifiers.
7. **Rollback/teardown.** Ephemeral infrastructure and synthetic effects are torn down or
   restored to their pre-action state, and that teardown/restoration is itself verified
   and recorded, not assumed.
8. **One attempt, no hidden retry.** Exactly one attempt per approved B-X action; a crash,
   timeout, or ambiguous outcome produces `completion_unknown` (consistent with RFC-0005's
   own failure semantics) and is never silently retried — recovery requires a fresh review
   cycle.
9. **Fail closed.** Any missing condition above denies the action to B-X; it falls to
   Class C, never proceeds partially.

Any action outside these bounds — anything touching production or adopter data or scope, a
persistent credential, an irreversible effect, spend above the ceiling, or authority beyond
the invoking RFC's mission — is Class C by definition, not a stricter form of B-X.

### Default ceilings for Class B-X

Absent an owner-set override, Class B-X actions are bounded by:

| Ceiling | Default |
| --- | --- |
| One-off cost | ≤ EUR 25 |
| Recurring cost | ≤ EUR 10 / month |
| Resource lifetime | ≤ 24 hours before automatic teardown |
| Account/scope | No production account, tenant, or scope; synthetic, dedicated, disposable targets only |

**Overrides** are set only through this mandate's own standing record — a single place
(this RFC as amended by a superseding or explicitly owner-annotated revision) — never on a
per-action or per-issue basis. A session may not raise a ceiling for a specific action by
declaring the default "doesn't fit here"; that is Class C (a policy change) regardless of
how reasonable the exception seems in the moment.

### Class C — owner-only hard gates, exhaustive

The following are **always** Class C, regardless of how mechanical, small, or well-reviewed
the diff looks, and regardless of any Class B-X ceiling being nominally satisfied:

1. **Production or adopter/real data** — any real user, adopter, customer, or production
   dataset, account, tenant, or scope.
2. **Material privacy/legal/data-boundary changes** — what is collected, retained,
   disclosed, or who can see it.
3. **Persistent or broadly reusable secrets** — any credential, token, or key that
   outlives one bounded B-X action or is usable beyond its declared narrow scope.
4. **Irreversible or destructive actions without independently verified restore** — any
   action whose undo cannot be independently confirmed before the action proceeds.
5. **Spend above the explicit default ceiling** (or a recorded owner override) for that
   specific action.
6. **Expansion outside accepted mission authority** — any new provider, target,
   capability, repository, or operation not already named by an Accepted RFC's mission
   envelope or this mandate's allowlist; also, superseding or reinterpreting any Accepted
   record's operation semantics (RFC-0005's Effect A/B operation split remains the
   standing example of what may never be casually re-derived).
7. **Public production-readiness or SLA claim** — any statement, publicly or to an
   adopter, that the suite or a component is production-ready, supported, or covered by an
   availability commitment.
8. **Changing this hard-stop policy itself** — the class definitions, ceilings, gates, or
   this mandate's own status.

This list is exhaustive and deliberately short; it is not extended by analogy — a decision
not on this list may still be Class C by failing a Class A/B/B-X condition, but nothing may
be *added* to this list without a superseding RFC. Conversely, a provider call, a
credential materialization, a deployment step, or an "accepted-operation choice" is **not**
automatically Class C merely for being external, live, or previously Class C under
RFC-0006 — if it is synthetic, ephemeral, non-production, allowlisted, and strictly inside
an Accepted mission's envelope, it is Class B-X, not Class C. Also unaffected and retained
as owner-only regardless of class: repository creation or archival, release publication,
tag movement, and permission changes, consistent with this repository's standing
`AGENTS.md`.

A decision ambiguous between B-X and C is C. A decision partially matching any Class C
criterion is wholly Class C.

### Conflict resolution among Proposed records inside an Accepted mission

When two or more **Proposed** component records conflict inside a single **Accepted**
mission envelope, an agent session may resolve the conflict autonomously — recording the
decision in the governing issue — by applying these tie-breaks in order until one
discriminates:

1. **Least authority expansion** — prefer the option that claims the least new authority
   or capability.
2. **Already-Accepted semantics** — prefer the option consistent with an existing Accepted
   record's operation semantics over one that would require reinterpreting it.
3. **Compatibility** — prefer the option that preserves compatibility with other Accepted
   or in-flight records.
4. **Reversibility** — prefer the option that is more easily and verifiably undone.
5. **Smallest diff** — prefer the option requiring the smallest, most contained change.

This applies only to **Proposed-vs-Proposed** conflicts inside an Accepted envelope.
**Superseding an Accepted semantic record** may be done autonomously only if both: (a) the
Accepted mission that record belongs to explicitly leaves that specific choice open
(states it as an unresolved decision or an explicit variation point), and (b) the change
does not widen any effect, scope, or authority. If either condition fails, superseding an
Accepted record is Class C without exception — the same rule RFC-0006 already applied to
the `set_field_value`/`add_dependency` Effect A/B split, and this RFC does not loosen it.

### Independent review, including security review

- Independent review is always performed by a session or model instance distinct from the
  author, with **read-only** scope for the review itself — it cannot also merge, execute,
  or modify during its review.
- No same-session self-review, under any class. A single session may not draft a change
  and then review its own diff.
- Any Class B-X decision with a security-sensitive element (credential handling, network
  egress, provider/capability admission, identity or trust-boundary surface) requires
  **both**: (a) the normal independent reviewer above, and (b) a distinct security-focused
  review session evaluating the change specifically for abuse cases, privilege scope, and
  blast radius. Both confirmations are recorded before execution.
- A reviewer that is unavailable, indistinguishable from the author, or whose confirmation
  cannot be tied to a specific session/timestamp is not independent review; the decision
  fails closed.

### Conflict of interest

- Author/executor separation is mandatory and non-waivable.
- A session that authored, materially drafted, or has an undisclosed interest in a change
  must recuse from reviewing or executing it.
- Any party may flag a suspected conflict in the governing issue; a flagged, unresolved
  conflict blocks the decision until the owner resolves it.

### Expiration, versioning, emergency stop, and audit review

- **Durability.** This mandate does not expire merely by the passage of time. It ends only
  by (a) explicit owner revocation, or (b) a superseding RFC. The audit cadence below is a
  maintenance and narrowing mechanism, not an expiration.
- **Version pinning.** Authority under this mandate is pinned to its exact Accepted commit
  SHA; a superseding RFC or a recorded revocation suspends it immediately.
- **Emergency stop remains immediate** and requires no acceptance criteria of its own: the
  human owner may revoke Class B or Class B-X, for any or all repositories, at any time, by
  recording revocation in a governing issue. Revocation is retroactive to any
  not-yet-finalized decision and never retroactive to an already-recorded, already-evidenced
  decision.
- **This RFC removes reliance on a second human for the emergency-stop fallback.** RFC-0006
  allowed "any two independent maintainers acting jointly" to revoke when the owner was
  unreachable — a path that assumes a second maintainer this suite does not have. In its
  place: any **single** agent session, upon detecting a plausible Class C boundary breach,
  missing evidence, or credible incident, must immediately halt its own action (fail
  closed, per Denial semantics below) and may record a suite-wide **precautionary
  suspension** of Class B-X pending owner review. This requires no second human because it
  only ever removes autonomy, never grants or restores it — restoring suspended autonomy
  always requires the owner.
- **Audit review.** Every 90 days from this RFC's acceptance (or from the last completed
  audit), an owner audit review of accumulated Class B/B-X decision records must occur. If
  the 90-day window elapses with no completed audit, **Class B-X automatically narrows to
  Class A/B** suite-wide until the audit is completed and recorded. This is a narrowing,
  not a stop: Class A and Class B continue unaffected, and no in-flight work is
  force-cancelled, but no new B-X action may begin until the audit closes. Audit review
  requires no fixed format; it requires the owner to state, in a governing issue, that the
  accumulated record was reviewed and whether any narrowing, revocation, or ceiling change
  follows.

### Immutable decision record

Every Class B or Class B-X decision produces, in the governing issue or PR, an immutable
record using the template below. It is never edited after the fact; a correction requires
a new comment, never a rewrite.

### Denial semantics

- Absence of any required condition — evidence, role separation, checks, ceiling
  confirmation, review (including security review where required), or rollback/teardown
  verification — is a **denial**, not a pending state to proceed past.
- A denied decision does not retry automatically at a looser class or with relaxed
  conditions; it either waits for the missing evidence/condition or is escalated to the
  next stricter class, ultimately Class C.
- No agent, session, workflow, or skill may reclassify a denied decision to a looser class
  to avoid a gate.
- Silence, timeout, an unanswered review request, or a session's own "probably fine"
  assessment is never evidence.
- A Class B-X action that produces an ambiguous outcome (`completion_unknown`) is treated
  as denied for the purpose of any decision that depends on its success; it is never
  assumed successful.

### Evidence template

```text
Decision: <one-line description>
Class: B | B-X
Authority chain: <Accepted RFC(s)/provision(s) that authorize this>
Author session: <session/model identifier, timestamp>
Independent reviewer session: <session/model identifier, timestamp, confirmation quoted>
Security reviewer session (B-X security-sensitive only): <session/model identifier, timestamp, confirmation quoted>
Executor/merger session: <session/model identifier, timestamp>
Commit SHA(s): <exact commit(s)>
Checks: <list, each with pass/fail state, on the exact commit>
Scope: <exact artifact(s)/effect(s), no paraphrase>
Ceilings declared (B-X only): <cost, time, resource lifetime, account/scope>
Ceilings confirmed not exceeded (B-X only): <yes/no, evidence>
Synthetic-target confirmation (B-X only): <target identity, non-production confirmation>
Rollback/teardown evidence (B-X only): <what was verified restored/torn down, how>
Conflict check: <no unresolved conflict with any Accepted record — state which were checked>
Outcome: Accepted at Class <A|B|B-X> | Denied, escalated to Class C
```

## Worked example — illustrative only, not executed by this RFC

This section illustrates how the mandate, **once Accepted**, would classify a live tension
already on record in RFC-0006's own examples table (`yukh-projects#150`, the Accepted
`add_dependency`/Proposed MCP `set_field_value(status)` split). **No action described in
this section has been taken.** This RFC does not modify `yukh-mcp`'s RFC-0011, does not
touch `yukh-projects#150`, and does not execute any implementation or sandbox step. Those
repositories are outside this session's access and outside this PR's scope; real execution
requires each owning repository's own session, and only after this RFC reaches Accepted
status and that repository confirms no conflicting local authoritative record (see
Migration, below).

Applying the Conflict resolution rule above to the recorded tension:

- **Choice:** keep the Accepted Projects `add_dependency` operation for Effect A rather
  than adopt a competing Proposed MCP `set_field_value(status)` approach.
- **Why, by the tie-break order:** it claims no new authority (tie-break 1); it matches
  RFC-0005's already-Accepted Effect A/B operation split rather than reinterpreting it
  (tie-break 2) — the remaining tie-breaks are not reached because tie-break 2 already
  discriminates, since RFC-0006's own examples table already names this exact substitution
  as Class C ("superseding the accepted `set_field_value`/`add_dependency` split... is
  never delegable regardless of how mechanical the diff looks").
- **What could follow, once this RFC is Accepted and once `yukh-mcp`/`yukh-projects`
  sessions independently act:** `yukh-mcp`'s own RFC-0011 revision and
  `yukh-projects#150`'s schema/documentation mechanics could proceed as Class B (inert,
  already-Accepted-authority mechanics, per RFC-0006's own worked example) or Class B-X (if
  they include synthetic sandbox qualification work strictly inside RFC-0005's envelope) —
  **provided** each is independently reviewed, checks are green, and no security-sensitive
  element (trust-root selection, credential handling) is bundled in; any such element is
  split out and remains Class C, exactly as RFC-0006 already required.
- **What remains hard-gated regardless:** any public claim that the resulting capability is
  production-ready, any real Projects mutation against production or adopter data, and any
  persistent credential — none of this Worked example authorizes any of those.

## Repository ownership

| Repository | Responsibility under this mandate |
| --- | --- |
| `nomed.github.io` | This RFC, its governing issue, the RFC index, and the suite-level mandate text. It does not itself execute Class B-X actions in other repositories. |
| `yukh`, `yukh-projects`, `yukh-mcp`, `yukh-coordination` | Bound by this mandate immediately on suite acceptance (Migration below); each applies the class definitions to its own decisions, may narrow locally without owner confirmation, and must flag any conflicting existing local authoritative record rather than silently overriding it. |

Component-local security, release, and threat-model authority remain entirely with each
component repository. New authority, identity, persistence, orchestration, or trust
boundaries introduced by a specific Class B-X implementation still require a threat-model
review in the owning component before that implementation proceeds, consistent with this
suite's standing agent instructions.

## Compatibility and security consequences

- **Compatibility:** This RFC changes no code, contract, schema, or runtime behavior by
  itself. It is a governance-process document, like RFC-0006.
- **Security — design intent:** every widening relative to RFC-0006 (removing the
  named-human-delegate requirement, adding Class B-X) is paired with a narrowing or new
  control: session-role separation with read-only review scope, mandatory security review
  for security-sensitive B-X, explicit ceilings, allowlists, one-attempt fail-closed
  execution, mandatory rollback verification, and a 90-day audit that narrows scope by
  default on neglect rather than expiring silently.
- **Residual risk — shared identity.** Where an author, reviewer, and executor session all
  act through the same underlying GitHub account (no separate bot identity), GitHub's own
  audit log cannot by itself distinguish the three roles; this mandate's role separation is
  enforced by process discipline and explicit, timestamped, session-tagged statements in
  the immutable record, not by access control. This is materially weaker than RFC-0006's
  original named-second-human model and is accepted as a deliberate, stated trade-off in
  exchange for operability. It is mitigated, not eliminated, by mandatory read-only review
  scope, security review for sensitive B-X, and permanent post-hoc auditability.
- **Residual risk — session collusion.** Nothing prevents a single operator from
  instructing multiple sessions to collude (for example, approving one's own work through a
  differently-labeled session). This mandate cannot detect intent; it relies on the same
  operator who directed independence to also want the record to be honest, and on the
  90-day audit review as a backstop. This is stated plainly rather than assumed away.
- **Residual risk — unverified component state.** This RFC's self-activating Migration was
  written from `nomed.github.io`'s current `main` only; the current governance state of
  `yukh`, `yukh-projects`, `yukh-mcp`, and `yukh-coordination` was not independently
  checked from this session. See Migration, point 5, below.
- **No loosening of Class C.** Every hard gate in Class C is preserved or tightened
  relative to RFC-0006; none is loosened.

## Migration

Unlike RFC-0006, this RFC's mechanics do not require a separate per-repository adoption
record:

1. **Suite acceptance.** The human owner explicitly accepts this exact RFC text (see
   Acceptance record below). This single act both makes this RFC Accepted and moves
   RFC-0006 to Superseded.
2. **Immediate suite-wide effect.** On that acceptance, Class A, the role-separated Class
   B, Class B-X, the Class C hard-gate list, and the default ceilings become effective
   immediately in every repository listed under Affected repositories —
   `nomed.github.io`, `yukh`, `yukh-projects`, `yukh-mcp`, `yukh-coordination` — with no
   separate bootstrap PR or issue required in each.
3. **Local narrowing without owner confirmation.** Any listed repository may, at any time,
   narrow this mandate locally (lower ceilings, disable Class B-X entirely, require
   additional reviewers, shorten expirations) by recording the narrower rule in its own
   governance surface, without needing fresh owner confirmation for the narrowing itself.
4. **Local widening requires the owner.** No repository may widen any part of this mandate
   — a looser ceiling, a removed review requirement, a broader allowlist — without a
   fresh, explicit owner acceptance recorded in that repository, exactly as any Class C
   change would require.
5. **Existing component-local authority is not overridden.** If an affected repository
   already has its own accepted, more restrictive authoritative record (a threat model,
   ADR, or security policy), that local record continues to bind within that repository per
   this suite's standing precedence order — repository-local behavior continues to follow
   the nearest repository's own instructions and accepted decisions. This RFC was drafted
   from `nomed.github.io`'s current `main` only; it does not verify the current state of
   `yukh`, `yukh-projects`, `yukh-mcp`, or `yukh-coordination`, and does not assume no such
   conflicting record exists. A repository with one should record the conflict in its own
   governance surface; until reconciled, its local rule is the stricter one and prevails
   there.
6. **No repeated bootstrap gates.** Re-affirmation is required only on revocation or
   expiry of this mandate itself, never per repository and never per decision.

## Rollback

- Before this RFC is accepted, rollback is simply declining it: RFC-0006 remains exactly
  as accepted, with Class B inoperable for lack of a usable delegate, and every decision
  above Class A continues to require the owner personally.
- After acceptance, withdrawing this mandate requires a superseding RFC — it cannot be
  reverted by an agent decision, by definition (Class C: "changing this hard-stop policy
  itself").
- Emergency stop (above) immediately suspends Class B-X, or all delegated classes, without
  a superseding RFC, and fails to the stricter (owner-only) state; it does not itself
  repeal this RFC's text, only its current operative effect.
- Rollback never reuses a suspended or revoked window's role assignments or ceiling
  overrides; resuming after suspension requires a fresh audit review (if suspension was for
  a missed audit) or fresh owner action (if suspension was for revocation or incident).
- No rollback of this RFC retroactively invalidates an already-evidenced, already-recorded
  Class B or B-X decision; it only prevents new ones.

## Completion evidence

This RFC is implemented only when:

- it exists on `main` in `docs/rfcs/` with correct numbering and index entry, and its
  status is Accepted;
- the governing issue documents review, and — separately — the owner's exact acceptance
  statement verbatim, recorded before any mandate mechanic is treated as active anywhere;
- no repository or session claimed Class B-X, or role-separated Class B, as active before
  this RFC's own status became Accepted;
- existing site checks (build, test, lint) pass unchanged, since this RFC alters no
  application code;
- the Worked example section is understood, and remains, as illustrative only — no
  `yukh-mcp`, `yukh-projects`, `yukh-coordination`, or `yukh` file has been changed by this
  RFC or its governing PR.

## Unresolved decisions

1. Whether a repository that later gains a second human maintainer should revert to
   RFC-0006's named-delegate model for that repository, run both models in parallel, or
   continue with session-role separation as the default — left to that repository's own
   choice; this mandate does not mandate a return to named delegates.
2. Whether the 90-day audit cadence should differ per repository (a higher-velocity
   repository might want 30 days; a dormant one might not need 90) — left as a local
   narrowing option (Migration, point 3) rather than fixed here.
3. Whether a machine-readable schema for the evidence template should be defined in a
   follow-up RFC so tooling can verify Class B/B-X eligibility automatically, rather than
   by the manual template specified here.
4. The default ceilings (Default ceilings for Class B-X) are a recommendation informed by
   the request that produced this RFC; the owner may set different suite-wide defaults at
   acceptance time, through the single standing-record mechanism this RFC defines, never
   per action.
5. Whether RFC-0006's "any two independent maintainers" emergency-stop fallback should be
   treated as entirely removed or merely dormant until a second maintainer exists — this
   RFC treats it as superseded by the single-session precautionary-suspension mechanism
   above, since RFC-0006 is fully superseded rather than partially amended.

These do not permit any implementation to widen this mandate beyond what is explicitly
defined above.

## Acceptance record

The owner accepted this RFC as written on 2026-08-09, via cross-session coordination from
the "Stato progetto yulh" session, in these exact terms:

> "Accetto la RFC-0007 come scritta, attivando in tutta la suite l'Autonomous Maintainer
> Mandate — inclusa la Classe B senza delegato umano nominato e la Classe B-X con i tetti
> indicati — capendo che i vincoli di Classe C restano invariati e che nessuna
> pubblicazione, dato di produzione, segreto persistente o azione irreversibile è
> autorizzata da questa accettazione."

("I accept RFC-0007 as written, activating the Autonomous Maintainer Mandate suite-wide —
including Class B without a named human delegate and Class B-X with the stated ceilings —
understanding that Class C gates remain unchanged and that no publication, production
data, persistent secret, or irreversible action is authorized by this acceptance.")

This is, verbatim, the exact acceptance statement this RFC specified as sufficient. It is
recorded in full in [issue #45](https://github.com/nomed/nomed.github.io/issues/45) and in
[PR #46](https://github.com/nomed/nomed.github.io/pull/46), and is recorded here as
explicit, unambiguous acceptance of this RFC as written, on those terms.

Acceptance makes this RFC's authority source, class taxonomy, session-role Class B
mechanic, Class B-X definition and default ceilings, Class C hard-gate list,
conflict-resolution tie-breaks, independent- and security-review requirements, emergency
stop, expiration/audit rules, denial semantics, and evidence template authoritative text,
effective immediately in every repository listed under Affected repositories, and
simultaneously moves RFC-0006 to Superseded. It does not:

- authorize any Class C decision — no new authority, production or adopter data, material
  privacy/legal/data-boundary change, persistent or broadly reusable secret,
  irreversible/destructive action without independently verified restore, spend above the
  stated ceiling, mission-authority expansion, public production-readiness/SLA claim, or
  change to this hard-stop policy itself is authorized by this acceptance;
- perform, or retroactively validate, any action described in the Worked example section —
  that section remains illustrative only; no file in `yukh-mcp`, `yukh-projects`,
  `yukh-coordination`, or `yukh` was changed by this RFC or its governing PR;
- reinterpret RFC-0001, RFC-0002, RFC-0004, or RFC-0005, which remain independently
  authoritative within their own scope; and
- relieve any affected repository of recording its own local narrowing, or of seeking
  fresh, explicit owner acceptance before any local widening, per Migration.
