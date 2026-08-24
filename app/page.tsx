import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowIcon, RepositoryLink, SiteFooter, SiteHeader } from "./components/Navigation";

const components = [
  {
    index: "01",
    name: "Yukh MCP",
    label: "Capability policy + evidence",
    mark: "/brand/yukh-mcp.svg",
    color: "#7C3AED",
    status: "Current implementation",
    focus: "Implements the capability-policy and evidence boundary while Track A tests composition with host-native security.",
    system: "/system/mcp/",
    repository: "https://github.com/nomed/yukh-mcp",
  },
  {
    index: "02",
    name: "Yukh Projects",
    label: "GitHub accepted-state adapter",
    mark: "/brand/yukh-projects.svg",
    color: "#00E5FF",
    status: "Published adapter",
    focus: "A useful GitHub Projects implementation whose long-term architectural role is being narrowed to accepted work state rather than protected as a universal pillar.",
    system: "/system/projects/",
    repository: "https://github.com/nomed/yukh-projects",
  },
  {
    index: "03",
    name: "Yukh Coordination",
    label: "Coordination kernel",
    mark: "/brand/yukh-coordination.svg",
    color: "#CCFF00",
    status: "Current implementation",
    focus: "Carries claims, conflict, handoff, attribution and replay semantics while transports and workspaces remain replaceable.",
    system: "/system/coordination/",
    repository: "https://github.com/nomed/yukh-coordination",
  },
];

const principles = [
  { lead: "Semantics", tail: "before machinery", note: "Own only what must survive replacement.", color: "#7C3AED" },
  { lead: "Capability", tail: "not custody", note: "Authority stays explicit, scoped and composable.", color: "#CCFF00" },
  { lead: "Evidence", tail: "not declarations", note: "Operational facts remain independently checkable.", color: "#FF3B30" },
  { lead: "Open seams", tail: "not captive runtimes", note: "Hosts, memory, sandboxes and workspaces stay replaceable.", color: "#00E5FF" },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="eyebrow">
          <span>Nomed / Governed agentic development</span>
          <span>Yukh / Semantics-first open architecture</span>
        </div>
        <h1>Give agents capability without giving any runtime custody of the system.</h1>
        <div className="hero-bottom">
          <p className="lede">Yukh is defining the governance semantics that should survive when the model, host, sandbox, memory system, workflow engine or human workspace changes.</p>
          <a className="round-link" href="#position" aria-label="Begin the story">
            Begin
            <ArrowIcon direction="down" />
          </a>
        </div>
      </section>

      <aside className="signal-strip" aria-label="Current signal">
        <span className="pulse" aria-hidden="true" />
        <strong>Current signal</strong>
        <span>Host composition + shared memory qualification</span>
        <span className="signal-status">goose / Hermes A1 PASS · A2 not executed · TencentDB Agent Memory Track C2</span>
      </aside>

      <section className="manifesto section" id="position">
        <div className="section-label">01 / Position</div>
        <div className="manifesto-copy">
          <p className="statement">Own the semantics. Reuse the machinery.</p>
          <p>Agent systems now arrive with their own loops, approvals, sandboxes, memory, workflows and collaborative surfaces. Yukh should not rebuild those capabilities merely to own the stack. It should define the authority, attribution, coordination and evidence contracts that remain true when any one implementation is replaced.</p>
          <p>RFC-0003 is still the accepted reference architecture. Current qualification work is testing how much of its implementation machinery can shrink, move behind adapters or disappear without weakening those boundaries.</p>
          <div className="operating-loop" aria-label="The governed operating loop">
            <span>Intent</span><i><ArrowIcon /></i><span>Capability</span><i><ArrowIcon /></i><span>Host policy</span><i><ArrowIcon /></i><span>Execute</span><i><ArrowIcon /></i><span>Verify</span><i><ArrowIcon /></i><span>Evidence</span>
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
        <div className="section-label">02 / Current system</div>
        <div className="yukh-intro">
          <p className="kicker">Accepted boundaries. Replaceable implementations.</p>
          <h2>Three current repositories implement only part of the architecture story.</h2>
          <p>The accepted reference decomposition still separates capability authority, accepted work state and live coordination. Yukh MCP, Projects and Coordination are the current implementations of those responsibilities. Agent hosts, execution, memory, orchestration and human workspaces are not automatically Yukh components.</p>
          <Link className="text-link" href="/system/">Understand the accepted boundaries <ArrowIcon /></Link>
          <Link className="text-link" href="/landscape/">See the machinery under qualification <ArrowIcon /></Link>
        </div>
        <div className="suite-map" aria-label="Current Yukh implementations of accepted reference boundaries">
          <div className="suite-map-rail" aria-hidden="true" />
          <Link className="suite-node suite-node-mcp" href="/system/mcp/"><span>01 / Capability</span><strong>Yukh MCP</strong></Link>
          <div className="suite-hub"><span>Stable goal</span><strong>Governance<br />semantics</strong></div>
          <Link className="suite-node suite-node-projects" href="/system/projects/"><span>02 / Accepted state</span><strong>Yukh Projects</strong></Link>
          <Link className="suite-node suite-node-coordination" href="/system/coordination/"><span>03 / Coordination</span><strong>Yukh Coordination</strong></Link>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="section-label">03 / Implementations</div>
        <div>
          <div className="work-heading">
            <h2>What Yukh code exists today.</h2>
            <Link className="text-link" href="/work/">See implementations + qualification work <ArrowIcon /></Link>
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
        <div className="section-label">04 / Qualification</div>
        <div className="coordination-grid">
          <div>
            <p className="kicker">No protected components.</p>
            <h2>The next architecture is being earned by evidence.</h2>
            <Link className="signal-link" href="/landscape/">Explore the current landscape <ArrowIcon /></Link>
          </div>
          <div className="coordination-copy">
            <p>goose and Hermes have both passed the first runtime-substrate gate, but neither is a selected Yukh host. Apache Maka, OpenHands, OpenHuman, TencentDB Agent Memory and Buzz are being evaluated for distinct replaceable concerns rather than collected into one mandatory platform.</p>
            <div className="terminal" role="img" aria-label="Current Yukh qualification tracks">
              <div className="terminal-top"><span>#qualification</span><span>observed 2026-08-24</span></div>
              <p><span>A1</span> goose + Hermes <b className="pass">PASS</b> runtime substrate</p>
              <p><span>A2</span> host composition <b>DEFINED</b> adapters not executed</p>
              <p><span>C2</span> TencentDB Agent Memory <b>MEMORY?</b> contextual, never authority</p>
              <p><span>EX</span> Maka + OpenHands <b>EXECUTION?</b> durable facts + isolation</p>
              <p><span>UX</span> Buzz <b>WORKSPACE?</b> surface, not authority</p>
              <div className="terminal-cursor">_</div>
            </div>
          </div>
        </div>
      </section>

      <section className="invitation">
        <p>Research / Architecture under qualification</p>
        <h2>Less platform. Stronger boundaries.</h2>
        <div>
          <Link href="/landscape/">Read the qualification landscape <ArrowIcon /></Link>
          <Link href="/writing/">Read the field notes <ArrowIcon /></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
