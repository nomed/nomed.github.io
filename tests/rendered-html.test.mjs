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
    ["/projects/", /Foundation bootstrap/],
    ["/system/", /Three boundaries\. One governed flow\./],
    ["/system/mcp/", /Capability without custody\./],
    ["/system/projects/", /Declared state, reconciled in the open\./],
    ["/system/coordination/", /A shared room for work that happens in separate minds\./],
    ["/writing/capability-not-custody/", /A capability is a contract/],
    ["/brand/", /One geometry\. Distinct responsibilities\./],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }
});

test("publishes stable identity, social and project links", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(
    html,
    /name="description" content="Nomed designs open infrastructure for governed agentic development:/,
  );
  assert.match(html, /property="og:image" content="https:\/\/nomed\.github\.io\/og\.png"/);
  assert.match(html, /href="https:\/\/github\.com\/nomed\/yukh-mcp"/);
  assert.match(html, /href="https:\/\/github\.com\/nomed\/yukh-projects"/);
  assert.match(html, /<nav aria-label="Primary navigation">/);
  assert.match(html, /<main>/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("publishes stable anchors for every current Yukh component", async () => {
  const response = await render("/projects/");
  const html = await response.text();

  assert.match(html, /id="yukh-mcp"/);
  assert.match(html, /id="yukh-projects"/);
  assert.match(html, /id="yukh-coordination"/);
  assert.match(html, /href="\/system\/mcp"/);
  assert.match(html, /href="\/system\/projects"/);
  assert.match(html, /href="\/system\/coordination"/);
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
  }
});

test("redirects the legacy coordination route permanently", async () => {
  const response = await render("/coordination/");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "http://localhost/system/coordination/");
});
