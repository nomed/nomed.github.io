# RFC-0006 — Bounded delegation policy for suite governance decisions

- **Status:** Superseded
- **Date:** 2026-08-09
- **Accepted:** 2026-08-09 by `@nomed`
- **Superseded:** 2026-08-09 by [RFC-0007 — Autonomous maintainer mandate: session-separated delegation and bounded execution](RFC-0007-autonomous-maintainer-mandate.md)
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#43](https://github.com/nomed/nomed.github.io/issues/43)
- **Affected repositories:** `nomed.github.io`, `yukh-projects`, `yukh-mcp`, `yukh-coordination`, `yukh`

## Summary

The suite's governance model (RFC-0001 through RFC-0005 and this repository's
`AGENTS.md`) currently routes every cross-suite decision — from a typo fix to a
production credential change — through the same single gate: explicit human
owner acceptance. That uniform gate is safe but not durable at the pace the
suite is producing proposed records; it creates repeated low-value acceptance
requests that compete for owner attention with the decisions that actually
need it.

This RFC defines a **bounded delegation policy**: a three-class decision
taxonomy (A/B/C) that lets narrowly-scoped, independently reviewed,
already-authorized, inert decisions be accepted without a fresh owner
acceptance event, while keeping every decision that creates, changes, or could
be mistaken for new authority, external effect, or live risk strictly
human-owner-only. The policy is explicit, auditable, revocable by default, and
fails closed: if any required condition cannot be evidenced, the decision
falls to the next stricter class, ultimately to the human owner.

**This RFC does not itself delegate anything.** Suite-level acceptance of the
policy text (recorded below) activates no Class B delegation in any
repository by itself. No decision may be treated as delegated, and no
repository may claim Class B delegated acceptance, until that repository
separately completes its own owner-accepted adoption record per Migration.
Until a repository does so, every governance decision in it continues to
require the human owner, exactly as under RFC-0001 through RFC-0005 today.

## Context

RFC-0001 through RFC-0005 established a strict rule: *"Only the human owner
may move an RFC to Accepted."* That rule remains correct for RFC status
transitions and for every decision that establishes or changes authority. But
the suite's current pipeline (§ see `nomed.github.io#39`, `#40`,
`yukh-coordination#195`) already shows the cost of a single undifferentiated
gate:

- `yukh-coordination#195` produced a Proposed RFC-0025, received verbal owner
  acceptance ("Accetto tutti e tre"), and is now explicitly blocked — by its
  own accepted sequencing — on a **second, separate, governance-only pull
  request** whose only job is to record that already-given acceptance as an
  Accepted-status document. That second PR changes no code, no contract, and
  no authority; it exists purely so the acceptance event has an immutable,
  reviewable record. Requiring a fresh, undifferentiated owner review of that
  PR is not meaningfully different from asking the owner to notarize their own
  signature twice.
- `yukh-projects#150` defines an MCP compound-approval bridge contract. Parts
  of that work are schema/documentation mechanics squarely inside the
  authority already granted by the accepted suite preview (RFC-0005) and the
  accepted Projects v1.7.0 contracts; other parts (trust-root selection,
  credential handling semantics) plainly are not. Treating the whole issue as
  one undifferentiated decision either over-gates the inert mechanics or,
  worse, under-gates the security-relevant parts.
- Editorial and non-semantic maintenance on this site (typo fixes, link
  repair, formatting) currently competes for the same owner attention as
  suite-authority decisions, even though it changes no meaning, no contract,
  and no external state.

Agents and skills (including this CLI) execute mechanically. They have never
held authority under RFC-0001 through RFC-0005, and this RFC does not change
that. The problem this RFC solves is different: **which already-authorized,
narrowly-scoped, independently-reviewed decisions may be recorded as accepted
by a designated human delegate acting under standing, revocable, auditable
authority — instead of by the owner personally, every time** — and which
decisions must never be delegated at all.

## Non-goals

- This RFC does not delegate any specific decision. No Class B pathway is
  active until explicit owner acceptance, and until a repository separately
  adopts it per the migration steps below.
- This RFC does not authorize any live GitHub mutation, deployment, credential
  creation, infrastructure change, or release.
