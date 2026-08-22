/**
 * ============================================================
 *  SITE CONTENT DATA — All text content lives here
 * ============================================================
 *  Edit copy, service details, testimonials, FAQs, and
 *  process steps without touching component code.
 */

import {
  Camera,
  Film,
  Heart,
  Users,
  Palette,
  Video,
  Sparkles,
  Award,
  HandHeart,
  Layers,
  Eye,
  MessageSquare,
  ClipboardList,
  Send,
  type LucideIcon,
} from 'lucide-react';

/* ---------- Navigation ---------- */
export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Weddings', href: '#weddings' },
  { label: 'Modeling', href: '#modeling' },
  { label: 'Contact', href: '#contact' },
];

/* ---------- Statistics ---------- */
export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 100, suffix: '+', label: 'Events Covered' },
  { value: 500, suffix: '+', label: 'Happy Clients' },
  { value: 1000, suffix: '+', label: 'Moments Captured' },
  { value: 8, suffix: '+', label: 'Years of Experience' },
];

/* ---------- Services ---------- */
export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  image: string;
}

export const services: Service[] = [
  {
    icon: Heart,
    title: 'Wedding Photography',
    description:
      'From the nervous excitement before the ceremony to the celebrations on the dance floor, we capture the emotions, people, details, and moments that make your wedding uniquely yours.',
    features: [
      'Engagement & Pre-wedding',
      'Haldi, Mehendi & Sangeet',
      'Wedding ceremony & Reception',
      'Couple & family portraits',
      'Candid & traditional photography',
      'Wedding cinematography & highlight films',
      'Custom wedding albums',
    ],
    image:
      'https://images.pexels.com/photos/38823745/pexels-photo-38823745.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Users,
    title: 'Event Photography & Videography',
    description:
      'Comprehensive coverage for every kind of gathering — from intimate family celebrations to large-scale corporate productions.',
    features: [
      'Birthday parties & Anniversaries',
      'Baby showers & Family gatherings',
      'Corporate events & Award ceremonies',
      'College & School functions',
      'Cultural programs & Festivals',
      'Product launches & Private parties',
      'Photography + videography coverage',
    ],
    image:
      'https://images.pexels.com/photos/7081180/pexels-photo-7081180.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Camera,
    title: 'Pre-Wedding Photography',
    description:
      'Romantic, cinematic pre-wedding sessions that tell your love story before the big day arrives.',
    features: [
      'Location-based shoots',
      'Outdoor & indoor photography',
      'Couple portraits',
      'Cinematic pre-wedding videos',
      'Creative concepts & story-based shoots',
    ],
    image:
      'https://images.pexels.com/photos/31248277/pexels-photo-31248277.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Sparkles,
    title: 'Modeling & Portfolio Photography',
    description:
      'Professional modeling and portfolio shoots designed to make you stand out in the industry.',
    features: [
      'Fashion photography',
      'Model & actor portfolios',
      'Influencer & brand shoots',
      'Headshots & full-body portraits',
      'Editorial photography',
      'Outdoor fashion & studio-style portraits',
    ],
    image:
      'https://images.pexels.com/photos/33714925/pexels-photo-33714925.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Palette,
    title: 'Portrait Photography',
    description:
      'Professional portraits for personal branding, social media, professional profiles, and special occasions.',
    features: [
      'Personal branding & social media',
      'Professional profiles & headshots',
      'Graduation & college portfolios',
      'Portraits for actors, models & artists',
      'Creative & special occasion portraits',
    ],
    image:
      'https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Video,
    title: 'Cinematography & Video Production',
    description:
      'Professional video production services from concept to final delivery, for every platform and purpose.',
    features: [
      'Wedding films & event videos',
      'Highlight videos & cinematic reels',
      'Promotional & corporate videos',
      'Social media content & YouTube videos',
      'Short-form videos & music projects',
      'Documentary-style videos',
    ],
    image:
      'https://images.pexels.com/photos/13811053/pexels-photo-13811053.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

/* ---------- Editing Services ---------- */
export const photoEditingServices = [
  'Professional color correction & color grading',
  'Skin retouching & portrait retouching',
  'Background cleanup & object removal',
  'Exposure & lighting correction',
  'Creative photo manipulation',
  'Album design & professional image enhancement',
];

export const videoEditingServices = [
  'Cinematic editing & color grading',
  'Sound synchronization & music selection',
  'Transitions, motion graphics & titles',
  'Subtitles & highlight reels',
  'Instagram Reels & YouTube videos',
  'Wedding films & social media videos',
];

/* ---------- Process Steps ---------- */
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: "Let's Talk",
    description: 'Tell us about your event, idea, or project.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Plan',
    description: 'We discuss requirements, location, style, timeline, and expectations.',
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'Shoot',
    description: 'Our photography and videography team captures the moments.',
    icon: Camera,
  },
  {
    number: '04',
    title: 'Edit',
    description: 'Our post-production team carefully edits and enhances the final content.',
    icon: Palette,
  },
  {
    number: '05',
    title: 'Deliver',
    description: 'Receive your final photos, videos, reels, albums, and agreed deliverables.',
    icon: Send,
  },
];

