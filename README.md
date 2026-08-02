# Nomed

The public home of Nomed: open infrastructure for governed agentic development.

## Development

```bash
npm install
npm run dev
```

The site is intentionally built as a small, accessible editorial surface. Project facts link to their canonical GitHub repositories rather than being duplicated locally.

## Repository layout

- `app/` — current editorial application and routes;
- `public/` — current public assets;
- `build/` and `worker/` — hosting integration;
- `tests/` — executable publication checks;
- `docs/` — reviewed governance records.

Historical material predating the current Nomed site is preserved on the `archive/legacy-site-2026-08-02` branch and is intentionally absent from `main`.

New top-level directories require a documented, current responsibility. Do not use `main` as an archive, scratch space, or session store.
