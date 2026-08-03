# RFC-0004 — Yukh documentation architecture

- **Status:** Accepted
- **Date:** 2026-08-03
- **Accepted:** 2026-08-03 by `@nomed`
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#32](https://github.com/nomed/nomed.github.io/issues/32)
- **Affected repositories:** `nomed.github.io`, `yukh-mcp`, `yukh-projects`, `yukh-coordination`, `yukh`

## Summary

Yukh documentation will use one suite-level discovery surface and component-owned technical documentation.

`nomed.github.io` owns the public thesis, suite architecture, component boundaries, maturity reporting, cross-suite governance, and routes that help a reader choose the correct component. Each component repository owns its tutorials, task guides, reference, explanations, security guidance, operations, release compatibility, and migration guidance.

Component documentation will follow a shared Diátaxis information architecture without requiring one documentation generator or a shared deployment runtime. Dedicated documentation sites are component documentation surfaces, not separate marketing sites. They may be published below stable project paths on `nomed.github.io` when the component has enough material to justify navigation and search.

## Context

The public site already explains MCP, Projects, and Coordination as bounded parts of one system. Technical material has grown independently:

- Yukh MCP publishes an MkDocs site at `/yukh-mcp/`;
- Yukh Projects owns accepted contracts, security records, release operations, and migration records in its repository;
- Yukh Coordination owns its protocol, conformance corpus, runtime decisions, and reference implementation;
- the original `yukh` repository remains a compatibility implementation with its own installation and release guidance.

Copying those instructions into the suite site would create competing sources of truth. Leaving all material as an undifferentiated repository tree would make adoption and task completion unnecessarily difficult. A common ownership and navigation model is needed before adding more public documentation surfaces.

## Goals

- make it clear where readers discover the suite and where they complete component tasks;
- keep technical claims with the repository that can validate and release them;
- provide predictable tutorial, how-to, reference, and explanation paths;
- state maturity without turning documentation polish into a readiness claim;
- keep installation, upgrade, rollback, removal, and migration instructions version-aware;
- allow each component to choose tooling appropriate to its implementation;
- establish stable public paths without creating parallel marketing sites.

## Non-goals

- selecting one static-site generator for every repository;
- creating a monorepo for documentation;
- moving component ADRs, RFCs, contracts, security records, or migration guides into `nomed.github.io`;
- declaring any component production-ready;
- publishing an installation tutorial for software that has no supported public distribution;
- versioning every page before incompatible supported releases exist;
- changing component authority, release policy, or security boundaries.

## Decision

### One suite surface

`nomed.github.io` is the suite-level public and editorial surface. It owns:

- the Nomed position and Yukh system narrative;
- the map of component responsibilities and authority boundaries;
- current maturity summaries sourced from component-owned records;
- cross-suite architecture and accepted suite RFCs;
- a reader path from problem or use case to the correct component;
- links to canonical component documentation and repositories.

It does not own component installation, configuration, operations, API reference, release notes, troubleshooting, or migrations. A suite page may summarize those capabilities, but it must link to the owning repository rather than reproduce instructions.

### Component-owned documentation

Each component repository owns documentation that must change with its code, contracts, releases, or threat model. This includes:

- installation, prerequisites, authentication, and least-privilege configuration;
- tutorials and runnable examples;
- operational, upgrade, rollback, removal, and troubleshooting guides;
- CLI, Action, API, schema, protocol, error, and compatibility reference;
- architecture and conceptual explanation;
- security model, threat model, and disclosure guidance;
- migration guides and compatibility transitions.

Migration documentation always remains in the repository that owns the destination behavior. Cross-suite pages may announce or link to a migration but do not duplicate its steps. The legacy `yukh` repository retains guidance for its supported compatibility implementation; migration to Yukh Projects is owned by `yukh-projects`.

### Shared Diátaxis information architecture

When a component has enough material for a documentation navigation, it uses these top-level reader intents:

