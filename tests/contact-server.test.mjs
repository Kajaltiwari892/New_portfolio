import test from "node:test";
import assert from "node:assert/strict";
import { createContactHandler } from "../server/contact.ts";

const origin = "https://kajal-portfolio-brown.vercel.app";
const message = { name: " Visitor ", email: "visitor@example.com", message: " Hello Kajal ", _honey: "" };
const request = (body = message, headers = {}) => new Request(`${origin}/api/contact`, {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body: JSON.stringify(body),
});
const receipt = (body = { success: "true" }, status = 200) => Response.json(body, { status });

test("forwards validated content with a fixed origin and recipient, and preserves reply-to", async () => {
  let forwarded;
  const handler = createContactHandler({ fetchRequest: async (url, options) => { forwarded = { url, options }; return receipt(); } });
  const response = await handler(request({ ...message, _url: "https://attacker.example", _replyto: "other@example.com", _subject: "injected", _cc: "other@example.com", _captcha: "false" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(forwarded.url, "https://formsubmit.co/ajax/5f600185da3402c8f5c5b0090ac2bf7a");
  const data = JSON.parse(forwarded.options.body);
  assert.deepEqual(data, { name: "Visitor", email: message.email, message: "Hello Kajal", _replyto: message.email, _subject: "New message from Kajal’s portfolio", _template: "table", _url: `${origin}/`, _honey: "" });
  assert.equal(forwarded.options.headers.Referer, `${origin}/`);
  assert.equal(forwarded.options.headers.Origin, origin);
});

test("refuses unexpected methods, origins, and content types before contacting the provider", async () => {
  const handler = createContactHandler({ fetchRequest: async () => assert.fail("must not send") });
  assert.equal((await handler(new Request(`${origin}/api/contact`))).status, 405);
  assert.equal((await handler(request(message, { Origin: "https://elsewhere.example" }))).status, 403);
  assert.equal((await handler(request(message, { Origin: "null" }))).status, 403);
  assert.equal((await handler(request(message, { "Content-Type": "text/plain" }))).status, 415);
});

test("invalid, oversized, and honeypot submissions never send email", async () => {
  for (const body of [null, [], { ...message, name: " " }, { ...message, name: "x\r\nBCC: someone" }, { ...message, email: "invalid" }, { ...message, email: "a@example.com\nBcc: b@example.com" }, { ...message, message: "" }, { ...message, message: "x".repeat(5001) }, { ...message, _honey: "bot" }]) {
    const handler = createContactHandler({ fetchRequest: async () => assert.fail("must not send") });
    assert.equal((await handler(request(body))).status, 400);
  }
  const handler = createContactHandler({ fetchRequest: async () => assert.fail("must not send") });
  assert.equal((await handler(request({ ...message, message: "x".repeat(25000) }))).status, 413);
  assert.equal((await handler(new Request(`${origin}/api/contact`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{" }))).status, 400);
});

test("activation is a setup error, never a delivery confirmation", async () => {
  const handler = createContactHandler({ fetchRequest: async () => receipt({ success: "true", message: "This form needs Activation. Check your email." }) });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "activation_required");
});

test("provider errors, HTML, and false receipts never report success", async () => {
  for (const result of [{ success: "false" }, { success: false }, null, {}, { success: 1 }]) {
    const handler = createContactHandler({ fetchRequest: async () => receipt(result) });
    assert.equal((await handler(request())).status, 502);
  }
  for (const result of [new Response("<html>unavailable</html>"), receipt({ success: true }, 503)]) {
    const handler = createContactHandler({ fetchRequest: async () => result });
    assert.equal((await handler(request())).status, 502);
  }
});

test("a stalled provider is aborted without an automatic retry or a false success", async () => {
  let calls = 0;
  const handler = createContactHandler({ timeoutMs: 5, fetchRequest: async (_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
  } });
  const response = await handler(request());
  assert.equal(response.status, 504);
  assert.equal((await response.json()).success, false);
  assert.equal(calls, 1);
});

test("the local abuse limit blocks bursts and expires after one minute", async () => {
  let time = 0;
  let calls = 0;
  const handler = createContactHandler({ now: () => time, fetchRequest: async () => { calls++; return receipt(); } });
  for (let i = 0; i < 5; i++) assert.equal((await handler(request())).status, 200);
  const blocked = await handler(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("retry-after"), "60");
  assert.equal(calls, 5);
  time = 60_001;
  assert.equal((await handler(request())).status, 200);
});

test("localhost is accepted only by the development handler", async () => {
  const production = createContactHandler({ fetchRequest: async () => assert.fail("must not send") });
  assert.equal((await production(request(message, { Origin: "http://localhost:5173" }))).status, 403);
  const local = createContactHandler({ development: true, fetchRequest: async () => receipt() });
  assert.equal((await local(request(message, { Origin: "http://localhost:5173" }))).status, 200);
});
