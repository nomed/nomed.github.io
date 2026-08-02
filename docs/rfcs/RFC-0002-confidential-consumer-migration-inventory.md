# RFC-0002 — Confidential consumer migration inventory

- **Status:** Accepted
- **Date:** 2026-08-02
- **Accepted:** 2026-08-02 by `@nomed`
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#7](https://github.com/nomed/nomed.github.io/issues/7)
- **Supersedes:** the named consumer inventory and publication model in RFC-0001

## Decision

Suite RFCs define compatibility obligations, migration gates, support windows, rollback requirements, and aggregate completion criteria. They do not enumerate consumer repositories.

The concrete legacy-consumer inventory is operational, changeable, and potentially confidential. It MUST remain outside public repositories, public issues, public Projects, release notes, and public RFCs. Access is limited to people and agents explicitly authorized to perform or verify the migration.

## Preserved requirements

This RFC does not alter the topology, authority boundaries, clean-room migration phases, compatibility gates, rollback requirements, or accepted minimum 90-day transition window in RFC-0001.

Before legacy archival:

1. every known consumer MUST be inventoried in the restricted operational register;
2. every consumer MUST migrate through a reviewed change or explicitly accept the remaining risk;
3. each migration MUST preserve an immutable rollback pin and record dry-run and verification evidence;
4. public reporting MUST be aggregate and MUST NOT reveal consumer identity, pin, sequencing, ownership, or private evidence.

## Operational register

The restricted register records, at minimum:

- an internal consumer identifier;
- current immutable pin and usage mode;
- compatibility and dry-run status;
- migration status and accountable owner;
- rollback pin and verification evidence;
- accepted exception, when applicable.

The register is not an architectural record and may change without amending this RFC. It MUST NOT be committed to a public repository.

## Security and compatibility consequences

- Migration planning does not disclose private repository relationships or delivery sequencing.
- The absence of names from public records does not weaken migration or archival gates.
- Aggregate claims remain untrusted until checked against the restricted evidence register.
- Credentials, logs, private URLs, and raw workflow output remain excluded from the register unless stored in an approved secret or evidence system.

## Immediate effect

- RFC-0001 remains authoritative except for its named inventory and inventory-publication model.
- Future public records use aggregate language such as “all known consumers.”
- Consumer migrations proceed privately when the compatible `yukh-projects` release and per-consumer gates are satisfied.