| Section | Reader intent | Required character |
| --- | --- | --- |
| Tutorials | Learn by completing a bounded first outcome | Reproducible, safe by default, explicit about maturity |
| How-to guides | Complete a specific task | Goal-oriented prerequisites, verification, rollback or removal where relevant |
| Reference | Look up an exact contract | Complete, versioned with the implementation, generated only when generation is authoritative |
| Explanation | Understand why the system works this way | Architecture, trust boundaries, concepts, and decision links |

Security is a cross-cutting responsibility, not a fifth Diátaxis mode. Security material may have a prominent navigation section, while individual tutorials and guides still state their relevant permissions, trust assumptions, and failure behavior.

Repositories may use names such as `Guides` or `Concepts` when clearer for their audience, provided the four reader intents remain discoverable and material is not duplicated across categories.

### Publication paths

The preferred public topology is:

```text
https://nomed.github.io/                    suite narrative and governance
https://nomed.github.io/yukh-mcp/           MCP technical documentation
https://nomed.github.io/yukh-projects/      Projects technical documentation, when qualified
https://nomed.github.io/yukh-coordination/  Coordination technical documentation, when qualified
```

These paths are documentation endpoints for repositories, not independent product identities. Every component surface links back to the Yukh system overview and to its canonical repository. The suite surface links directly to the canonical documentation landing page.

The original `yukh` compatibility implementation does not receive a new dedicated site by default. Its repository documentation remains canonical until a demonstrated maintenance or adoption need justifies a published documentation surface.

### Qualification gates

A component may publish explanation and reference material before it is installable, provided the landing page states that limitation prominently.

A public installation or operational tutorial requires all of the following:

1. a supported public artifact, executable, Action, package, or protocol implementation exists;
2. the documented path is exercised by CI or equivalent repeatable evidence;
3. prerequisites and minimum permissions are explicit;
4. success has observable postconditions;
5. rollback or removal is documented;
6. maturity and unsupported scenarios are stated without inference from version numbers.

A dedicated site is justified when repository documentation needs persistent navigation or search across more than one reader intent. A README and linked source documents remain preferable while a component lacks that need.

No site publication alone advances component maturity.

### Version and compatibility policy

- Documentation on a component's default landing page describes its latest supported public release or explicitly states that it describes unreleased foundation work.
- Code samples use an immutable release, full semantic version, or commit pin when reproducibility or supply-chain integrity requires it.
- A page identifies the contract, protocol, CLI, Action, or schema version it describes when ambiguity is possible.
- Multiple versioned documentation trees are introduced only when incompatible releases remain supported concurrently.
- Removed or superseded guidance remains reachable through release records or repository history; it is not silently rewritten as if it had always described the new behavior.
- The suite site reports maturity and directs readers to the current component landing page. It does not maintain version-specific technical instructions.

### Navigation and visual consistency

All component documentation surfaces provide:

- a clear component name and maturity statement;
- a link to the Yukh system overview;
- a link to the canonical repository;
- visible documentation version or unreleased status when relevant;
- local search when the corpus is large enough to need it;
- accessible navigation and code samples.

Shared typography, marks, colors, and navigation language are desirable, but no runtime package or coupled theme is required by this RFC. A shared theme becomes a separate implementation decision only after at least two component sites demonstrate stable common requirements.

## Repository ownership

| Repository | Documentation authority |
| --- | --- |
| `nomed.github.io` | Suite narrative, discovery, maturity summaries, cross-suite architecture and governance |
| `yukh-mcp` | MCP contracts, gateway architecture, security, tutorials, operations, and provider guidance |
| `yukh-projects` | Projects contracts, Action and CLI use, operations, installation, and migration from legacy implementations |
| `yukh-coordination` | Protocol, conformance, relay and client reference, deployment profiles, and operational guidance |
| `yukh` | Installation, release, rollback, and compatibility guidance for the original reconciler while supported |

Component-local governance determines review and release requirements for its documentation. A cross-suite link or taxonomy change does not authorize component implementation.

## Compatibility impact

Existing repository links and source documents remain valid. The existing `/yukh-mcp/` publication becomes the first conforming component surface, subject to incremental navigation and maturity review.

