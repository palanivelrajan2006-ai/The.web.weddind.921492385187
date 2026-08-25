import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook, Send, CheckCircle } from 'lucide-react';
import { studioConfig } from '@/config/studio';
import { serviceOptions, eventTypeOptions } from '@/data/content';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    (e.target as HTMLFormElement).reset();
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <section id="contact" className="section-py relative overflow-hidden">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-14 text-center">
          <p className="eyebrow mb-6">Get in Touch</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Let's Create Something
            <br />
            <span className="text-gold-300 italic">Worth Remembering.</span>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="reveal lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="card-surface space-y-5 p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" required className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="eventType">Event Type</label>
                  <select id="eventType" name="eventType" className={inputClass} defaultValue="">
                    <option value="" disabled>Select event type</option>
                    {eventTypeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-ink-900">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="eventDate">Event Date</label>
                  <input id="eventDate" name="eventDate" type="date" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="location">Event Location</label>
                  <input id="location" name="location" type="text" className={inputClass} placeholder="City / Venue" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className={labelClass} htmlFor="service">Required Service</label>
                  <select id="service" name="service" className={inputClass} defaultValue="">
                    <option value="" disabled>Select service</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-ink-900">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="days">Number of Days</label>
                  <input id="days" name="days" type="number" min="1" className={inputClass} placeholder="1" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="budget">Approx. Budget</label>
                  <input id="budget" name="budget" type="text" className={inputClass} placeholder="Optional" />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="message">Message / Requirements</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your event, ideas, or requirements..."
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                {submitted ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Inquiry Sent
                  </>
                ) : (
                  <>
                    Send Inquiry <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              {submitted && (
                <p className="text-sm text-gold-300 animate-fade-in">
                  Thank you! We'll get back to you within 24 hours.
                </p>
              )}
            </form>
          </div>

          {/* Contact info */}
          <div className="reveal lg:col-span-2" style={{ transitionDelay: '120ms' }}>
            <div className="card-surface space-y-6 p-6 sm:p-8">
              <h3 className="font-display text-2xl font-medium text-ink-50">
                Contact Information
              </h3>

              <a href={`tel:${studioConfig.contact.phone}`} className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 transition-colors group-hover:border-gold-400">
                  <Phone className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Phone</p>
                  <p className="text-sm text-ink-100 group-hover:text-gold-300 transition-colors">
                    {studioConfig.contact.phone}
                  </p>
                </div>
              </a>

              <a href={`mailto:${studioConfig.contact.email}`} className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 transition-colors group-hover:border-gold-400">
                  <Mail className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Email</p>
                  <p className="text-sm text-ink-100 group-hover:text-gold-300 transition-colors break-all">
                    {studioConfig.contact.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600">
                  <MapPin className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Service Area</p>
                  <p className="text-sm text-ink-100">{studioConfig.contact.serviceArea}</p>
                </div>
              </div>

              {/* Social */}
              <div className="border-t border-ink-700/60 pt-6">
                <p className="mb-4 text-xs uppercase tracking-widest text-ink-400">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href={studioConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                  <a
                    href={studioConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                  <a
                    href={studioConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
