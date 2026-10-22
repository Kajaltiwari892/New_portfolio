import type { FormEvent } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { profile } from "@/portfolio-content";

const thankYouUrl = "https://motion-portfolio-studio.kuldeep-tiwari934919.chatgpt.site/thanks.html";

export function ContactSection() {
  const validateMessage = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    for (const name of ["name", "message"]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? "" : "Please fill out this field.");
      if (!field.validity.valid) {
        event.preventDefault();
        field.reportValidity();
        return;
      }
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
        {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>}
        {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>}
      </div>
    </div>

    <form className="contact-message-form" action={`https://formsubmit.co/${profile.email}`} method="POST" onSubmit={validateMessage} aria-labelledby="contact-form-heading">
      <div className="contact-form-heading"><h3 id="contact-form-heading">Send a message</h3><p>I’ll reply to the email you leave below.</p></div>
      <input type="hidden" name="_subject" value="New message from Kajal’s portfolio" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={thankYouUrl} />
      <input type="text" name="_honey" className="contact-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="contact-field-row">
        <div className="contact-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" placeholder="Your name" autoComplete="name" maxLength={100} required onInput={event => event.currentTarget.setCustomValidity("")} /></div>
        <div className="contact-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required /></div>
      </div>
      <div className="contact-field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" placeholder="Tell me a little about what you have in mind…" rows={6} maxLength={5000} required onInput={event => event.currentTarget.setCustomValidity("")} /></div>
      <div className="contact-form-bottom"><button type="submit">Send message <Send size={16} aria-hidden="true" /></button><p>Delivered through <a href="https://formsubmit.co/" target="_blank" rel="noreferrer">FormSubmit</a>.</p></div>
    </form>
  </div>;
}
