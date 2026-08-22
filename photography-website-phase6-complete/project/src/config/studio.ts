/**
 * ============================================================
 *  STUDIO CONFIGURATION — Edit everything here
 * ============================================================
 *  This is the single source of truth for studio branding,
 *  contact info, social links, and service area.
 *  Replace placeholder values with your real information.
 */

export const studioConfig = {
  name: 'Lumière Studio',
  tagline: 'We don\'t just capture moments. We turn them into stories.',
  description:
    'Professional Photography & Videography for Weddings, Events, Modeling, Brands, and Stories That Matter.',

  contact: {
    phone: '+91 98765 43210',
    whatsapp: '919876543210', // International format, no + or spaces
    email: 'hello@lumierestudio.example',
    serviceArea: 'Mumbai, Maharashtra, India & destination worldwide',
    location: 'Mumbai, Maharashtra, India',
  },

  social: {
    instagram: 'https://instagram.com/lumierestudio',
    youtube: 'https://youtube.com/@lumierestudio',
    facebook: 'https://facebook.com/lumierestudio',
  },

  whatsappMessage:
    "Hi, I found your photography & videography website and would like to know more about your services.",
};

export type StudioConfig = typeof studioConfig;
