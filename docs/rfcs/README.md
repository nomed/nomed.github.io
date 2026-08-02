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
