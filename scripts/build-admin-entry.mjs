import { mkdir, readFile, writeFile } from "node:fs/promises";
await mkdir(new URL("../dist/admin/", import.meta.url), { recursive: true });
const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
await writeFile(new URL("../dist/admin/index.html", import.meta.url), html
  .replace("<head>", '<head>\n    <meta name="robots" content="noindex, nofollow" />')
  .replace(/<title>.*?<\/title>/, "<title>Private analytics - Kajal Tiwari</title>")
  .replace(/\s*<link rel="preload" href="\/assets\/kajal-portrait.png"[^>]*>/, ""));
