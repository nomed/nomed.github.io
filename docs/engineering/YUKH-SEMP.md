# Yukh systems engineering management plan

- **Status:** Working method
- **Owner:** `@nomed`
- **Applies to:** cross-suite work spanning two or more Yukh repositories
- **Governing architecture:** [RFC-0003](../rfcs/RFC-0003-yukh-reference-architecture-and-minimum-runtime.md)

## Purpose

This lightweight SEMP defines how Yukh turns a system hypothesis into reviewed contracts, running code, and independently checkable evidence. It is tailored from the system-lifecycle concerns in ISO/IEC/IEEE 15288 and the event-based technical reviews described by the NASA Systems Engineering Handbook. It is not a substitute for component-local contribution, security, or release policy.

The method optimizes for one property: decisions that affect multiple agents, providers, repositories, or authority boundaries must survive outside the session that proposed them.

## Operating principles

1. **Mission before mechanism.** Begin with an observable end-to-end outcome and its failure conditions, not a broker or framework.
2. **Authority before integration.** Identify which component may communicate, persist, decide, execute, and accept before connecting them.
3. **Contracts before implementations.** Freeze the minimum schemas, transitions, errors, and evidence needed to compare implementations.
4. **Running slices before platforms.** Prove one thin cross-component flow before expanding a component horizontally.
5. **Evidence before completion.** A successful command or message is not completion; acceptance requires the stated postconditions and evidence.
6. **Reversible technology choices.** Infrastructure stays behind ports until conformance and operational evidence justify a gold path.
7. **No authority by implication.** Delivery, silence, timeout, coordinator recommendation, or broker acknowledgement grants no project or execution authority.

## Durable records

| Record | Location | Purpose |
| --- | --- | --- |
| Cross-suite RFC | `nomed.github.io/docs/rfcs/` | Decisions affecting multiple repositories |
| Component ADR/RFC | Owning component | Local implementation and security decisions |
| Threat model | Owning component; cross-links from suite RFC | Trust boundaries, abuse cases, mitigations |
| Contract and conformance corpus | Owning component | Machine-checkable interoperability truth |
| Session and handoff record | Repository `.context/` when adopted | Bounded context needed to resume work |
| Portfolio state | Yukh GitHub Project | Accepted priority, sequencing, and delivery state |
| Execution evidence | Immutable referenced artifact | Proof of plans, actions, and verification |

Private reasoning, credentials, unrestricted transcripts, and adopter-specific confidential data do not enter these records.

## Increment lifecycle

Every cross-suite increment follows this loop:

```text
mission thread
  -> RFC and authority matrix
  -> threat-model delta
  -> executable contracts and fixtures
  -> reference implementation
  -> distributed adapter
  -> adversarial vertical slice
  -> independent verification
  -> evidence and ADRs
  -> repeatable gold path
```

Stages may overlap, but no later artifact is allowed to silently redefine an earlier authority boundary.

## Technical reviews

Reviews are event-driven gates, not recurring ceremonies.

### Concept review

**Entry:** mission thread, stakeholders, system context, non-goals, and initial risks exist.

**Success:** the outcome is observable; component ownership is unambiguous; rejected alternatives and open questions are recorded.

### Contract review

**Entry:** schemas, transitions, compatibility policy, security boundary, and failure vocabulary exist.

**Success:** at least two independent adapters could implement the contract; conformance fixtures can falsify incorrect behavior; no transport primitive leaks into the public protocol without an explicit decision.

### Test readiness review

**Entry:** reference adapter, adversarial fixtures, evidence plan, rollback, and resource bounds exist.

**Success:** duplicate, reorder, reconnect, partial failure, authorization denial, and concurrency cases have expected deterministic outcomes.

### Operational readiness review

**Entry:** the complete mission thread has run across isolated sessions and the evidence package is available.

**Success:** acceptance criteria pass independently; unresolved risks have owners; operational and rollback instructions are reproducible; maturity claims match the evidence.

## Roles and decision rights

| Role | May | May not |
| --- | --- | --- |
| Human owner | Accept suite RFCs and consequential authority changes | Delegate acceptance implicitly through silence |
| Coordinator participant | Observe, correlate, propose, question, and request review | Grant capabilities, accept project state, or become the sole holder of truth |
| Coordination relay | Authenticate, authorize channel access, validate, append, sequence, receipt, replay | Select a winning claim or convert communication into authority |
| Projects | Plan and reconcile explicitly authorized delivery state | Infer accepted state from coordination messages |
| MCP | Evaluate and execute modeled capabilities under policy | Decide portfolio priority or coordination ownership |
| Verifier | Check declared postconditions and publish evidence | Rewrite the event or action being verified |

## Planning and decomposition

- One governing issue owns each cross-suite increment.
- Component issues own implementation inside their repository and link to the governing issue.
- Work is decomposed by independently verifiable outcome, not by agent or repository alone.
- A claim communicates current intent; it does not reserve work or prevent a concurrent claim.
- Dependencies and accepted status live in the Project; transient progress lives in Coordination.

## Baseline measures

Each vertical slice records:

- conformance cases passed by every adapter;
- deterministic replay digest;
- duplicate and redelivery outcomes;
- conflict and handoff-race outcomes;
- reconnect recovery time and cursor behavior;
- authorization-denial and cross-tenant isolation evidence;
- evidence verification outcomes;
- operator steps and rollback time;
- undocumented manual interventions.

Performance targets are added only when the mission thread establishes a real constraint.

## Tailoring

A component-local change may use a smaller process. Cross-suite work may omit an artifact only when the governing issue explains why its risk is absent. Tailoring cannot waive authority, security, compatibility, or evidence requirements.

## Method references

- [ISO/IEC/IEEE 15288:2023 — system life-cycle processes](https://www.iso.org/standard/81702.html)
- [NASA Systems Engineering Handbook](https://www.nasa.gov/reference/systems-engineering-handbook/)
- [IETF RFC 2026 — Internet Standards Process](https://datatracker.ietf.org/doc/rfc2026/)
- [IETF RFC 7282 — rough consensus and running code](https://datatracker.ietf.org/doc/rfc7282/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
