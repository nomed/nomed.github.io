import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const outputDirectory = new URL("../out/", import.meta.url);
const routes = [
  "/",
  "/manifesto/",
  "/work/",
  "/system/",
  "/system/mcp/",
  "/system/projects/",
  "/system/coordination/",
  "/writing/",
  "/writing/capability-not-custody/",
  "/brand/",
];
const repositories = new Set([
  "https://github.com/nomed/yukh-mcp",
  "https://github.com/nomed/yukh-projects",
  "https://github.com/nomed/yukh-coordination",
]);
const externalFontHosts = /fonts\.(?:googleapis|gstatic)\.com/i;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

let origin;
let server;

function extractReferences(html) {
  return [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
}

function hasFragment(html, fragment) {
  const id = decodeURIComponent(fragment.slice(1)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\bid="${id}"`).test(html);
}

async function resolveStaticFile(pathname) {
  const relativePath = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, "");
  const candidates = pathname.endsWith("/")
    ? [join(relativePath, "index.html")]
    : [relativePath, `${relativePath}.html`, join(relativePath, "index.html")];

  for (const candidate of candidates) {
    const file = new URL(candidate || "index.html", outputDirectory);
    if (!file.href.startsWith(outputDirectory.href)) continue;

    try {
      if ((await stat(file)).isFile()) return file;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  return null;
}

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, "http://localhost").pathname;
      const file = await resolveStaticFile(pathname);

      if (!file) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "content-type": contentTypes[extname(fileURLToPath(file))] ?? "application/octet-stream",
      });
      response.end(await readFile(file));
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : "Unknown error");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");
  origin = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("serves every primary route from the static build", async () => {
  for (const route of routes) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/, route);
    assert.match(await response.text(), /<main(?:\s|>)/, route);
  }
});

test("keeps every internal page, fragment, and asset reachable", async () => {
  const checked = new Set();

  for (const route of routes) {
    const pageUrl = new URL(route, origin);
    const html = await fetch(pageUrl).then((response) => response.text());

    for (const reference of extractReferences(html)) {
      const target = new URL(reference, pageUrl);
      if (target.origin !== origin) continue;

      const key = `${target.pathname}${target.hash}`;
      if (checked.has(key)) continue;
      checked.add(key);

      const response = await fetch(target);
      assert.equal(response.status, 200, `${route} -> ${reference}`);

      if (target.hash) {
        assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/, reference);
        assert.ok(hasFragment(await response.text(), target.hash), `${reference} has a matching id`);
      }
    }
  }
});

test("links to all three canonical Yukh repositories without network access", async () => {
  const discovered = new Set();

  for (const route of routes) {
    const html = await fetch(`${origin}${route}`).then((response) => response.text());
    for (const reference of extractReferences(html)) {
      const canonical = reference.replace(/\/$/, "");
      if (repositories.has(canonical)) discovered.add(canonical);
    }
  }

  assert.deepEqual(discovered, repositories);
});

test("does not publish external Google Font references", async () => {
  const files = await readdir(outputDirectory, { recursive: true, withFileTypes: true });

  for (const file of files) {
    if (!file.isFile() || !/\.(?:css|html|js|json|txt|xml)$/i.test(file.name)) continue;

    const contents = await readFile(join(file.parentPath, file.name), "utf8");
    assert.doesNotMatch(contents, externalFontHosts, join(file.parentPath, file.name));
  }
});
