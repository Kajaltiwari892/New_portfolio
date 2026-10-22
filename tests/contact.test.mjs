import test from "node:test";
import assert from "node:assert/strict";
import { ContactDeliveryError, contactEndpoint, sendContactMessage } from "../src/lib/contact.ts";

const message = { name: "Visitor", email: "visitor@example.com", message: "Hello Kajal", _honey: "", _url: "https://portfolio.example/#contact" };
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

test("sends the visitor's message and reply-to address to the AJAX endpoint", async () => {
  let request;
  await sendContactMessage(message, { fetchRequest: async (url, options) => { request = { url, options }; return jsonResponse({ success: "true", message: "Email sent successfully" }); } });
  assert.equal(request.url, contactEndpoint);
  assert.match(request.url, /^https:\/\/formsubmit\.co\/ajax\//);
  assert.equal(request.options.method, "POST");
  assert.ok(request.options.body instanceof URLSearchParams);
  assert.equal(request.options.headers["Content-Type"], undefined);
  const body = Object.fromEntries(request.options.body);
  assert.equal(body.name, message.name);
  assert.equal(body.email, message.email);
  assert.equal(body.message, message.message);
  assert.equal(body._replyto, message.email);
  assert.equal(body._url, message._url);
  assert.equal(body._honey, "");
  assert.equal(body._next, undefined);
  assert.equal(body._captcha, undefined);
});

test("accepts a boolean success receipt", async () => {
  await sendContactMessage(message, { fetchRequest: async () => jsonResponse({ success: true }) });
});

test("does not mistake string false or an unknown receipt for success", async () => {
  for (const receipt of [{ success: "false" }, { success: false }, {}, null, { success: 1 }]) {
    await assert.rejects(sendContactMessage(message, { fetchRequest: async () => jsonResponse(receipt) }), ContactDeliveryError);
  }
});

test("activation requests are not reported as sent even with HTTP 200 and success true", async () => {
  await assert.rejects(sendContactMessage(message, { fetchRequest: async () => jsonResponse({ success: true, message: "This form needs activation. Check your email." }) }), /temporarily unavailable/);
});

test("HTTP errors are never reported as success", async () => {
  await assert.rejects(sendContactMessage(message, { fetchRequest: async () => jsonResponse({ success: true }, 503) }), ContactDeliveryError);
});

test("HTML error responses produce a useful error instead of a false success", async () => {
  await assert.rejects(sendContactMessage(message, { fetchRequest: async () => new Response("<html>Service unavailable</html>") }), /couldn’t confirm/);
});

test("network failures preserve a retryable error", async () => {
  await assert.rejects(sendContactMessage(message, { fetchRequest: async () => { throw new TypeError("Failed to fetch"); } }), /Your message is still here/);
});

test("a stalled request is aborted and does not claim delivery", async () => {
  await assert.rejects(sendContactMessage(message, {
    timeoutMs: 10,
    fetchRequest: async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true })),
  }), /couldn’t confirm/);
});
