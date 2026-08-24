import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowIcon, RepositoryLink, SiteFooter, SiteHeader } from "./components/Navigation";

const components = [
  {
    index: "01",
    name: "Yukh MCP",
    label: "Governed capabilities",
    mark: "/brand/yukh-mcp.svg",
    color: "#7C3AED",
    status: "Audit writer foundation",
    focus: "Storage-neutral audit contracts exist; no durable profile is accepted and no mutation lifecycle is integrated.",
    system: "/system/mcp/",
    repository: "https://github.com/nomed/yukh-mcp",
  },
  {
    index: "02",
    name: "Yukh Projects",
    label: "Accepted-state adapter",
    mark: "/brand/yukh-projects.svg",
    color: "#00E5FF",
    status: "Published / synthetically qualified",
    focus: "v1.7.0 qualifies controlled GitHub Projects apply with synthetic fixtures; its role as a universal Yukh layer is under review.",
    system: "/system/projects/",
    repository: "https://github.com/nomed/yukh-projects",
  },
  {
    index: "03",
    name: "Yukh Coordination",
    label: "Cross-session coordination",
    mark: "/brand/yukh-coordination.svg",
    color: "#CCFF00",
    status: "Preparation evidence complete",
    focus: "Protocol and runtime preparation evidence exist; there is no public or live runtime.",
    system: "/system/coordination/",
    repository: "https://github.com/nomed/yukh-coordination",
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
      <SiteHeader />

      <section className="hero" id="top">
        <div className="eyebrow">
          <span>Nomed / Governed agentic development</span>
          <span>Yukh / Open system in formation</span>
        </div>
        <h1>Software is no longer written by one mind at one keyboard.</h1>
        <div className="hero-bottom">
          <p className="lede">How can people, agents, policy and evidence work together without losing authority, memory or trust?</p>
          <a className="round-link" href="#position" aria-label="Begin the story">
            Begin
            <ArrowIcon direction="down" />
          </a>
        </div>
      </section>

      <aside className="signal-strip" aria-label="Current signal">
        <span className="pulse" aria-hidden="true" />
        <strong>Current signal</strong>
        <span>Agent systems landscape review</span>
        <span className="signal-status">current Yukh topology under evidence-based challenge</span>
      </aside>

      <section className="manifesto section" id="position">
        <div className="section-label">01 / Position</div>
        <div className="manifesto-copy">
          <p className="statement">Agents should gain capability without gaining custody.</p>
          <p>The next generation of software teams will be made of people, models, tools and automated policy. The hard problem is not making them faster. It is making their work legible, governable and worthy of trust.</p>
          <p>The required protocols and control planes do not yet exist. They are the work.</p>
          <div className="operating-loop" aria-label="The governed operating loop">
            <span>Intent</span><i><ArrowIcon /></i><span>Policy</span><i><ArrowIcon /></i><span>Plan</span><i><ArrowIcon /></i><span>Approval</span><i><ArrowIcon /></i><span>Execute</span><i><ArrowIcon /></i><span>Verify</span><i><ArrowIcon /></i><span>Evidence</span>
          </div>
        </div>
      </section>

      <section className="principles" aria-label="Principles">
        {principles.map((principle, index) => (
          <div className="principle" key={principle.lead} style={{ "--principle-color": principle.color } as CSSProperties}>
            <span className="principle-index">0{index + 1}</span>
            <p><strong>{principle.lead}</strong><span>{principle.tail}</span></p>
            <small>{principle.note}</small>
          </div>
        ))}
      </section>

      <section className="yukh section" id="system">
        <div className="section-label">02 / Yukh system</div>
        <div className="yukh-intro">
          <p className="kicker">Stable boundaries. Replaceable machinery.</p>
          <h2>These principles currently take shape in Yukh.</h2>
          <p>The present reference decomposition separates capability policy, accepted work state and live coordination. The boundaries are intentional; the repositories and implementations are not protected from replacement.</p>
          <Link className="text-link" href="/system/">Understand the current system <ArrowIcon /></Link>
          <Link className="text-link" href="/landscape/">See what is being challenged <ArrowIcon /></Link>
        </div>
        <div className="suite-map" aria-label="Current Yukh reference components">
          <div className="suite-map-rail" aria-hidden="true" />
          <Link className="suite-node suite-node-mcp" href="/system/mcp/"><span>01 / Capability</span><strong>Yukh MCP</strong></Link>
          <div className="suite-hub"><span>Shared layer</span><strong>Governance<br />+ evidence</strong></div>
          <Link className="suite-node suite-node-projects" href="/system/projects/"><span>02 / Accepted state</span><strong>Yukh Projects</strong></Link>
          <Link className="suite-node suite-node-coordination" href="/system/coordination/"><span>03 / Coordination</span><strong>Yukh Coordination</strong></Link>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="section-label">03 / Work</div>
        <div>
          <div className="work-heading">
            <h2>Current build status.</h2>
            <Link className="text-link" href="/work/">See the complete work surface <ArrowIcon /></Link>
          </div>
          <div className="project-list">
            {components.map((component) => (
              <article className="project" key={component.name} style={{ "--project-color": component.color } as CSSProperties}>
                <span className="project-index"><img src={component.mark} alt="" />{component.index}</span>
                <div>
                  <span className="project-label">{component.status}</span>
                  <h3><Link href={component.system}>{component.name}</Link></h3>
                </div>
                <p><strong>{component.label}</strong>{component.focus}</p>
                <RepositoryLink href={component.repository} name={component.name} compact />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="coordination section" id="signal">
        <div className="section-label">04 / Research signal</div>
        <div className="coordination-grid">
          <div>
            <p className="kicker">Reuse before reinvention.</p>
            <h2>Which parts of Yukh should not be Yukh code?</h2>
            <Link className="signal-link" href="/landscape/">Explore the agent systems landscape <ArrowIcon /></Link>
          </div>
          <div className="coordination-copy">
            <p>Maka, goose, OpenHands and Buzz now provide serious runtime, sandbox, interoperability and collaborative-workspace capabilities. Yukh is testing whether they can implement parts of the system without weakening authority, attribution, replay or evidence.</p>
            <div className="terminal" role="img" aria-label="Architecture qualification options">
              <div className="terminal-top"><span>#architecture-review</span><span>no protected components</span></div>
              <p><span>01</span> goose <b>HOST?</b> MCP + ACP + composable loop</p>
              <p><span>02</span> maka <b>RUNTIME?</b> durable AgentRun facts</p>
              <p><span>03</span> buzz <b>WORKSPACE?</b> humans + agents + signed events</p>
              <p><span>04</span> openhands <b className="pass">SANDBOX?</b> isolated execution</p>
              <div className="terminal-cursor">_</div>
            </div>
          </div>
        </div>
      </section>

      <section className="invitation">
        <p>Writing / Notes from the work</p>
        <h2>Build systems that deserve agency.</h2>
        <div>
          <Link href="/writing/">Read the field notes <ArrowIcon /></Link>
          <Link href="/brand/">Explore the identity system <ArrowIcon /></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
