import Link from "next/link";

type ArrowIconProps = {
  direction?: "right" | "left" | "down" | "external";
};

export function ArrowIcon({ direction = "right" }: ArrowIconProps) {
  const path = {
    right: "M3 10h13m-5-5 5 5-5 5",
    left: "M17 10H4m5-5-5 5 5 5",
    down: "M10 3v13m-5-5 5 5 5-5",
    external: "M4 16 16 4M8 4h8v8",
  }[direction];

  return (
    <svg className="arrow-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.09 1.15A10.72 10.72 0 0 1 12 6.12c.96 0 1.91.13 2.81.38 2.15-1.46 3.09-1.15 3.09-1.15.62 1.55.23 2.7.12 2.98.72.79 1.16 1.8 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.04.76 2.1v3.12c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Nomed, home">
        <img src="/brand/nomed.svg" alt="" />
        <span>NOMED</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/manifesto">Manifesto</Link>
        <Link href="/system">System</Link>
        <Link href="/work">Work</Link>
        <Link href="/control-plane">Control</Link>
        <Link href="/writing">Writing</Link>
        <a className="nav-external" href="https://github.com/nomed" target="_blank" rel="noreferrer">
          GitHub <ArrowIcon direction="external" />
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <Link className="wordmark footer-mark" href="/">
        <img src="/brand/nomed.svg" alt="" />
        <span>NOMED</span>
      </Link>
      <p>Open infrastructure for governed agentic development.</p>
      <div className="footer-links">
        <Link href="/writing">Writing</Link>
        <Link href="/brand">Identity</Link>
        <a href="https://github.com/nomed" target="_blank" rel="noreferrer">GitHub <ArrowIcon direction="external" /></a>
      </div>
    </footer>
  );
}

type RepositoryLinkProps = {
  href: string;
  name: string;
  compact?: boolean;
};

export function RepositoryLink({ href, name, compact = false }: RepositoryLinkProps) {
  return (
    <a className={compact ? "repository-link repository-link-compact" : "repository-link"} href={href} target="_blank" rel="noreferrer">
      <GitHubIcon />
      <span>View {name} repository</span>
      <ArrowIcon direction="external" />
    </a>
  );
}
