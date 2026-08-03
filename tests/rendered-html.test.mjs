import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Nomed editorial home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en"/i);
  assert.match(html, /<title>Nomed — Governed Agentic Development<\/title>/i);
  assert.match(
    html,
    /Software is no longer written by one mind at one keyboard\./,
  );
  assert.match(html, /Agents should gain capability without gaining custody\./);
  assert.match(html, /Yukh MCP/);
  assert.match(html, /Yukh Projects/);
  assert.match(html, /Yukh Coordination/);
  assert.match(html, /src="\/brand\/nomed\.svg"/);
  assert.match(html, /src="\/brand\/yukh-mcp\.svg"/);
  assert.match(html, /src="\/brand\/yukh-projects\.svg"/);
  assert.match(html, /src="\/brand\/yukh-coordination\.svg"/);
});

test("renders the public editorial system with truthful maturity labels", async () => {
  const routes = [
    ["/manifesto/", /Plans before mutations\./],
    ["/work/", /Foundation bootstrap/],
    ["/system/", /Three boundaries\. One governed flow\./],
    ["/system/mcp/", /Capability without custody\./],
    ["/system/projects/", /Declared state\. Deterministic reconciliation\./],
    ["/system/coordination/", /A shared room for work that happens in separate minds\./],
    ["/writing/", /Ideas tested against the work\./],
    ["/writing/capability-not-custody/", /A capability is a contract/],
    ["/brand/", /One geometry\. Distinct responsibilities\./],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }
});

test("publishes stable identity and predictable internal navigation", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(
    html,
    /name="description" content="Open infrastructure for governed agentic development:/,
  );
  assert.match(html, /property="og:image" content="https:\/\/nomed\.github\.io\/og\.png"/);
  assert.match(html, /href="\/system\/mcp\/"/);
  assert.match(html, /href="\/system\/projects\/"/);
  assert.match(html, /href="\/system\/coordination\/"/);
  assert.match(html, /href="\/work\/"/);
  assert.match(html, /href="\/writing\/"/);
  assert.match(html, /<nav aria-label="Primary navigation">/);
  assert.match(html, /<main>/);
  assert.doesNotMatch(html, /↗|→|↓/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("publishes stable work anchors and explicit repository exits", async () => {
  const response = await render("/work/");
  const html = await response.text();

  assert.match(html, /id="yukh-mcp"/);
  assert.match(html, /id="yukh-projects"/);
  assert.match(html, /id="yukh-coordination"/);
  assert.match(html, /href="\/system\/mcp\/"/);
  assert.match(html, /href="\/system\/projects\/"/);
  assert.match(html, /href="\/system\/coordination\/"/);
  assert.match(html, /href="https:\/\/github\.com\/nomed\/yukh-mcp" target="_blank"/);
  assert.match(html, /class="github-icon"/);
});

test("every Yukh deep dive publishes the same editorial contract", async () => {
  for (const pathname of ["/system/mcp/", "/system/projects/", "/system/coordination/"]) {
    const response = await render(pathname);
    const html = await response.text();

    assert.equal(response.status, 200, pathname);
    assert.match(html, /The problem/, pathname);
    assert.match(html, /Responsibility/, pathname);
    assert.match(html, /Authority boundary/, pathname);
    assert.match(html, /Public contracts/, pathname);
    assert.match(html, /How it interacts/, pathname);
    assert.match(html, /Next direction/, pathname);
    assert.match(html, /aria-label="Breadcrumb"/, pathname);
    assert.match(html, /aria-label="Yukh components"/, pathname);
    assert.match(html, /class="repository-link"/, pathname);
    assert.match(html, /target="_blank"/, pathname);
  }
});

test("orders the homepage as position, Yukh system, work and research", async () => {
  const response = await render();
  const html = await response.text();
  const markers = ["01 / Position", "02 / Yukh system", "03 / Work", "04 / Research signal"];
  const offsets = markers.map((marker) => html.indexOf(marker));

  assert.ok(offsets.every((offset) => offset >= 0));
  assert.deepEqual(offsets, [...offsets].sort((a, b) => a - b));
});

test("uses a paper-safe Coordination tone for small Yukh copy", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/globals.css", import.meta.url), "utf8"));
  assert.match(css, /--paper:\s*#f4f1e8/);
  assert.match(css, /--coordination-ink:\s*#596b00/);
  assert.match(css, /\.yukh-intro \.kicker\s*{\s*color:\s*var\(--coordination-ink\)/);
});

test("keeps the public voice free of third-person corporate copy", async () => {
  const { readFile } = await import("node:fs/promises");
  const [home, readme] = await Promise.all([
    render().then((response) => response.text()),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  const publicCopy = `${home}\n${readme}`;

  assert.doesNotMatch(publicCopy, /Nomed (?:builds|is building|designs|explores|works in the open)/i);
  assert.doesNotMatch(publicCopy, /build(?:ing|s)? in public/i);
});

test("does not repeat the Yukh prefix inside the established System index", async () => {
  const response = await render("/system/");
  const html = await response.text();
  const visibleText = html.replace(/<[^>]*>/g, "");

  assert.match(visibleText, /03\.1 \/ MCP/);
  assert.match(visibleText, /03\.2 \/ Projects/);
  assert.match(visibleText, /03\.3 \/ Coordination/);
  assert.doesNotMatch(visibleText, /03\.[123] \/ Yukh/);
});

test("does not publish the former Projects route", async () => {
  const response = await render("/projects/");
  assert.equal(response.status, 404);
});
