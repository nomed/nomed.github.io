import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowIcon, SiteFooter, SiteHeader } from "../components/Navigation";

const teams = [
  {
    id: "team-manager-preview",
    mode: "plan-first",
    state: "waiting for approval",
    goal: "Improve the Yukh control plane with one bounded UI increment.",
    budget: "18,420 / 120,000",
    reserved: "40,000",
    agents: [
      ["manager", "Codex CLI", "planned"],
      ["frontend-worker", "Copilot SDK", "proposed"],
      ["qa-worker", "Codex SDK", "planned"],
    ],
  },
  {
    id: "team-task-board-smoke",
    mode: "delegate",
    state: "complete",
    goal: "Verify automatic Coordination handoff.",
    budget: "31,200 / 80,000",
    reserved: "55,000",
    agents: [["agent-b", "Copilot CLI", "answered"]],
  },
];

const transcript = [
  {
    time: "12:31:18",
    kind: "QUESTION",
    route: "agent:a → agent:b",
    body: "Confirm that the coordinator launched you and report the question event id.",
  },
  {
    time: "12:32:02",
    kind: "ANSWER",
    route: "agent:b → agent:a",
    body: "Confirmed. The coordinator launched me through Yukh Coordination.",
  },
  {
    time: "12:32:03",
    kind: "VERIFIED",
    route: "coordinator → observer",
    body: "The worker response is linked to the original question and receipt.",
  },
];

export default function ControlPlanePreview() {
  return (
    <main className="control-plane-page">
      <SiteHeader />

      <section className="control-hero">
        <div className="control-hero-copy">
          <p className="editorial-kicker">Yukh Control Plane / public preview</p>
          <h1>See the team before you trust the run.</h1>
          <p>
            A browser surface for manager-first Yukh work: teams, roles, provider
            choices, Coordination transcript and token budgets in one place.
          </p>
        </div>
        <div className="control-hero-panel" aria-label="Preview status">
          <span>Preview status</span>
          <strong>Static / read-only</strong>
          <p>No live runtime actions, credentials, private logs or real token usage are exposed here.</p>
        </div>
      </section>

      <section className="control-metrics" aria-label="Mock run summary">
        <div><span>Active teams</span><strong>1</strong></div>
        <div><span>Running agents</span><strong>4</strong></div>
        <div><span>Token budget</span><strong>25% used</strong></div>
        <div><span>Provider mix</span><strong>CLI + SDK</strong></div>
      </section>

      <section className="control-layout">
        <aside className="control-sidebar">
          <Link href="#teams">Teams</Link>
          <Link href="#transcript">Transcript</Link>
          <Link href="#budget">Budget</Link>
          <Link href="#start">Start team</Link>
          <a href="https://github.com/nomed/yukh-mcp/pull/244" target="_blank" rel="noreferrer">
            Implementation PR <ArrowIcon direction="external" />
          </a>
        </aside>

        <div className="control-main">
          <section className="control-card" id="teams">
            <div className="control-section-title">
              <div>
                <p className="editorial-kicker">Teams</p>
                <h2>Live work</h2>
              </div>
              <span>mock data</span>
            </div>

            <div className="control-team-list">
              {teams.map((team) => (
                <article className="control-team" key={team.id}>
                  <div>
                    <p className="control-mode">{team.mode}</p>
                    <h3>{team.id}</h3>
                    <p>{team.goal}</p>
                    <div className="control-agent-list">
                      {team.agents.map(([name, provider, state]) => (
                        <span key={name}>
                          <strong>{name}</strong>
                          {provider} · {state}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="control-state">{team.state}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="control-grid">
            <article className="control-card" id="transcript">
              <div className="control-section-title">
                <div>
                  <p className="editorial-kicker">Coordination</p>
                  <h2>Verified transcript</h2>
                </div>
              </div>
              <div className="control-transcript">
                {transcript.map((event) => (
                  <div className="control-event" key={`${event.time}-${event.kind}`}>
                    <div>
                      <span>{event.time}</span>
                      <span>{event.route}</span>
                      <strong>{event.kind}</strong>
                    </div>
                    <p>{event.body}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="control-card" id="budget">
              <div className="control-section-title">
                <div>
                  <p className="editorial-kicker">Budget</p>
                  <h2>Token control</h2>
                </div>
              </div>
              {teams.map((team, index) => (
                <div className="control-budget" key={team.id}>
                  <div>
                    <strong>{team.id}</strong>
                    <span>{team.budget}</span>
                  </div>
                  <i style={{ "--budget-width": index === 0 ? "15%" : "39%" } as CSSProperties} />
                  <p>Reserved: {team.reserved} tokens</p>
                </div>
              ))}
            </article>
          </section>

          <section className="control-card control-start" id="start">
            <div>
              <p className="editorial-kicker">Start</p>
              <h2>Manager-first, not ping-pong-first.</h2>
              <p>
                The intended product flow starts from a human goal, creates an accounted
                manager, shows the plan, then asks for explicit approval before workers run.
              </p>
            </div>
            <div className="control-form-preview" aria-label="Start team form preview">
              <span>Goal</span>
              <strong>Improve Yukh suite with one bounded increment.</strong>
              <span>Mode</span>
              <strong>plan-first</strong>
              <span>Worker provider</span>
              <strong>Copilot SDK</strong>
              <span>Budget</span>
              <strong>120,000 tokens</strong>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