/* ---------- Why Choose Us ---------- */
export interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const advantages: Advantage[] = [
  {
    icon: Eye,
    title: 'Creative Approach',
    description: "We don't simply record what happens. We look for the story within it.",
  },
  {
    icon: Award,
    title: 'Professional Quality',
    description: 'High-quality photography, cinematography, and post-production in every project.',
  },
  {
    icon: HandHeart,
    title: 'Personalized Service',
    description: 'Every client receives a service tailored specifically to their needs.',
  },
  {
    icon: Layers,
    title: 'Complete Solution',
    description: 'Photography, videography, editing, albums, reels, and more — all under one team.',
  },
  {
    icon: Sparkles,
    title: 'Flexible Packages',
    description: 'Packages can be customized according to the event and budget.',
  },
  {
    icon: Camera,
    title: 'Attention to Detail',
    description: 'We focus on emotions, expressions, lighting, composition, and small moments.',
  },
];

/* ---------- Testimonials ---------- */
export interface Testimonial {
  name: string;
  eventType: string;
  rating: number;
  review: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Aarav & Diya Sharma',
    eventType: 'Wedding',
    rating: 5,
    review:
      'They captured every emotion of our wedding perfectly — from the haldi laughter to the tears during the vows. The highlight film still gives us goosebumps every time we watch it.',
    initials: 'AS',
  },
  {
    name: 'Priya Mehta',
    eventType: 'Modeling Portfolio',
    rating: 5,
    review:
      'The team understood exactly the look I was going for. My portfolio turned out better than I imagined, and I started getting calls within weeks of sharing it.',
    initials: 'PM',
  },
  {
    name: 'Rohit Kapoor',
    eventType: 'Corporate Event',
    rating: 5,
    review:
      'Professional from start to finish. They covered our product launch with both photos and video, and the final edits were crisp, polished, and delivered on time.',
    initials: 'RK',
  },
  {
    name: 'Sneha & Karthik Reddy',
    eventType: 'Pre-Wedding Shoot',
    rating: 5,
    review:
      'We were nervous about being on camera, but they made us feel completely at ease. The cinematic pre-wedding video was absolutely dreamy. Worth every moment.',
    initials: 'SR',
  },
  {
    name: 'Ananya Gupta',
    eventType: 'Personal Branding',
    rating: 5,
    review:
      'As a content creator, I needed portraits that felt like me but elevated. They nailed the balance. The color grading on the final set was stunning.',
    initials: 'AG',
  },
  {
    name: 'Vikram & Neha Joshi',
    eventType: 'Wedding',
    rating: 5,
    review:
      'From the first call to the final album delivery, everything was seamless. They didn\'t miss a single moment across our three-day wedding. Truly grateful.',
    initials: 'VJ',
  },
];

