# Track C2 — OpenViking shared-context qualification

Governed by #63 and executable slice #77.

Pinned candidate:

- `volcengine/OpenViking@234a2d9fe778a9512fd7ebe9807198e847c647ec`

## Strategy

OpenViking is tested first as a possible single external shared-context substrate. This is an elimination-tree qualification, not a feature contest.

If OpenViking can cover canonical context projections, resources/code, skills-as-proposals and shared memory while preserving Yukh authority boundaries, the intended result is `OPENVIKING_ALONE` and no memory specialist is added merely for completeness.

## OV-1 — public substrate seam

OV-1 is a pinned documentary/public-contract preflight. It verifies that the candidate exposes supported public surfaces for the later executable fixture without requiring private database mutation or candidate patching.

At the pinned revision the expected public boundary includes:

- standalone HTTP service;
- lightweight `openviking-sdk` HTTP client;
- API-key authentication;
- account/user-bound clients and request-scoped actor-peer views;
- resource ingestion (`add_resource`);
- virtual filesystem navigation (`ls`, `tree`, `read`);
- retrieval (`find`/`search`);
- sessions and explicit/automatic memory commit;
- public admin account/user creation for synthetic ACL fixtures;
- CLI and MCP/agent integration surfaces.

The pin is AGPLv3. The OSS repository states that the open-source edition is not feature-gated, while commercial/self-managed editions add operations/support/distributed deployment. Team/permission semantics must still be qualified from the actual OSS profile rather than inferred from commercial claims.

## Canonical boundary

Reviewed ADR/RFC/Golden-Path-like fixtures remain canonical versioned artifacts outside OpenViking. OpenViking may ingest/index/navigate them as runtime context projection only.

Context classes used by Yukh evidence are conceptual and candidate-neutral:

- `canonical` — projection of a reviewed source artifact;
- `derived` — summary/graph/retrieval-derived context;
- `remembered` — learned/session memory;
- `proposed` — generated/learned Skill or practice not yet accepted.

OpenViking state is never Yukh authority, accepted state, evidence truth, capability authority, coordination ownership or Golden Path acceptance authority.

## Next slice

OV-1 PASS only authorizes implementation of the synthetic public-API fixture. It is not an adoption verdict and does not prove ACL/revocation, stale-memory behavior, outage correctness or `OPENVIKING_ALONE`.