import type { CSSProperties, ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./Navigation";

type EditorialPageProps = {
  index: string;
  label: string;
  title: string;
  lede: string;
  accent?: string;
  mark?: string;
  markAlt?: string;
  children: ReactNode;
};

export function EditorialPage({
  index,
  label,
  title,
  lede,
  accent = "#FF3B30",
  mark,
  markAlt = "",
  children,
}: EditorialPageProps) {
  return (
    <main className="editorial-page" style={{ "--page-accent": accent } as CSSProperties}>
      <SiteHeader />

      <article>
        <header className="editorial-hero">
          <div className="editorial-identity">
            {mark && <span className="mark-stage"><img src={mark} alt={markAlt} /></span>}
            <p className="editorial-kicker">{index} / {label}</p>
          </div>
          <h1>{title}</h1>
          <p className="editorial-lede">{lede}</p>
        </header>
        <div className="editorial-body">{children}</div>
      </article>

      <SiteFooter />
    </main>
  );
}
