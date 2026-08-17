import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowIcon, SiteFooter, SiteHeader } from "../components/Navigation";

const managers = [
  {
    id: "manager-suite-evolution",
    title: "Suite evolution manager",
    status: "planning",
    provider: "Codex CLI",
    model: "gpt-5.6-sol",
    workspace: "yukh-workspace",
    goal: "Plan one bounded improvement across yukh-mcp, yukh-coordination and nomed.github.io.",
    started: "14:02:11",
    lastEvent: "14:09:42",
    budget: { used: "42,180", total: "180,000", width: "23%" },
    orchestrates: ["docs-operator", "runtime-qa", "frontend-console"],
  },
  {
    id: "manager-task-board",
    title: "Task board exercise manager",
    status: "completed",
    provider: "Codex CLI",
    model: "gpt-5.6-sol",
    workspace: "yukh-task-board",
    goal: "Coordinate backend and frontend workers for the local task-board smoke.",
    started: "12:31:18",
    lastEvent: "12:32:03",
    budget: { used: "31,200", total: "80,000", width: "39%" },
    orchestrates: ["agent-b"],
  },
];

const workers = [
  {
    id: "docs-operator",
    parent: "manager-suite-evolution",
    role: "Documentation operator",
    provider: "Copilot SDK",
    status: "proposed",
    reason: "Condense operator-facing docs after the plan is approved.",
    budget: "35,000",
  },
  {
    id: "runtime-qa",
    parent: "manager-suite-evolution",
    role: "Runtime QA",
    provider: "Codex SDK planned",
    status: "waiting",
    reason: "Verify team status, transcript and budget accounting.",
    budget: "45,000",
  },
  {
    id: "frontend-console",
    parent: "manager-suite-evolution",
    role: "Control plane UI",
    provider: "Copilot SDK",
    status: "running",
    reason: "Turn dashboard mock into operator console mock.",
    budget: "40,000",
  },
  {
    id: "agent-b",
    parent: "manager-task-board",
    role: "Frontend worker",
    provider: "Copilot CLI",
    status: "answered",
    reason: "Confirm automatic Coordination launch and answer verification.",
    budget: "20,000",
  },
];

const sessions = [
  {
    id: "session-codex-manager-suite",
    owner: "manager-suite-evolution",
    runtime: "Codex CLI",
    state: "running",
    workspace: "yukh-workspace",
    started: "14:02:11",
    last: "manager.plan.created",
  },
  {
    id: "session-copilot-frontend-console",
    owner: "frontend-console",
    runtime: "Copilot SDK",
    state: "running",
    workspace: "nomed.github.io",
    started: "14:07:28",
    last: "worker.patch.ready",
  },
  {
    id: "session-copilot-agent-b",
    owner: "agent-b",
    runtime: "Copilot CLI",
    state: "exited",
    workspace: "yukh-task-board",
    started: "12:31:21",
    last: "answer.verified",
  },
];

const events = [
  [
    "14:02:11",
    "manager.start",
    "manager-suite-evolution",
    "manager created with 180k team budget",
  ],
  [
    "14:03:04",
    "model.catalog",
    "manager-suite-evolution",
    "Codex and Copilot models discovered",
  ],
  [
    "14:04:22",
    "plan.created",
    "manager-suite-evolution",
    "3 workers proposed, no worker launched yet",
  ],
  [
    "14:05:10",
    "approval.required",
    "operator",
    "delegate mode requires explicit approval",
  ],
  [
    "14:07:28",
    "worker.started",
    "frontend-console",
    "Copilot SDK worker launched for static UI iteration",
  ],
  [
    "14:09:42",
    "worker.patch.ready",
    "frontend-console",
    "operator console mock ready for review",
  ],
];

const config = [
  ["Default mode", "plan-first"],
  ["Dynamic workers", "explicit approval only"],
  ["Manager runtime", "Codex CLI now, Codex SDK target"],
  ["Worker runtime", "Copilot SDK preferred"],
  ["Budget policy", "preflight allocation + post-turn accounting"],
  ["Viewer", "GitHub Pages preview, live runtime later"],
];

