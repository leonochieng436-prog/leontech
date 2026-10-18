"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ServiceOption = { slug: string; title: string };

export function ContactForm({ initialService = "", initialDescription = "", services }: { initialService?: string; initialDescription?: string; services: ServiceOption[] }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t submit your request. Please try again.");
      setStatus("success");
      setMessage(`Thanks for reaching out. Your inquiry reference is ${result.reference}. We’ll be in touch soon.`);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="field"><label htmlFor="fullName">Your name *</label><input id="fullName" name="fullName" required minLength={2} maxLength={100} autoComplete="name" /></div>
    <div className="field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email" /></div>
    <div className="field"><label htmlFor="phone">Phone (optional)</label><input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" /></div>
    <div className="field"><label htmlFor="company">Company (optional)</label><input id="company" name="company" maxLength={120} autoComplete="organization" /></div>
    <div className="field"><label htmlFor="service">What can we help with?</label><select id="service" name="service" defaultValue={initialService}><option value="">Choose a service</option>{services.map(({ slug, title }) => <option value={slug} key={slug}>{title}</option>)}</select></div>
    <div className="field"><label htmlFor="budget">Estimated budget</label><select id="budget" name="budget"><option value="">Select a range</option><option value="Under KES 100,000">Under KES 100,000</option><option value="KES 100,000–500,000">KES 100,000–500,000</option><option value="KES 500,000–1,500,000">KES 500,000–1,500,000</option><option value="KES 1,500,000+">KES 1,500,000+</option><option value="Not sure yet">Not sure yet</option></select></div>
    <div className="field"><label htmlFor="timeline">Project timeline</label><select id="timeline" name="timeline"><option value="">Choose a timeframe</option><option value="As soon as possible">As soon as possible</option><option value="Within 1–3 months">Within 1–3 months</option><option value="Within 3–6 months">Within 3–6 months</option><option value="More than 6 months">More than 6 months</option><option value="Flexible / exploring">Flexible / exploring</option></select></div>
    <div className="field"><label htmlFor="preferredContactMethod">Preferred contact</label><select id="preferredContactMethod" name="preferredContactMethod" defaultValue="EMAIL"><option value="EMAIL">Email</option><option value="PHONE">Phone</option><option value="WHATSAPP">WhatsApp</option></select></div>
    <div className="field full"><label htmlFor="description">Tell us a little about your project *</label><textarea id="description" name="description" required minLength={20} maxLength={5000} defaultValue={initialDescription} placeholder="What are you hoping to build or improve?" /></div>
    <div className="field full"><label htmlFor="website">Leave blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" /></div>
    <label className="form-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree that Leon.Tech may use my details to respond to this inquiry. See our <Link href="/privacy-policy">privacy policy</Link>.</span></label>
    {message && <p className={`form-message ${status}`} role="status">{message}</p>}
    <button className="button button-lime form-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : status === "success" ? "Send another inquiry" : "Send inquiry"} <ArrowUpRight size={15} /></button>
  </form>;
}
