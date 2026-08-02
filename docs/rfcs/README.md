# Yukh suite RFCs

This directory contains durable proposals and accepted decisions that affect more than one Yukh repository.

Component-local architecture remains governed by the records in the owning repository. A suite RFC coordinates ownership and compatibility; it does not silently override a component's security model or authorize a mutation.

## Lifecycle

RFCs use one of these states:

- **Proposed** — open for review and not authoritative;
- **Accepted** — explicitly approved by the human owner and authoritative within its scope;
- **Rejected** — considered and declined;
- **Superseded** — replaced by a later accepted RFC.

Only the human owner may move an RFC to Accepted. Accepted RFCs are immutable except for corrections that do not alter meaning; material changes require a superseding RFC.

## Required sections

Each RFC records:

- status, date, owner, and governing issue;
- context and scope;
- decisions and unresolved questions;
- repository ownership;
- compatibility and security consequences;
- migration phases, gates, rollback, and completion evidence.

RFCs never contain credentials, private data, sensitive infrastructure identifiers, private reasoning, or copied operational logs.

## Accepted records

- [RFC-0001 — Yukh suite topology, ownership, and portfolio schema](RFC-0001-yukh-suite-topology-and-portfolio-schema.md)
- [RFC-0002 — Confidential consumer migration inventory](RFC-0002-confidential-consumer-migration-inventory.md)

## Proposed records

- [RFC-0003 — Nomed Agentic Development Framework](RFC-0003-nomed-agentic-development-framework.md)
