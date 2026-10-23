import type { Plugin } from "vite";
import { createContactHandler } from "./contact.ts";

export function contactApi(): Plugin {
  const handleContact = createContactHandler({ development: true });
  return {
    name: "portfolio-contact-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/contact") { next(); return; }
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            const buffer = Buffer.from(chunk);
            size += buffer.length;
            if (size > 24_000) { res.writeHead(413).end(); return; }
            chunks.push(buffer);
          }
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) if (value) headers.set(name, Array.isArray(value) ? value.join(",") : value);
          const response = await handleContact(new Request("http://localhost:5173/api/contact", {
            method: req.method, headers,
            ...(req.method === "POST" ? { body: Buffer.concat(chunks).toString("utf8") } : {}),
          }));
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(await response.text());
        } catch { res.writeHead(500, { "Content-Type": "application/json" }).end('{"success":false}'); }
      });
    },
  };
}