export default function ControlPlanePreview() {
  return (
    <main className="control-plane-page">
      <SiteHeader />

      <section className="control-operator-hero">
        <div>
          <p className="editorial-kicker">
            Yukh Control Plane / operator preview
          </p>
          <h1>Who is managing what, right now?</h1>
          <p>
            This view is shaped as an operator console: managers, sessions,
            orchestration tree, configuration and event history before any live
            runtime is connected.
          </p>
        </div>
        <div className="control-run-command" aria-label="Target command">
          <span>Target operator entrypoint</span>
          <code>yukh team start --goal ... --mode plan-first</code>
          <p>
            Mock data only. The real UI should hydrate from team status,
            Coordination replay and runtime receipts.
          </p>
        </div>
      </section>

      <section
        className="control-metrics"
        aria-label="Mock control plane summary"
      >
        <div>
          <span>Active managers</span>
          <strong>1</strong>
        </div>
        <div>
          <span>Open sessions</span>
          <strong>2</strong>
        </div>
        <div>
          <span>Worker proposals</span>
          <strong>3</strong>
        </div>
        <div>
          <span>Token usage</span>
          <strong>24%</strong>
        </div>
      </section>

      <section className="control-layout">
        <aside className="control-sidebar">
          <Link href="#managers">Managers</Link>
          <Link href="#orchestration">Orchestration</Link>
          <Link href="#sessions">Sessions</Link>
          <Link href="#events">Events</Link>
          <Link href="#configuration">Configuration</Link>
          <a
            href="https://github.com/nomed/yukh-mcp/pull/244"
            target="_blank"
            rel="noreferrer"
          >
            Runtime PR <ArrowIcon direction="external" />
          </a>
        </aside>

        <div className="control-main">
          <section className="control-card" id="managers">
            <div className="control-section-title">
              <div>
                <p className="editorial-kicker">Managers</p>
                <h2>Active orchestration</h2>
              </div>
              <span>mock data</span>
            </div>
            <div className="control-manager-list">
              {managers.map((manager) => (
                <article className="control-manager" key={manager.id}>
                  <div className="control-manager-head">
                    <div>
                      <p className="control-mode">{manager.id}</p>
                      <h3>{manager.title}</h3>
                    </div>
                    <span className="control-state">{manager.status}</span>
                  </div>
                  <p>{manager.goal}</p>
                  <dl>
                    <div>
                      <dt>Provider</dt>
                      <dd>{manager.provider}</dd>
                    </div>
                    <div>
                      <dt>Model</dt>
                      <dd>{manager.model}</dd>
                    </div>
                    <div>
                      <dt>Workspace</dt>
                      <dd>{manager.workspace}</dd>
                    </div>
                    <div>
                      <dt>Started</dt>
                      <dd>{manager.started}</dd>
                    </div>
                    <div>
                      <dt>Last event</dt>
                      <dd>{manager.lastEvent}</dd>
                    </div>
                  </dl>
                  <div className="control-budget compact-budget">
                    <div>
                      <strong>Token ledger</strong>
                      <span>
                        {manager.budget.used} / {manager.budget.total}
                      </span>
                    </div>
                    <i
                      style={
                        {
                          "--budget-width": manager.budget.width,
                        } as CSSProperties
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="control-grid" id="orchestration">
            <article className="control-card">
              <div className="control-section-title">
                <div>
                  <p className="editorial-kicker">Orchestration</p>
                  <h2>Who created whom</h2>
                </div>
              </div>
              <div className="control-tree">
                {managers.map((manager) => (
                  <div className="control-tree-group" key={manager.id}>
                    <div className="control-tree-node manager-node">
                      <strong>{manager.id}</strong>
                      <span>
                        {manager.status} · {manager.provider}
                      </span>
                    </div>
                    {workers
                      .filter((worker) => worker.parent === manager.id)
                      .map((worker) => (
                        <div
                          className="control-tree-node worker-node"
                          key={worker.id}
                        >
                          <strong>{worker.id}</strong>
                          <span>
                            {worker.role} · {worker.provider} · {worker.status}
                          </span>
                          <p>{worker.reason}</p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </article>

            <article className="control-card" id="configuration">
              <div className="control-section-title">
                <div>
                  <p className="editorial-kicker">Configuration</p>
                  <h2>Run policy</h2>
                </div>
              </div>
              <div className="control-config-list">
                {config.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="control-card" id="sessions">
            <div className="control-section-title">
              <div>
                <p className="editorial-kicker">Sessions</p>
                <h2>Runtimes started</h2>
              </div>
              <span>process view target</span>
            </div>
            <div
              className="control-session-table"
              role="table"
              aria-label="Runtime sessions"
            >
              <div role="row" className="table-head">
                <span>Session</span>
                <span>Owner</span>
                <span>Runtime</span>
                <span>Workspace</span>
                <span>State</span>
                <span>Last</span>
              </div>
              {sessions.map((session) => (
                <div role="row" key={session.id}>
                  <span>{session.id}</span>
                  <span>{session.owner}</span>
                  <span>{session.runtime}</span>
                  <span>{session.workspace}</span>
                  <strong>{session.state}</strong>
                  <span>{session.last}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="control-card" id="events">
            <div className="control-section-title">
              <div>
                <p className="editorial-kicker">Events</p>
                <h2>What happened</h2>
              </div>
              <span>timeline</span>
            </div>
            <div className="control-transcript">
              {events.map(([time, kind, source, body]) => (
                <div className="control-event" key={`${time}-${kind}`}>
                  <div>
                    <span>{time}</span>
                    <strong>{kind}</strong>
                    <span>{source}</span>
                  </div>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
