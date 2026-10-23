import { createHmac, randomBytes } from "node:crypto";

const SITE_ORIGIN = "https://kajal-portfolio-brown.vercel.app";
const PROVIDER_URL = "https://formsubmit.co/ajax/5f600185da3402c8f5c5b0090ac2bf7a";
const MAX_BYTES = 24_000;
const FAILURE = "I couldn’t send your message right now. Your message is still here—please try again shortly.";

function json(status: number, body: object, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

// Read a bounded body, including when the caller omits Content-Length.
async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

export function createContactHandler({
  fetchRequest = fetch,
  timeoutMs = 10_000,
  now = Date.now,
  development = false,
}: { fetchRequest?: typeof fetch; timeoutMs?: number; now?: () => number; development?: boolean } = {}) {
  // A small, instance-local abuse guard. No IP addresses or message bodies are logged or stored.
  // FormSubmit also applies its own anti-abuse checks; this is not a distributed rate limit.
  const salt = randomBytes(32);
  const requests = new Map<string, { count: number; expires: number }>();

  return async function handleContact(request: Request): Promise<Response> {
    if (request.method !== "POST") return json(405, { success: false }, { Allow: "POST" });
    const origin = request.headers.get("origin");
    const allowed = origin === SITE_ORIGIN || (development && ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin ?? ""));
    if (!allowed) return json(403, { success: false, message: "Please send your message from the portfolio contact form." });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json(415, { success: false, message: "Please refresh the page and try again." });
    }

    const time = now();
    for (const [key, value] of requests) if (value.expires <= time) requests.delete(key);
    const ip = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "local";
    const key = createHmac("sha256", salt).update(ip.split(",")[0].trim()).digest("hex");
    const quota = requests.get(key) ?? { count: 0, expires: time + 60_000 };
    if (quota.count >= 5 || requests.size >= 5000) {
      return json(429, { success: false, message: "Please wait a minute before sending another message. Your message is still here." }, { "Retry-After": "60" });
    }
    quota.count++;
    requests.set(key, quota);

    let input: unknown;
    try { input = await readBody(request); }
    catch (error) { return json(error instanceof RangeError ? 413 : 400, { success: false, message: "Please check your message and try again." }); }
    if (!input || typeof input !== "object" || Array.isArray(input)) return json(400, { success: false });
    const fields = input as Record<string, unknown>;
    if (typeof fields._honey === "string" && fields._honey.trim()) return json(400, { success: false });
    const name = typeof fields.name === "string" ? fields.name.trim() : "";
    const email = typeof fields.email === "string" ? fields.email.trim() : "";
    const message = typeof fields.message === "string" ? fields.message.trim() : "";
    if (!name || name.length > 100 || /[\r\n]/.test(name)
      || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !message || message.length > 5000) {
      return json(400, { success: false, message: "Please enter your name, a valid email address, and a message." });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchRequest(PROVIDER_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", Origin: SITE_ORIGIN, Referer: `${SITE_ORIGIN}/` },
        // The recipient, origin, and subject are fixed here, never supplied by a visitor.
        body: JSON.stringify({ name, email, message, _replyto: email, _subject: "New message from Kajal’s portfolio", _template: "table", _url: `${SITE_ORIGIN}/`, _honey: "" }),
        signal: controller.signal,
      });
      const receipt = await response.json() as { success?: unknown; message?: unknown } | null;
      const providerMessage = typeof receipt?.message === "string" ? receipt.message : "";
      if (/activat|confirm.{0,30}(email|form)|check your email/i.test(providerMessage)) {
        return json(503, { success: false, code: "activation_required", message: "The contact form is temporarily unavailable. Your message is still here; you can email me directly." });
      }
      if (!response.ok || !receipt || (receipt.success !== true && receipt.success !== "true")) {
        return json(502, { success: false, message: FAILURE });
      }
      return json(200, { success: true });
    } catch {
      return json(controller.signal.aborted ? 504 : 502, {
        success: false,
        message: controller.signal.aborted
          ? "Delivery is taking longer than expected, so I couldn’t confirm it. Your message is still here."
          : FAILURE,
      });
    } finally { clearTimeout(timeout); }
  };
}