- This RFC does not change who may move an RFC's *own* status field for a
  *new-authority* RFC — that remains Class C (owner-only) without exception.
- This RFC does not create a standing delegate role by default; it defines the
  role and its constraints so a repository may name a delegate later, subject
  to the gates in this document.
- This RFC does not replace component-local review, security, or release
  processes; it only concerns whether the *final acceptance act* may be
  performed by a delegate instead of the owner, for specifically bounded
  cases.

## Decision

### Class definitions

Every cross-suite or repository-governance decision is classified before it
is proposed, and the classification is recorded in the governing issue.
Reclassification upward (toward stricter) is always permitted at any time by
anyone; reclassification downward (toward looser) requires the same authority
that would be needed to accept the loosened class.

#### Class A — editorial / non-semantic maintenance

Eligible for **automated merge after checks**, with no human acceptance event
required per change, subject to standing branch protection and required
status checks.

In scope only when **all** hold:

- the change alters no meaning: no code semantics, no contract, no schema, no
  RFC status, no authority statement, no security control, no numeric
  threshold, no external link target that changes what it resolves to;
- the change is limited to prose correction (spelling, grammar, formatting),
  dead-link repair to the same referent, whitespace/lint conformance, or
  mechanical rename that a passing test suite verifies is behavior-preserving;
- all required CI checks (build, test, lint) pass on the exact proposed
  commit;
- the change carries no new top-level directory, no new dependency, and no
  change to `AGENTS.md`, `docs/rfcs/`, or any file this policy or an accepted
  RFC designates as governance-bearing.

Any doubt about whether a change is non-semantic moves it to Class B or C.

#### Class B — governance-only / inert decisions within already-Accepted authority

Eligible for **delegated acceptance** — acceptance recorded by a named human
delegate acting under this policy — but **only** when every one of the
following is independently evidenced in the governing issue before
acceptance:

1. **Strictly within already-Accepted authority.** The decision creates no
   new authority, changes no accepted RFC's meaning, and does not itself move
   an RFC that establishes new authority to Accepted. It may record,
   cross-reference, or make immutable something the human owner has already
   explicitly and unambiguously authorized (for example: an already-given
   verbal or written owner acceptance that a separate PR exists only to make
   an auditable, versioned record of).
2. **Independent review.** At least one reviewer who is not the change's
   author and not the delegate performing acceptance has reviewed the exact
   proposed diff and confirms it matches its stated scope.
3. **All required checks green.** Every CI/status check required by the
   target repository's branch protection passes on the exact commit being
   accepted — no override, no admin merge, no skipped check.
4. **No unresolved conflict with accepted records.** The change does not
   contradict, narrow, widen, or reinterpret any Accepted RFC, any other
   repository's authoritative record, or any open unresolved decision listed
   in an Accepted RFC.
5. **Exact scope and evidence.** The governing issue states the exact
   artifact(s) changed, the exact prior owner authorization being recorded
   (with a link/quote), and the exact commit SHA being accepted. Vague or
   paraphrased scope disqualifies the decision from Class B.
6. **Author/decider separation.** The person or process that authored the
   change is never the same identity as the delegate recording acceptance for
   that change. A single actor cannot both propose and delegate-accept.

If any condition cannot be evidenced, the decision **fails closed** to Class C
(human-owner-only) — it is never partially delegated.

Class B never applies to the decision that first moves an RFC establishing
*new* authority to Accepted; it only applies to decisions *inside* authority
an RFC already has.

#### Class C — human-owner-only, always

The following are **never** delegable, with no exception this RFC can create:

- establishing new authority, or superseding/reinterpreting existing accepted
  operation semantics (for example, changing which operation realizes which
  effect in an accepted mission thread);
- any external or live effect: a real GitHub mutation, a real Project apply,
  workflow dispatch, deployment, or any action with an observable side effect
  outside version-controlled text;
- credentials, OIDC assertions, trust-root selection, or any change to how
  identity is verified or materialized;
- provider registration, network access grants, or any new outbound
  capability;
- infrastructure changes or anything with a spend implication;
- deployment, release publication, tag movement, or any readiness/maturity
  claim;
