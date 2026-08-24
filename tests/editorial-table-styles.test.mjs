import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = new URL("../app/editorial-tables.css", import.meta.url);

test("defines a global editorial data-grid treatment", async () => {
  const css = await readFile(stylesheet, "utf8");

  assert.match(css, /\.editorial-body > table\s*\{/);
  assert.match(css, /border-top:\s*6px solid var\(--ink\)/);
  assert.match(css, /\.editorial-body > table th:first-child[\s\S]*width:\s*24%/);
  assert.match(css, /\.editorial-body > table th:first-child[\s\S]*border-right:\s*1px solid var\(--line\)/);
  assert.match(css, /\.editorial-body > table th:nth-child\(2\)[\s\S]*padding-left:\s*1\.5rem/);
  assert.match(css, /\.editorial-body > table td:first-child[\s\S]*font-weight:\s*720/);
  assert.match(css, /tbody tr:hover/);
  assert.match(css, /color-mix\(in srgb, var\(--page-accent\) 7%, var\(--paper\)\)/);
});

test("keeps editorial tables semantic and horizontally usable on narrow screens", async () => {
  const css = await readFile(stylesheet, "utf8");

  assert.match(css, /@media \(max-width: 800px\)/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-width:\s*720px/);
  assert.doesNotMatch(css, /display:\s*grid[^}]*\.editorial-body > table/);
});
