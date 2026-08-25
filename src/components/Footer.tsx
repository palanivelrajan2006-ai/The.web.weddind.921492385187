import { Aperture, Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';
import { studioConfig } from '@/config/studio';
import { navLinks } from '@/data/content';

const footerServices = [
  'Wedding Photography',
  'Event Photography',
  'Videography',
  'Modeling',
  'Portraits',
  'Editing',
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-ink-700/50 bg-ink-950">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 text-ink-50">
              <Aperture className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
              <span className="font-display text-xl font-semibold tracking-wide">
                {studioConfig.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">
              {studioConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={studioConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4.5 w-4.5" strokeWidth={1.5} />
              </a>
              <a
                href={studioConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-300"
                aria-label="YouTube"
              >
                <Youtube className="h-4.5 w-4.5" strokeWidth={1.5} />
              </a>
              <a
                href={studioConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4.5 w-4.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg font-medium text-ink-50">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-ink-300 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-medium text-ink-50">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {footerServices.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo('#services')}
                    className="text-sm text-ink-300 transition-colors hover:text-gold-300"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-medium text-ink-50">Contact</h3>
            <ul className="mt-4 space-y-3.5">
              <li>
                <a href={`tel:${studioConfig.contact.phone}`} className="flex items-center gap-3 text-sm text-ink-300 transition-colors hover:text-gold-300">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" strokeWidth={1.5} />
                  {studioConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${studioConfig.contact.email}`} className="flex items-center gap-3 text-sm text-ink-300 transition-colors hover:text-gold-300 break-all">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" strokeWidth={1.5} />
                  {studioConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-ink-300">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gold-400 mt-0.5" strokeWidth={1.5} />
                {studioConfig.contact.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 border-t border-ink-700/50 pt-8 text-center">
          <p className="text-sm text-ink-400">
            © 2026 {studioConfig.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