- destructive restore, rollback that discards evidence, or any operation that
  cannot be undone from immutable records;
- privacy, legal, or data-boundary changes (what is collected, retained,
  disclosed, or who can see it);
- **exceptions to this policy itself** — no delegate may grant an exception;
  only the human owner can.

A decision that is ambiguous between B and C is Class C. A decision partially
matching Class C criteria is wholly Class C.

### Authority source

Agents, skills, and this CLI are **mechanisms**, not authority. Running an
agent, invoking a skill, or completing a tool call never itself constitutes
review, acceptance, or delegation. Authority to accept a Class B decision
comes from two things together, both required:

1. this accepted policy (RFC status = Accepted, unrevoked, unexpired, correct
   version); and
2. authenticated, verifiable GitHub evidence — a signed commit or a GitHub
   account's authenticated action (review approval, merge, issue comment) —
   attributable to the specific named delegate identity this policy or its
   adopting record designates, on the exact repository and decision in
   question.

Evidence produced by an agent transcript, a private log, or an unauthenticated
claim is not sufficient under either prong.

### Delegate identity and role

- A delegate is a specific named human GitHub identity (never a bot, service
  account, agent, or team alias), explicitly designated by the human owner in
  a record this policy or a repository's adopting record names.
- A delegate acts only within Class B, only within the repositories that have
  adopted this policy (see Migration), and only while this policy is Accepted,
  unrevoked, and unexpired for that repository.
- A delegate has no authority absent this policy; delegate authority is
  entirely a creature of the accepted policy record and ends the instant that
  record is revoked, superseded, or expires.
- A delegate may never accept a Class B decision where the delegate is also
  the author, proposer, or sole reviewer (conflict-of-interest rule below).

### Conflict of interest

- Author/decider separation (Class B condition 6) is mandatory and
  non-waivable.
- A delegate who authored, materially drafted, or has an undisclosed
  interest in a change must recuse; another delegate (if any) or the owner
  must accept instead.
- If only one delegate exists and a conflict arises, the decision falls to
  the human owner — it does not fall to a relaxed review.
- Any party may flag a suspected conflict in the governing issue; a flagged,
  unresolved conflict blocks delegated acceptance until the owner resolves it.

### Expiration, version pinning, and revocation

- Delegated authority is pinned to this RFC's exact accepted version
  (commit SHA) and to an explicit expiration the accepting record states
  (a repository adopting this policy sets its own expiration; absent one, the
  default is 180 days from adoption).
- A superseding RFC, an expired adoption record, or an unrevoked-but-stale
  delegate roster (no reviewed activity for the adoption record's stated
  staleness window) suspends Class B for that repository until re-affirmed.
- **Emergency stop:** the human owner, or any two independent maintainers
  acting jointly where the owner is unreachable, may revoke Class B delegation
  for any or all repositories immediately by recording revocation in the
  governing issue or a dedicated revocation record. Revocation takes effect on
  record, is retroactive to block any in-flight but not-yet-merged Class B
  acceptance, and requires no acceptance criteria of its own — revocation
  fails open to the stricter (owner-only) state, never the looser one.
- After revocation, resuming delegation requires a fresh explicit owner
  acceptance; it is never automatic.

### Immutable decision record

Every Class B delegated acceptance produces, in the governing issue or pull
request, an immutable record stating: the exact commit SHA accepted, the
delegate identity, the timestamp, the independent reviewer identity, the
exact prior owner authorization being recorded (link/quote), and confirmation
that all Class B conditions were met. This record is never edited after the
fact; a correction requires a new comment, never a rewrite.

### Required evidence and checks

Before any Class B acceptance:

- CI status checks required by the repository's branch protection must show
  green on the exact commit;
- the independent reviewer's approval must be visible on the same commit
  (not a prior, amended, or force-pushed commit);
- the governing issue must state the Class B conditions above have been
  checked, with links to the specific accepted record being invoked.

### Denial semantics

- Absence of any required evidence is a denial of Class B eligibility, not a
  pending state to be resolved by proceeding anyway.
- A denied Class B decision does not retry automatically at a looser
  standard; it either waits for the missing evidence or is escalated to the
  human owner as Class C.
