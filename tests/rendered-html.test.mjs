import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
