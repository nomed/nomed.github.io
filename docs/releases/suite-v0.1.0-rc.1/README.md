# Yukh suite `v0.1.0-rc.1` draft release plan

- **State:** Draft plan and local synthetic evidence only
- **Planned Git tag:** `suite-v0.1.0-rc.1` (not created)
- **Qualified host:** `nomed/nomed.github.io@d957a95b5d4eb90e50d72987937394ffee72300b`
- **Governing decision:** [RFC-0005](../../rfcs/RFC-0005-first-usable-yukh-preview.md)

This record reserves a technical release-candidate identity for review. It is
not a release, publication, deployment, live-provider qualification, component
version, production-readiness claim, or authorization for any of those actions.
The eventual tag target is intentionally unset until this governance change is
reviewed and merged.

## Exact candidate pins

| Repository | Commit |
| --- | --- |
| `nomed/nomed.github.io` | `d957a95b5d4eb90e50d72987937394ffee72300b` |
| `nomed/yukh-projects` | `9b0a4e252e179e24d70b308e3f0b8853e78881c0` |
| `nomed/yukh-mcp` | `dbec60834148ea8086582e1c60bbf3c19c14eb00` |
| `nomed/yukh-coordination` | `b8d59340427c959560a55e80dc3612bd804bb54e` |

These are source commits, not new component releases. No component tag or
version is created, moved, or implied by the suite candidate.

## Qualification evidence

One clean, same-host, local synthetic run passed on 2026-08-11:

| Component | Result | Time |
| --- | --- | ---: |
| Site | PASS, clean | 13.626 s |
| Projects | PASS, clean | 4.584 s |
| MCP | PASS, clean | 2.965 s |
| Coordination | PASS, clean | 15.920 s |
| **Suite** | **4/4 PASS** | **39.675 s** |

The runner-produced JSON summary has SHA-256
`aee3e330afb485c6c14e07136551f244a940d82536960ed94c0633221614d708`;
the complete local log has SHA-256
`c6f74052c8c3a04935fa28d391e070d0b08e87a3c3e0e88a1f4f16df8d5c870c`.
The normalized, path-free evidence is
[`suite-v0.1.0-rc.1-qualification.json`](suite-v0.1.0-rc.1-qualification.json).
The raw files are not published
because the runner summary records workstation paths.

This is evidence for the local synthetic profile only. It is not a second
independent reproduction and does not demonstrate live GitHub, provider,
credential, deployment, restore, or production behavior.

## Gate 4 release plan

If and only if RFC-0005 Gate 4 is later accepted, a human-authorized draft
release would:

1. tag the reviewed merge commit descended from the qualified host as
   `suite-v0.1.0-rc.1`;
2. attach exactly `suite-v0.1.0-rc.1-manifest.json`,
   `suite-v0.1.0-rc.1-qualification.json`, and
   `suite-v0.1.0-rc.1-SHA256SUMS`;
3. verify both payloads against
   [`suite-v0.1.0-rc.1-SHA256SUMS`](suite-v0.1.0-rc.1-SHA256SUMS) before
   keeping the draft; and
4. remain a draft until a separate publication decision.

The two JSON files in this directory are the review sources for the
correspondingly named assets. No binary artifact, SBOM, or provenance claim is
made because this suite record packages only source pins and evidence metadata;
component release artifacts remain owned by their repositories.

### Rollback

Before tag creation, rollback is to close the proposal and delete any unsubmitted
draft; no repository state or component pin changes. After an authorized tag but
before publication, delete the draft and the new suite tag only if it has not
been consumed, then record the withdrawal. After publication, never move or
reuse the tag: mark the candidate withdrawn, retain its evidence, remove any
gold-path link, and prepare a new candidate identity. No rollback authorizes
live mutation; synthetic target restoration requires a new reviewed plan.

## Gate accounting and blockers

No RFC-0005 delivery gate is newly declared satisfied by this record.

- **Gates 1–3:** the accepted RFC and component records remain authoritative;
  this evidence record does not reassess or upgrade them.
- **Gate 4:** **pending**. The single local run does not establish the full
  mission thread, independent receipt/audit verification, an intervention-free
  operator/restore exercise, risk acceptance, or the required second clean
  reproduction by an independent verifier.
- **Release action:** **pending**. The exact tag target cannot exist until this
  record is reviewed and merged, and human Gate 4 acceptance is absent.

The second reproduction must be performed from a clean environment by a
separately identified verifier. Re-running on this host or relabeling the run
above cannot satisfy it.

## Unresolved production and live limitations

- all effects are local, hermetic, synthetic, and test-owned;
- no live GitHub repository or Project, provider, credential materializer,
  JetStream deployment, backup provider, lifecycle worker, Matrix bridge, or
  Kubernetes resource was exercised;
- live Effect A and Effect B approvals, mutations, verification, audit chains,
  teardown, and restore remain unproven;
- availability, support, hardened multi-tenancy, federation, multi-region
  operation, disaster recovery, and production security remain out of scope;
- no preview publication, deployment, component release, or production use is
  authorized.
