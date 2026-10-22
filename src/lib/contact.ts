// Public form endpoint supplied in the owner's FormSubmit activation email.
export const contactEndpoint = "https://formsubmit.co/ajax/5f600185da3402c8f5c5b0090ac2bf7a";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  _honey: string;
  _url: string;
};

export class ContactDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactDeliveryError";
  }
}

export async function sendContactMessage(
  message: ContactMessage,
  { fetchRequest = fetch, timeoutMs = 20000 }: { fetchRequest?: typeof fetch; timeoutMs?: number } = {},
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchRequest(contactEndpoint, {
      method: "POST",
      // URL-encoded form data avoids an unnecessary cross-origin preflight.
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        ...message,
        _replyto: message.email,
        _subject: "New message from Kajal’s portfolio",
        _template: "table",
      }),
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") throw new Error("Invalid response");
    const receipt = result as { success?: unknown; message?: unknown };
    const providerMessage = typeof receipt.message === "string" ? receipt.message : "";

    // An activation response is not confirmation that the message was delivered.
    if (/activat|confirm.{0,30}(email|form)|check your email/i.test(providerMessage)) {
      throw new ContactDeliveryError("Messaging is temporarily unavailable. Please email me directly. Your message is still here.");
    }
    if (!response.ok || (receipt.success !== true && receipt.success !== "true")) {
      throw new Error("Message was not accepted");
    }
  } catch (error) {
    if (error instanceof ContactDeliveryError) throw error;
    if (controller.signal.aborted) {
      throw new ContactDeliveryError("This is taking too long, so I couldn’t confirm your message was sent. Your message is still here—you can retry or email me directly.");
    }
    throw new ContactDeliveryError("I couldn’t confirm your message was sent. Please try again or email me directly. Your message is still here.");
  } finally {
    clearTimeout(timeout);
  }
}
