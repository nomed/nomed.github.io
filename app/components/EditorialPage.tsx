import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

type EditorialPageProps = {
  index: string;
  label: string;
  title: string;
  lede: string;
  accent?: string;
  children: ReactNode;
};

export function EditorialPage({
  index,
  label,
  title,
  lede,
  accent = "#FF3B30",
  children,
}: EditorialPageProps) {
  return (
    <main className="editorial-page" style={{ "--page-accent": accent } as CSSProperties}>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Nomed, home">
          <img src="/brand/nomed.svg" alt="" />
          <span>NOMED</span>
        </Link>
        <nav aria-label="Primary navigation">
          <a href="/manifesto">Manifesto</a>
          <a href="/projects">Projects</a>
          <a href="/system">System</a>
          <a href="https://github.com/nomed">GitHub ↗</a>
        </nav>
      </header>

      <article>
        <header className="editorial-hero">
          <p className="editorial-kicker">{index} / {label}</p>
          <h1>{title}</h1>
          <p className="editorial-lede">{lede}</p>
        </header>
        <div className="editorial-body">{children}</div>
      </article>

      <footer>
        <Link className="wordmark footer-mark" href="/">
          <img src="/brand/nomed.svg" alt="" />
          <span>NOMED</span>
        </Link>
        <p>Open infrastructure for governed agentic development.</p>
        <p>© 2026 · Built in public</p>
      </footer>
    </main>
  );
}