Adding `/yukh-projects/` or `/yukh-coordination/` is additive. Existing suite routes under `/system/*` remain stable and become discovery pages rather than technical manuals. No consumer integration or public contract changes because of this RFC.

Renames of stable documentation paths require redirects and a component-owned compatibility note.

## Security impact

Documentation is part of the security boundary because it shapes credential handling and operator behavior.

- No documentation may contain secrets, live tokens, private repository data, sensitive infrastructure identifiers, or reusable privileged examples.
- Installation and operational guides use the minimum practical permissions and distinguish read-only, dry-run, approval, and apply paths.
- Examples use synthetic identifiers and non-production targets.
- Mutating guides state preconditions, expected effects, verification, and rollback or removal.
- Generated reference is published only from reviewed source and must not ingest untrusted runtime output without sanitization.
- External links and copied commands are treated as supply-chain inputs and reviewed accordingly.
- Security disclosure instructions remain component-owned and prominently reachable.

No credential, deployment, repository setting, Pages configuration, or publishing permission is authorized merely by accepting this RFC.

## Migration and rollout

### Phase 1 — Suite correction

- align public maturity summaries with component-owned records;
- add canonical documentation links to component deep dives;
- retain existing suite routes and editorial hierarchy.

**Gate:** rendered site tests and publication build pass; each claim has an owning repository source.

### Phase 2 — MCP baseline

- map the existing MCP navigation to the four reader intents;
- add explicit unreleased/foundation and installability language;
- record the minimum common navigation and metadata actually needed.

**Gate:** the existing documentation build and links pass; no operational capability is implied by the read-only demo or inert runtime.

### Phase 3 — Projects adoption documentation

- create component-owned installation and first dry-run tutorial only when the supported adoption gate is satisfied;
- organize existing contracts, security, release operations, and migration material under the common reader intents;
- publish `/yukh-projects/` when navigation and search provide material value over the repository tree.

**Gate:** the documented adoption path is repeatable, least-privilege, verifiable, and removable. Migration steps remain in `yukh-projects`.

### Phase 4 — Coordination protocol documentation

- organize protocol, conformance, architecture, and security reference;
- publish explanation and reference with an explicit non-production banner when useful;
- publish an installation tutorial only after a secure public process and provider profile satisfy the qualification gates.

**Gate:** public distribution and the documented multi-session path exist and are independently reproducible.

### Phase 5 — Common shell evaluation

After at least two component sites operate under this model, compare their stable needs. Propose shared theme or navigation code only when it removes demonstrated duplication without coupling releases.

**Gate:** a separate reviewed implementation proposal defines ownership, versioning, rollout, and rollback for shared code.

## Rollback

Before component sites are published, rollback consists of declining this proposal; current repository documentation remains authoritative.

After publication:

- a component may replace a broken documentation deployment with its last verified build;
- the suite site may temporarily link directly to repository documentation;
- stable public paths should redirect rather than disappear;
- no rollback moves component technical content into `nomed.github.io` as a second source of truth.

If the shared taxonomy proves confusing, component navigation may revert independently while ownership and canonical links remain intact. Superseding the ownership model requires a later suite RFC.

## Completion evidence

This decision is fully implemented when:

- every suite component page links to an identified canonical documentation landing page;
- every component declares its documentation maturity and supported distribution status;
- component navigation makes the four reader intents discoverable where applicable;
- installation and migration guidance exists only in owning repositories;
- published component sites pass their own link, build, and accessibility checks;
- no suite page duplicates version-sensitive operational instructions.

## Unresolved decisions

1. Whether Projects and Coordination should use MkDocs Material or another repository-local generator.
2. Whether concurrently supported incompatible releases will require `/vN/` paths or a version selector.
3. The exact evidence threshold at which the Projects repository tree should become a published site.
4. Whether Coordination reference material should be published before a supported public process exists.
5. Whether stable common visual requirements justify a shared theme after the second component site.

These decisions do not change the ownership boundary established here. Each requires evidence from the owning component and, where it affects more than one repository, a reviewed suite-level decision.
