# Track A — runtime-substrate qualification — 2026-08-24

- **Status:** executed qualification evidence; does not select a host
- **Governing issue:** #58
- **Fixture:** `TRACK-A-HOST-FIXTURE.md`
- **Prequalification:** `TRACK-A-PREQUALIFICATION-2026-08-24.md`
- **Workflow run:** `32705914861`
- **Observed PR:** #61
- **Decision authority:** none; RFC-0003 remains authoritative

## Result

Both pinned candidates pass the first executable **runtime-substrate** gate.

| Candidate | Pinned revision | Candidate-owned gate | Result |
| --- | --- | --- | --- |
| goose | `bd16fbfbbe78cadc2cc3ce6295691772df51d71f` | `cargo test -p goose acp --lib` | **PASS** — 320 passed, 0 failed |
| Hermes Agent | `a0ca7c19204e514f9590ce3b812e029b315ab9e9` | selected ACP/session/approval/MCP pytest corpus | **PASS** — 27 passed |

This is a tie at the substrate gate. Test counts are not comparable quality scores because the upstream suites have different scope.

## What this gate proves

For the pinned revisions and the GitHub-hosted Ubuntu qualification profile:

- both repositories can be fetched at an exact revision;
- both expose the public ACP/MCP and permission surfaces required by the harness;
- both can execute their selected candidate-owned substrate tests without model credentials;
- the common Yukh evidence writer and invariant verifier accept both results;
- neither qualification disabled native host safety controls;
- neither result requires chain-of-thought as evidence.

### goose evidence

The goose gate exercised its ACP-focused Rust unit corpus. The passing tests include permission-decision mappings, ACP mode handling, MCP server/extension conversion, session load/resume/replay behavior, handoff-context handling, tool ownership/location metadata and ACP server behavior.

This is useful evidence that the relevant substrate exists and is internally exercised. It is **not** proof that a Yukh capability decision composes correctly with goose permissions in an end-to-end Yukh scenario.

Operational observation: the cold GitHub-hosted run spent about five minutes compiling the Rust dependency graph before the selected test corpus executed. This is a CI/qualification cost observation, not an architectural disadvantage; caching or a narrower build may materially change it.

### Hermes Agent evidence

Hermes installed the repository's documented `.[all,dev]` profile on Python 3.11 and passed the selected tests covering ACP session behavior, edit approval and ACP/MCP discovery.

This is useful evidence that ACP, approval and MCP integration are executable at the pinned revision. It is **not** proof that Hermes persistent memory remains non-authoritative in a Yukh flow, nor that any particular execution backend satisfies a Yukh isolation profile.

## Evidence artifacts

| Candidate | Artifact ID | Artifact digest |
| --- | ---: | --- |
| goose | `9512400210` | `sha256:8a44c9b4106e2aa9a91ef455da3e3a9c9b5f2a1926293079d1c52b8a1e9e2ccf` |
| Hermes Agent | `9512260631` | `sha256:bef1211943cb421d2b9fbd8f4a4c023d66082a0daacd457d525b4a0e3faa8eb9` |

Each artifact contains the same candidate-neutral JSON envelope. Both envelopes record the pinned revision and public integration surface as `PASS`, while the Yukh-specific end-to-end dimensions below remain `NOT_EXECUTED`.

## Dimensions still not qualified

Neither candidate is a supported or reference Yukh host yet.

The following mandatory questions remain open for **both** candidates:

| Dimension | Current state | Required next evidence |
| --- | --- | --- |
| Yukh capability ↔ native permission composition | `NOT_EXECUTED` | one bounded capability with native protections still active |
| Participant/work/run correlation | `NOT_EXECUTED` end to end | stable identifiers independent of prompt/chat text |
| Execution trust boundary | `NOT_EXECUTED` | exact tested backend/profile and a forbidden-access negative test |
| Restart/recovery | `NOT_EXECUTED` | reconnect/restart while preserving correlation without making host memory authoritative |
| Vendor-neutral evidence export | `NOT_EXECUTED` | operational facts correlated to participant/work/capability/run IDs |
| Adapter cost | `NOT_EXECUTED` | concrete candidate-specific adapter surface and maintenance burden |
| Delegation causation | optional / not yet executed | parent/child attribution where the candidate supports delegation |

Upstream resume, replay, handoff or approval tests do not automatically satisfy these Yukh-specific dimensions. The next gate must cross the Yukh boundary explicitly.

## Current Track A interpretation

- **goose:** remains a reference-host qualification candidate.
- **Hermes Agent:** remains a reference-host qualification candidate.
- **Yukh-owned host:** still unjustified; no demonstrated gap requires building one yet.
- **Selection:** none. The substrate gate gives no basis to prefer one candidate.

## Next gate — Yukh host-composition slice

Use the same candidate-neutral scenario for both hosts:

1. bind a stable Yukh participant and canonical work URI;
2. expose one synthetic, read-only Yukh capability through a public host seam;
3. keep native permission/sandbox controls enabled;
4. read the deterministic `hello-yukh\n` fixture and deny one out-of-scope read;
5. correlate operation, capability, participant, work and host session/run identifiers;
6. export a neutral evidence envelope without private reasoning;
7. restart/reconnect and prove that accepted Yukh evidence survives independently of host memory;
8. measure candidate-specific adapter surface.

The gate should use a deterministic credential-free model/provider seam if both candidates expose one. If they do not, the qualification must separate protocol/permission composition from model quality rather than introduce paid provider credentials merely to make the test pass.

## Decision consequence

Track A remains open. The next gate may still conclude `support neither`, `support goose`, `support Hermes`, or `support both`. A failure remains valid evidence.
