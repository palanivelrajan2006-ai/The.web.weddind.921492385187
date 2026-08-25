import { ChevronDown } from 'lucide-react';

const heroImage =
  'https://images.pexels.com/photos/38823745/pexels-photo-38823745.jpeg?auto=compress&cs=tinysrgb&w=1920';

export default function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cinematic wedding photography — couple under warm lantern light"
          className="h-full w-full object-cover animate-slow-zoom"
          loading="eager"
          fetchPriority="high"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/30" />
      </div>

      {/* Content */}
      <div className="container-px relative z-10 mx-auto max-w-5xl text-center">
        <p
          className="eyebrow mb-6 animate-fade-in"
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Photography & Cinematography Studio
        </p>
        <h1
          className="heading-display text-5xl text-ink-50 sm:text-6xl md:text-7xl lg:text-8xl animate-fade-up"
          style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Your Moments.
          <br />
          <span className="text-gold-300 italic">Our Vision.</span>
        </h1>
        <p
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg animate-fade-up"
          style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Professional Photography & Cinematography for Weddings, Events,
          Portraits, Modeling, and Every Story Worth Remembering.
        </p>
        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
          style={{ animationDelay: '1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <button onClick={() => scrollTo('#contact')} className="btn-primary w-full sm:w-auto">
            Book a Shoot
          </button>
          <button onClick={() => scrollTo('#portfolio')} className="btn-ghost w-full sm:w-auto">
            Explore Our Work
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink-300 transition-colors hover:text-gold-300"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" strokeWidth={1.5} />
      </button>
    </section>
  );
}