- No workflow, agent, or skill may reclassify a denied decision to Class A or
  B to avoid the owner gate.
- Silence, timeout, or an agent's own assessment of "probably fine" is never
  evidence; only authenticated GitHub artifacts count.

## Examples applying this policy to the current suite preview

These illustrate classification only. Suite-level acceptance of this RFC does
not by itself authorize any of them; Class B examples remain owner-only until
the specific repository completes its own owner-accepted adoption record per
Migration below.

| Decision | Class | Why |
| --- | --- | --- |
| Merging the separate governance-only Accepted-status record in `yukh-coordination#195`/RFC-0025, which only makes the owner's already-given "Accetto tutti e tre" acceptance an immutable, versioned record | **B** | No new authority; the owner already gave exact acceptance verbally/in writing. A delegate may record it only after independent review confirms the PR's diff matches exactly what was accepted, checks pass, and the delegate did not author it. |
| The schema/documentation mechanics of `yukh-projects#150`'s cross-binding artifact definition (versioned schema shape, field names, docs) | **Potentially B** | Mechanics strictly inside already-accepted Projects v1.7.0 and RFC-0005 authority may qualify if independently reviewed and non-conflicting; anything in the same issue touching trust-root selection, credential handling, or subject/principal semantics is Class C and must be separated out, never bundled into a single Class B acceptance. |
| A proposal to change which Projects operation realizes Effect A vs. Effect B (for example, superseding the accepted `set_field_value`/`add_dependency` split in the first-usable-preview contract) | **C** | This changes accepted operation semantics and authority-bearing bindings from RFC-0005; it is never delegable regardless of how mechanical the diff looks. |
| Any implementation step that provisions the sandbox, materializes credentials, registers a provider, or performs a live Project apply or MCP capability execution | **C** | External/live effect, credentials, and provider registration are all independently sufficient to make this Class C. |

## Repository ownership

| Repository | Responsibility under this policy |
| --- | --- |
| `nomed.github.io` | This RFC, its governing issue, the RFC index, and the suite-level policy text. It does not itself name delegates for other repositories. |
| `yukh-projects`, `yukh-mcp`, `yukh-coordination`, `yukh` | Each repository decides independently whether to adopt this policy (Migration below), names its own delegate(s) if any, and applies the class definitions to its own governance decisions. Adoption in one repository does not adopt it in another. |

Component-local security, release, and threat-model authority remain entirely
with each component repository, unaffected by this RFC.

## Compatibility and security consequences

- **Compatibility:** This RFC changes no code, contract, schema, or runtime
  behavior. It is a governance-process document only.
- **Security:** The policy is designed to fail closed — any missing evidence,
  any ambiguity, any conflict of interest routes to the stricter class, never
  the looser one. No credential, trust-root, provider, or live-effect decision
  is ever eligible for delegation under any circumstance this RFC creates.
  The immutable decision record and required independent review are intended
  to make any misuse detectable after the fact even though this RFC does not
  itself implement automated enforcement tooling.
- **Residual risk:** A delegate could misjudge Class A/B eligibility. This is
  mitigated by (a) fail-closed defaults, (b) mandatory independent review
  separate from the delegate, (c) an immutable record enabling after-the-fact
  audit, and (d) revocation that requires no justification and takes effect
  immediately. It is not mitigated by any automated policy engine; none is
  proposed here.

## Migration

Adoption is per-repository and explicit; this RFC being accepted at the
suite level does not itself activate delegation anywhere.

1. **Suite acceptance.** The human owner explicitly accepts this RFC
   (see Acceptance record below). This alone activates nothing beyond making
   the policy text authoritative and available for adoption — accepted on
   2026-08-09 per the Acceptance record below.
2. **Repository adoption.** A repository that wants to use Class B delegation
   opens its own governance record (an issue and, if it changes repository
   files, a PR) that: names the exact delegate(s) by GitHub identity, states
   the expiration date (default 180 days if unstated), states any
   repository-specific narrowing of Class A/B/C (a repository may narrow,
   never widen, the classes defined here), and is itself accepted by the
   human owner — adoption of delegation is always Class C.
