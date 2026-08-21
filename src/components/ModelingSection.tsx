import { Sparkles } from 'lucide-react';

const modelingCategories = [
  'Fashion',
  'Editorial',
  'Commercial',
  'Actor Portfolio',
  'Influencer',
  'Personal Branding',
];

const modelingImages = [
  'https://images.pexels.com/photos/33714925/pexels-photo-33714925.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/852854/pexels-photo-852854.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/38290948/pexels-photo-38290948.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/19222080/pexels-photo-19222080.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/13327309/pexels-photo-13327309.jpeg?auto=compress&cs=tinysrgb&w=700',
  'https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=700',
];

export default function ModelingSection() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="modeling" className="section-py relative bg-ink-900/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-14 text-center">
          <p className="eyebrow mb-6">Modeling & Portraits</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Bold. <span className="text-gold-300 italic">Expressive.</span> Unforgettable.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
            Professional portrait and fashion photography that makes you stand
            out — whether you're building a portfolio, a brand, or a presence.
          </p>
        </div>

        {/* Category pills */}
        <div className="reveal mb-10 flex flex-wrap items-center justify-center gap-2.5">
          {modelingCategories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1.5 rounded-full border border-ink-600 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              {cat}
            </span>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {modelingImages.map((src, i) => (
            <div
              key={src}
              className="reveal group relative overflow-hidden rounded-xl"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <img
                src={src}
                alt={`Modeling portfolio example ${i + 1}`}
                loading="lazy"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="reveal mt-12 text-center">
          <button onClick={() => scrollTo('#contact')} className="btn-primary">
            Book a Portfolio Shoot
          </button>
        </div>
      </div>
    </section>
  );
}
