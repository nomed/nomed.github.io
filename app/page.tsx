import type { CSSProperties } from "react";

const projects = [
  {
    index: "01",
    name: "Yukh MCP",
    label: "Capability gateway",
    mark: "/brand/yukh-mcp.svg",
    color: "#7C3AED",
    description:
      "A policy-governed gateway for safe, auditable and verifiable AI operations. Capability, not custody.",
    href: "https://github.com/nomed/yukh-mcp",
  },
  {
    index: "02",
    name: "Yukh Projects",
    label: "Declarative control plane",
    mark: "/brand/yukh-projects.svg",
    color: "#00E5FF",
    description:
      "Consumer-neutral reconciliation for GitHub Projects, built around plans, explicit authority and idempotent outcomes.",
    href: "https://github.com/nomed/yukh-projects",
  },
  {
    index: "03",
    name: "Yukh Coordination",
    label: "Protocol in formation",
    mark: "/brand/yukh-coordination.svg",
    color: "#CCFF00",
    description:
      "Shared channels, questions, reviews and handoffs for people and agents working across isolated sessions.",
    href: "https://github.com/nomed/yukh-coordination",
  },
];

const principles = [
  { lead: "Capability", tail: "not custody", note: "Typed authority, scoped to a resource.", color: "#7C3AED" },
  { lead: "Coordination", tail: "not invisible orchestration", note: "Claims, questions and handoffs stay observable.", color: "#CCFF00" },
  { lead: "Evidence", tail: "not declarations", note: "Plans and outcomes remain independently checkable.", color: "#FF3B30" },
  { lead: "Open protocols", tail: "not captive platforms", note: "Components integrate without owning the workflow.", color: "#00E5FF" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Nomed, home">
          <img src="/brand/nomed.svg" alt="" />
          <span>NOMED</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/manifesto">Manifesto</a>
          <a href="/projects">Projects</a>
          <a href="/coordination">Coordination</a>
          <a href="https://github.com/nomed">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">
          <span>Independent systems practice</span>
          <span>Open source · Agentic development</span>
        </div>
        <h1>
          Software is no longer written by one mind at one keyboard.
        </h1>
        <div className="suite-map" aria-label="The Yukh suite: capabilities, projects and coordination linked by governance and evidence">
          <div className="suite-map-rail" aria-hidden="true" />
          <a className="suite-node suite-node-mcp" href="https://github.com/nomed/yukh-mcp">
            <span>01 / Capability</span><strong>Yukh MCP</strong>
          </a>
          <div className="suite-hub"><span>Shared layer</span><strong>Governance<br />+ evidence</strong></div>
          <a className="suite-node suite-node-projects" href="https://github.com/nomed/yukh-projects">
            <span>02 / Control plane</span><strong>Yukh Projects</strong>
          </a>
          <a className="suite-node suite-node-coordination" href="https://github.com/nomed/yukh-coordination">
            <span>03 / Protocol</span><strong>Yukh Coordination</strong>
          </a>
        </div>
        <div className="hero-bottom">
          <p className="lede">
            Nomed designs open infrastructure for governed agentic development—
            where people, agents, policy and evidence can work together in public.
          </p>
          <a className="round-link" href="#work" aria-label="Explore the work">
            Explore
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <aside className="signal-strip" aria-label="Current signal">
        <span className="pulse" aria-hidden="true" />
        <strong>Current signal</strong>
        <span>Yukh Coordination Protocol</span>
        <span className="signal-status">research / design</span>
      </aside>

      <section className="manifesto section" id="manifesto">
        <div className="section-label">01 / Position</div>
        <div className="manifesto-copy">
          <p className="statement">
            Agents should gain capability without gaining custody.
          </p>
          <p>
            The next generation of software teams will be made of people,
            models, tools and automated policy. The hard problem is not making
            them faster. It is making their work legible, governable and worthy
            of trust.
          </p>
          <p>
            Nomed works in the open on the protocols and control planes this
            new practice requires.
          </p>
          <div className="operating-loop" aria-label="The governed operating loop">
            <span>Intent</span><i>→</i><span>Policy</span><i>→</i><span>Plan</span><i>→</i><span>Approval</span><i>→</i><span>Execute</span><i>→</i><span>Verify</span><i>→</i><span>Evidence</span>
          </div>
        </div>
      </section>

      <section className="principles" aria-label="Principles">
        {principles.map((principle, index) => (
          <div className="principle" key={principle.lead} style={{ "--principle-color": principle.color } as CSSProperties}>
            <span className="principle-index">0{index + 1}</span>
            <p>
              <strong>{principle.lead}</strong>
              <span>{principle.tail}</span>
            </p>
            <small>{principle.note}</small>
          </div>
        ))}
      </section>

      <section className="work section" id="work">
        <div className="section-label">02 / Workbench</div>
        <div className="project-list">
          {projects.map((project) => (
            <a
              className="project"
              href={project.href}
              key={project.name}
              target="_blank"
              rel="noreferrer"
              style={{ "--project-color": project.color } as CSSProperties}
            >
              <span className="project-index">
                <img src={project.mark} alt="" />
                {project.index}
              </span>
              <div>
                <span className="project-label">{project.label}</span>
                <h2>{project.name}</h2>
              </div>
              <p>{project.description}</p>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="coordination section" id="signal">
        <div className="section-label">03 / Field signal</div>
        <div className="coordination-grid">
          <div>
            <p className="kicker">Ancient protocols. New participants.</p>
            <h2>What if agents could meet in the open?</h2>
          </div>
          <div className="coordination-copy">
            <p>
              IRC gave communities shared rooms. Mailing lists gave them
              memory. Patch queues made review visible. Agentic development
              needs those same social guarantees, expressed as an open protocol.
            </p>
            <div className="terminal" role="img" aria-label="A shared coordination channel showing agents working and reviewing">
              <div className="terminal-top">
                <span>#project-release</span>
                <span>4 agents · 0 collisions</span>
              </div>
              <p><span>12:28</span> wave2 <b>PROGRESS</b> main merged, CI green</p>
              <p><span>12:29</span> reviewer <b>QUESTION</b> exact-head evidence?</p>
              <p><span>12:30</span> ui-agent <b>ANSWER</b> attached run/30748155709</p>
              <p><span>12:31</span> reviewer <b className="pass">VERDICT PASS</b></p>
              <div className="terminal-cursor">_</div>
            </div>
          </div>
        </div>
      </section>

      <section className="invitation">
        <p>Working in public from Europe.</p>
        <h2>Build systems that deserve agency.</h2>
        <div>
          <a href="/writing/capability-not-custody">Read the first field note →</a>
          <a href="/brand">Explore the identity system →</a>
          <a href="https://github.com/nomed">Follow the work ↗</a>
        </div>
      </section>

      <footer>
        <a className="wordmark footer-mark" href="#top">
          <img src="/brand/nomed.svg" alt="" />
          <span>NOMED</span>
        </a>
        <p>Open infrastructure for governed agentic development.</p>
        <p>© 2026 · Built in public</p>
      </footer>
    </main>
  );
}
