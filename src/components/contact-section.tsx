import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert, LoaderCircle, Mail, Send } from "lucide-react";
import { profile } from "@/portfolio-content";
import { GitHubIcon, LinkedInIcon } from "@/components/social-icons";
import { sendContactMessage } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const requestPending = useRef(false);
  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestPending.current) return;
    const form = event.currentTarget;
    for (const name of ["name", "message"]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? "" : "Please fill out this field.");
      if (!field.validity.valid) {
        field.reportValidity();
        return;
      }
    }
    const data = new FormData(form);
    requestPending.current = true;
    setStatus("sending");
    setErrorMessage("");
    try {
      await sendContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? "").trim(),
        message: String(data.get("message") ?? ""),
        _honey: String(data.get("_honey") ?? ""),
      });
      form.reset();
      setStatus("success");
      trackEvent("contact_submit_accepted", "contact");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setStatus("error");
      trackEvent("contact_submit_failed", "contact");
    } finally {
      requestPending.current = false;
    }
  };

  return <div className="contact-studio">
    <div className="contact-studio-copy">
      <span className="contact-overline">A PROJECT, A ROLE, OR A HELLO</span>
      <h3>Have something<br /><em>in mind?</em></h3>
      <p>I’d love to hear about it. Leave a message and I’ll get back to you.</p>
      <div className="contact-direct">
        <span>Prefer email?</span>
        <a href={`mailto:${profile.email}`}><Mail size={19} aria-hidden="true" /><span>{profile.email}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <div className="contact-social-links">
        {profile.linkedin && <a data-analytics-event="social_click" data-analytics-target="linkedin" href={profile.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon size={16} />LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>}
        {profile.github && <a data-analytics-event="social_click" data-analytics-target="github" href={profile.github} target="_blank" rel="noreferrer"><GitHubIcon size={16} />GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>}
      </div>
    </div>

    <form onFocusCapture={() => trackEvent("contact_start", "contact", true)} className="contact-message-form" onSubmit={submitMessage} onChange={() => { if (status !== "sending") setStatus("idle"); }} aria-labelledby="contact-form-heading" aria-busy={status === "sending"}>
      <div className="contact-form-heading"><h3 id="contact-form-heading">Send a message</h3><p>I’ll reply to the email you leave below.</p></div>
      <input type="text" name="_honey" className="contact-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="contact-field-row">
        <div className="contact-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" placeholder="Your name" autoComplete="name" maxLength={100} required disabled={status === "sending"} onInput={event => event.currentTarget.setCustomValidity("")} /></div>
        <div className="contact-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required disabled={status === "sending"} /></div>
      </div>
      <div className="contact-field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" placeholder="Tell me a little about what you have in mind…" rows={6} maxLength={5000} required disabled={status === "sending"} onInput={event => event.currentTarget.setCustomValidity("")} /></div>
      <div className="contact-form-bottom"><button type="submit" disabled={status === "sending"}>{status === "sending" ? <>Sending… <LoaderCircle className="contact-spinner" size={16} aria-hidden="true" /></> : <>Send message <Send size={16} aria-hidden="true" /></>}</button><p>Delivered through <a href="https://formsubmit.co/" target="_blank" rel="noreferrer">FormSubmit</a>.</p></div>
      <div className="contact-feedback" data-state={status} role="status" aria-live="polite" aria-atomic="true">
        {status === "success" && <><CheckCircle2 size={20} aria-hidden="true" /><p>Message sent. Thanks for reaching out—I’ll get back to you soon.</p></>}
        {status === "error" && <><CircleAlert size={20} aria-hidden="true" /><p>{errorMessage} <a href={`mailto:${profile.email}`}>Email me directly <ArrowUpRight size={13} aria-hidden="true" /></a></p></>}
      </div>
    </form>
  </div>;
}
