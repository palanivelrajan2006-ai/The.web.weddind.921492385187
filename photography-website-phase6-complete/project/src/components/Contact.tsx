import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { serviceOptions, eventTypeOptions } from '@/data/content';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { submitBooking, type BookingFormInput } from '@/lib/bookings';

type SubmitState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success'; reference: string }
  | { phase: 'error'; message: string };

export default function Contact() {
  const { settings } = useBusinessSettings();
  const [state, setState] = useState<SubmitState>({ phase: 'idle' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.phase === 'submitting') return; // guard against double-click

    const form = e.currentTarget;
    const data = new FormData(form);
    const input: BookingFormInput = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      email: String(data.get('email') ?? ''),
      eventType: String(data.get('eventType') ?? ''),
      eventDate: String(data.get('eventDate') ?? ''),
      eventLocation: String(data.get('location') ?? ''),
      service: String(data.get('service') ?? ''),
      numberOfFunctions: String(data.get('days') ?? ''),
      budget: String(data.get('budget') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    setState({ phase: 'submitting' });
    const result = await submitBooking(input);

    if (result.ok) {
      setState({ phase: 'success', reference: result.booking.booking_reference });
      form.reset();
    } else {
      setState({ phase: 'error', message: result.message });
    }
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 disabled:opacity-50';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';
  const whatsappHref = `https://wa.me/${settings.whatsapp}`;

  const isSubmitting = state.phase === 'submitting';

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
            {state.phase === 'success' ? (
              <div className="card-surface flex flex-col items-center gap-4 p-8 text-center sm:p-12 animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/40 bg-gold-500/10">
                  <CheckCircle className="h-8 w-8 text-gold-300" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-medium text-ink-50 sm:text-3xl">
                  Thank You
                </h3>
                <p className="text-sm text-ink-200">Your enquiry has been received.</p>
                <p className="rounded-full border border-gold-400/40 bg-gold-500/10 px-5 py-2 text-sm font-medium tracking-wide text-gold-300">
                  Booking Reference: {state.reference}
                </p>
                <p className="text-sm text-ink-300">Our team will contact you shortly.</p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-2"
                >
                  Chat with us on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setState({ phase: 'idle' })}
                  className="text-xs uppercase tracking-widest text-ink-400 hover:text-gold-300 transition-colors"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="name">Full Name</label>
                    <input id="name" name="name" type="text" required disabled={isSubmitting} className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" required disabled={isSubmitting} className={inputClass} placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" disabled={isSubmitting} className={inputClass} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="eventType">Event Type</label>
                    <select id="eventType" name="eventType" required disabled={isSubmitting} className={inputClass} defaultValue="">
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
                    <input id="eventDate" name="eventDate" type="date" disabled={isSubmitting} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="location">Event Location</label>
                    <input id="location" name="location" type="text" disabled={isSubmitting} className={inputClass} placeholder="City / Venue" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label className={labelClass} htmlFor="service">Required Service</label>
                    <select id="service" name="service" disabled={isSubmitting} className={inputClass} defaultValue="">
                      <option value="" disabled>Select service</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-ink-900">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="days">Number of Days</label>
                    <input id="days" name="days" type="number" min="1" disabled={isSubmitting} className={inputClass} placeholder="1" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="budget">Approx. Budget</label>
                    <input id="budget" name="budget" type="text" disabled={isSubmitting} className={inputClass} placeholder="Optional" />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="message">Message / Requirements</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled={isSubmitting}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your event, ideas, or requirements..."
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? (
                    'Submitting your enquiry...'
                  ) : (
                    <>
                      Send Inquiry <Send className="h-4 w-4" />
                    </>
                  )}
                </button>

                {state.phase === 'error' && (
                  <p className="flex items-center gap-2 text-sm text-red-400 animate-fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {state.message}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="reveal lg:col-span-2" style={{ transitionDelay: '120ms' }}>
            <div className="card-surface space-y-6 p-6 sm:p-8">
              <h3 className="font-display text-2xl font-medium text-ink-50">
                Contact Information
              </h3>

              <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 transition-colors group-hover:border-gold-400">
                  <Phone className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Phone</p>
                  <p className="text-sm text-ink-100 group-hover:text-gold-300 transition-colors">
                    {settings.phone}
                  </p>
                </div>
              </a>

              <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 transition-colors group-hover:border-gold-400">
                  <Mail className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Email</p>
                  <p className="text-sm text-ink-100 group-hover:text-gold-300 transition-colors break-all">
                    {settings.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600">
                  <MapPin className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">Service Area</p>
                  <p className="text-sm text-ink-100">{settings.service_area}</p>
                </div>
              </div>

              {/* Social */}
              <div className="border-t border-ink-700/60 pt-6">
                <p className="mb-4 text-xs uppercase tracking-widest text-ink-400">Follow Us</p>
                <div className="flex gap-3">
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" strokeWidth={1.5} />
                    </a>
                  )}
                  {settings.youtube_url && (
                    <a
                      href={settings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-5 w-5" strokeWidth={1.5} />
                    </a>
                  )}
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-110"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
