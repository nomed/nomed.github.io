# Track A host qualification conclusion — 2026-08-24

Status: **qualification conclusion**  
Governing issues: #58, #71  
Architecture review: #56  
Authority: RFC-0003 remains authoritative; this record does not change Yukh topology or ownership.

## Decision

**Qualify both goose and Hermes Agent as Yukh-compatible external agent hosts. Do not build or introduce a Yukh-owned agent host. Do not select an exclusive reference host from the current evidence.**

Yukh should define and preserve the host-facing semantic contract and keep the host implementation replaceable. The tested public integration seam is ACP stdio; neither qualification required candidate-specific internal APIs.

This decision is deliberately narrower than product endorsement. It means both pinned candidates can preserve the Yukh-visible contract exercised by Track A. It does not claim feature parity, production readiness for every deployment, or that all future versions remain qualified without revalidation.

## Pinned candidates

- goose: `aaif-goose/goose@bd16fbfbbe78cadc2cc3ce6295691772df51d71f`
- Hermes Agent: `NousResearch/hermes-agent@a0ca7c19204e514f9590ce3b812e029b315ab9e9`

## Evidence chain

### Runtime substrate

Both candidates passed the pinned runtime-substrate gate. The gate exercised candidate-owned ACP/session/approval surfaces without production credentials.

### A2 permission composition

Run `32735522731` passed for both candidates.

Both demonstrated:

- Yukh ALLOW + observed host ALLOW -> effective ALLOW;
- Yukh DENY + observed host ALLOW -> effective DENY enforced by Yukh;
- Yukh ALLOW + observed host DENY -> effective DENY enforced by the host;
- candidate-native permission references;
- provider-local measured controls;
- no native safety bypass;
- no adapter-invented host decision.

Artifacts:

- goose: `9523514750`, `sha256:898d58f3788735a2e79cab90e4ad0a05849e63f715330266d88d0787abc17876`
- Hermes: `9523056961`, `sha256:a903d2f652b979e6381f6f83357a1219d47600a79926d06160c1baf7a7094697`

### Restart/recovery and replaceability

Run `32739604032` passed for both candidates after moving goose cold compilation outside recovery timing.

Both demonstrated:

- initial bounded execution: PASS;
- public ACP native session restore after process restart: PASS;
- fresh-host-session Yukh checkpoint rebind: PASS;
- stable Yukh participant/work correlation across a changed host session ID: PASS;
- host memory/session history remains non-authoritative: PASS;
- neutral recovery evidence: PASS;
- provider-local measured controls: PASS;
- dependency bootstrap excluded from measured controls: PASS;
- support gate: PASS.

Recovery artifacts:

- goose: `9525044468`, `sha256:5e1a88b634e54b2a4fe7ca8968d1bb529e217ff8bce07b80973de89e9fad7925`
- Hermes: `9524618646`, `sha256:8daec51609cc56435c25cc834e5d0144e2620d56c0307c0010d712ea96ccabef`

The Yukh-owned checkpoint used for the replacement proof contains only durable correlation semantics:

- `participant_id`;
- `work_uri`;
- `capability_id`;
- `evidence_run_id`.

A new host session receives those values from the external checkpoint rather than deriving authority from prior host memory. Successful continuation therefore does not depend on preserving a particular host session implementation.

## Adapter and operational facts

| Fact | goose | Hermes Agent |
|---|---|---|
| Public integration seam | ACP stdio | ACP stdio |
| Candidate-specific internal API required | No | No |
| Tested CLI | `goose acp` via built `goose-cli` binary | `hermes acp` |
| Qualification config keys | 6 | 7 |
| Durable host state used for native restore | goose session store under isolated HOME/XDG | `$HERMES_HOME/state.db` |
| Bootstrap observed outside measured controls | Rust toolchain/build required before timing | Tirith may auto-install in dependency preflight |
| External provider dependency in measured controls | No | No |
| Initial measured continuation | 2492 ms | 2974 ms |
| Native restore measured continuation | 1822 ms | 2396 ms |
| Fresh Yukh rebind measured continuation | 1766 ms | 2708 ms |

The elapsed values are observations from one GitHub-hosted qualification run, **not a performance benchmark** and not a ranking criterion. Cold build/install work is deliberately outside the recovery timing where possible.

## Interpretation

### Why both qualify

The decisive boundary is not whether an agent host remembers a session. Both do. The decisive boundary is whether Yukh-visible semantics survive when that memory is discarded and the host session changes. Both candidates passed that test through the same ACP-facing checkpoint model.

Native restore is therefore an operational convenience, not an authority mechanism. Track A happened to observe native restore PASS for both candidates, but Yukh compatibility remains grounded in successful external checkpoint rebind.

### Why there is no exclusive winner

The observed differences are operational rather than semantic:

- goose carries a heavier Rust build/bootstrap cost in qualification, while its measured post-build process restart was somewhat faster;
- Hermes has a direct installed CLI and explicit SQLite-backed ACP session persistence, while optional Tirith bootstrap must be accounted for before measured controls;
- both required only ACP stdio for the Yukh-facing integration;
- neither required a candidate-specific private API or a Yukh-owned runtime patch.

The current evidence does not justify turning those differences into an exclusive architectural dependency.

## Architecture consequence

Yukh should treat **agent host** as replaceable machinery behind a compatibility profile, not as a Yukh component that needs its own runtime implementation.

The stable Yukh boundary remains:

```text
participant attribution
+ work URI
+ capability/policy decision
+ evidence correlation
+ coordination / handoff semantics
-----------------------------------
replaceable ACP-capable agent host
```

A host may provide persistent memory, skills, subagents, scheduling or richer UX, but those facilities remain candidate-owned implementation capabilities. They do not become Yukh authority, accepted work state, or evidence truth merely because a qualified host exposes them.

## Track A conclusion

Outcome: **support both**.

- goose: QUALIFIED at the pinned revision;
- Hermes Agent: QUALIFIED at the pinned revision;
- exclusive reference host: **not selected**;
- Yukh-owned host/runtime repository: **not justified**;
- future host candidates: qualify against the same semantic/recovery contract rather than copying goose- or Hermes-specific behavior.

No RFC supersession is required by this conclusion because it preserves RFC-0003's protocol-first, replaceable-component architecture and does not transfer Yukh authority to either external host.