3. **Effective date.** Class B delegation is live for that repository only
   from the moment its adoption record is merged with owner acceptance
   recorded, until its stated expiration or revocation.
4. **Re-adoption.** After expiration or revocation, a repository repeats step
   2 in full; no partial renewal.

## Rollback

- Before this RFC was accepted, rollback would have been simply declining it.
  That gate has passed: the policy text is now accepted, but every
  operational effect described below still requires a repository's own
  separate adoption.
- After acceptance but before any repository adopts it (the current state):
  the policy exists as accepted text with zero operational effect;
  withdrawing it is a superseding RFC.
- After a repository adopts delegation: revocation (Emergency stop, above)
  immediately returns that repository to human-owner-only for all future
  decisions; it does not retroactively invalidate already-recorded Class B
  acceptances, which remain part of the immutable history, but it does block
  any acceptance not yet finalized at the moment of revocation.
- Rollback never reuses a delegate designation, adoption record, or
  acceptance across a revoked and later re-adopted period; re-adoption always
  starts a fresh record.

## Completion evidence

This RFC is implemented only when:

- the RFC exists on `main` in `docs/rfcs/` with correct numbering and index
  entry;
- the governing issue documents the review and (if applicable) the owner's
  acceptance statement verbatim;
- no repository claims Class B delegation is active without its own
  separately accepted adoption record;
- existing site checks (build, test, lint) pass unchanged, since this RFC
  alters no application code.

## Unresolved decisions

1. Whether a repository may name more than one delegate, and if so, whether
   they may accept for each other's authored changes (this RFC assumes yes,
   subject to the conflict-of-interest rule, but does not mandate a specific
   roster size).
2. Whether Class A automated merge requires a second, non-delegate automated
   check (e.g., a link-integrity bot) beyond the repository's existing CI, or
   whether existing CI is sufficient evidence of non-semantic scope. Left to
   each repository's adoption record.
3. Whether a standard, machine-readable adoption-record schema should be
   defined in a follow-up RFC so tooling can verify Class B eligibility
   automatically, rather than by manual issue text as specified here.
4. The default expiration window (180 days) is a placeholder; the owner may
   set a different suite-wide default at acceptance time.

These do not permit any implementation to widen delegated authority beyond
what is explicitly defined above.

## Acceptance record

The owner accepted this RFC on 2026-08-09. After being presented with the
exact acceptance statement and its consequences — that suite-level acceptance
activates no Class B delegation in any repository by itself, and that each
repository must separately complete its own owner-accepted adoption record
before Class B applies there — the owner replied "procedi", relayed via
cross-session coordination from the "Stato progetto yulh" session. This is
recorded as explicit acceptance of RFC-0006 as written, on those terms.

Acceptance makes this policy's class taxonomy, delegate mechanics, evidence
requirements, revocation, and audit rules authoritative text. It does not:

- activate Class B delegation in `nomed.github.io`, `yukh-projects`,
  `yukh-mcp`, `yukh-coordination`, or `yukh` — each still requires its own
  separate owner-accepted adoption record per Migration;
- authorize any Class C decision — no new authority, live/external effect,
  credential, provider registration, infrastructure change, deployment,
  release, destructive restore, or privacy/legal/data-boundary change is
  authorized by this acceptance; and
- supersede or reinterpret RFC-0001 through RFC-0005, which remain
  independently authoritative within their own scope.

## Superseded

This RFC was superseded in full on 2026-08-09 by
[RFC-0007 — Autonomous maintainer mandate: session-separated delegation and bounded execution](RFC-0007-autonomous-maintainer-mandate.md),
which the owner accepted on the same date via cross-session coordination from
the "Stato progetto yulh" session. The named-human-delegate Class B mechanic
and the per-repository Migration adoption bootstrap above are replaced by
RFC-0007's session-role separation and self-activating suite-wide migration;
Class A, the exhaustive Class C philosophy, the immutable decision record, and
the fail-closed denial semantics carry forward under RFC-0007 rather than
this record. The text above remains the historical record of what was
accepted and why; it is no longer authoritative. See RFC-0007's own
Acceptance record for the exact owner statement that accepted RFC-0007 and,
in the same act, superseded this RFC.
