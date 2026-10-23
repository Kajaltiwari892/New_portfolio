// FormSubmit's documented browser API. Server-to-server requests are rejected.
export const contactEndpoint = "https://formsubmit.co/ajax/5f600185da3402c8f5c5b0090ac2bf7a";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  _honey: string;
};

export class ContactDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactDeliveryError";
  }
}

export async function sendContactMessage(
  message: ContactMessage,
  { fetchRequest = fetch, timeoutMs = 15000 }: { fetchRequest?: typeof fetch; timeoutMs?: number } = {},
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchRequest(contactEndpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        name: message.name,
        email: message.email,
        message: message.message,
        _honey: message._honey,
        _replyto: message.email,
        _subject: "New message from Kajal’s portfolio",
        _template: "table",
        // Use the activated form URL, including for localhost and hash navigation.
        _url: "https://kajal-portfolio-brown.vercel.app/",
      }),
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") throw new Error("Invalid response");
    const receipt = result as { success?: unknown; message?: unknown };
    const providerMessage = typeof receipt.message === "string" ? receipt.message : "";

    // A provider/setup failure must never be presented as a successful send.
    if (/activat|confirm.{0,30}(email|form)|check your email/i.test(providerMessage)) {
      throw new ContactDeliveryError("Messaging is temporarily unavailable. Please email me directly. Your message is still here.");
    }
    if (!response.ok || (receipt.success !== true && receipt.success !== "true")) {
      throw new ContactDeliveryError(response.status === 429
        ? "Please wait a minute before sending again. Your message is still here."
        : "I couldn’t send your message. Your message is still here—please try again shortly.");
    }
  } catch (error) {
    if (error instanceof ContactDeliveryError) throw error;
    if (controller.signal.aborted) {
      throw new ContactDeliveryError("The connection timed out, so I couldn’t confirm delivery. Your message is still here.");
    }
    throw new ContactDeliveryError("I couldn’t confirm your message was sent. Please try again or email me directly. Your message is still here.");
  } finally {
    clearTimeout(timeout);
  }
}
