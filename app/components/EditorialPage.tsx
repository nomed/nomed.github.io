import type { CSSProperties, ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./Navigation";

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
      <SiteHeader />

      <article>
        <header className="editorial-hero">
          <p className="editorial-kicker">{index} / {label}</p>
          <h1>{title}</h1>
          <p className="editorial-lede">{lede}</p>
        </header>
        <div className="editorial-body">{children}</div>
      </article>

      <SiteFooter />
    </main>
  );
}