/* ---------- FAQ ---------- */
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'What types of events do you cover?',
    answer:
      'We cover weddings, pre-wedding shoots, birthdays, anniversaries, corporate events, cultural programs, college functions, product launches, private parties, and more. If it\'s worth remembering, we\'ll be there.',
  },
  {
    question: 'Do you provide both photography and videography?',
    answer:
      'Yes. We offer both photography and videography for every type of event, and we can combine them into a single package or provide them separately based on your needs.',
  },
  {
    question: 'Do you provide wedding photography?',
    answer:
      'Absolutely. Wedding photography and cinematography is one of our specialties — from engagement and pre-wedding through the ceremony and reception, including albums and highlight films.',
  },
  {
    question: 'Do you offer pre-wedding shoots?',
    answer:
      'Yes. We create romantic, cinematic pre-wedding sessions at locations of your choice, including outdoor and indoor options, couple portraits, and cinematic pre-wedding videos.',
  },
  {
    question: 'Do you provide modeling portfolio shoots?',
    answer:
      'Yes. We shoot fashion, model portfolios, actor portfolios, influencer shoots, brand shoots, headshots, and editorial photography — both in studio and on location.',
  },
  {
    question: 'Can I request a customized package?',
    answer:
      'Always. We don\'t force clients into fixed packages. Every event, brand, and story is different, so we tailor our services, deliverables, and pricing to your specific requirements.',
  },
  {
    question: 'Do you provide photo editing?',
    answer:
      'Yes. We offer professional photo editing including color correction, color grading, skin retouching, background cleanup, creative manipulation, and album design.',
  },
  {
    question: 'Do you provide video editing?',
    answer:
      'Yes. Our video editing services include cinematic editing, color grading, sound synchronization, motion graphics, titles, highlight reels, wedding films, and social media videos.',
  },
  {
    question: 'Can you edit photos or videos shot by another photographer?',
    answer:
      'Yes. We provide editing-only services for clients who already have their own photos or videos. Just share your raw files and we\'ll handle the post-production.',
  },
  {
    question: 'Do you travel to different locations?',
    answer:
      'Yes, we travel for weddings, events, and shoots. We cover our local service area and are available for destination projects as well.',
  },
  {
    question: 'How early should we book?',
    answer:
      'We recommend booking as early as possible — especially for weddings and peak season dates. Contact us to check availability for your date.',
  },
  {
    question: 'How will we receive the final photos and videos?',
    answer:
      'Final deliverables are shared via secure online galleries and downloadable links. Physical albums and other agreed deliverables are handed over or shipped as discussed.',
  },
  {
    question: 'Do you provide albums?',
    answer:
      'Yes. We design and deliver professionally printed wedding albums and photo books as part of select packages or as an add-on.',
  },
  {
    question: 'Do you provide cinematic wedding films?',
    answer:
      'Yes. Cinematic wedding films and highlight reels are one of our signature deliverables, crafted with careful editing, color grading, and sound design.',
  },
  {
    question: 'Do you provide Instagram Reels?',
    answer:
      'Yes. We create short-form vertical content including Instagram Reels from your event footage, optimized for social media.',
  },
  {
    question: 'How is pricing calculated?',
    answer:
      'Pricing depends on the type of event, number of days, location, required services, and deliverables. Contact us for a customized quote tailored to your specific needs.',
  },
];

/* ---------- Contact Form Options ---------- */
export const serviceOptions = [
  'Wedding Photography',
  'Wedding Videography',
  'Event Photography',
  'Event Videography',
  'Pre-Wedding Shoot',
  'Modeling Portfolio',
  'Portrait Shoot',
  'Product Photography',
  'Cinematography',
  'Photo Editing',
  'Video Editing',
  'Custom Project',
  'Other',
];

export const eventTypeOptions = [
  'Wedding',
  'Pre-Wedding',
  'Birthday',
  'Anniversary',
  'Corporate Event',
  'Modeling / Portfolio',
  'Portrait / Personal',
  'Product / Brand',
  'Cultural / Religious',
  'Other',
];
