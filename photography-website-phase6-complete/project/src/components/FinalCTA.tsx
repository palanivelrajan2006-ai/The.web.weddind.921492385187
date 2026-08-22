const bgImage =
  'https://images.pexels.com/photos/30372650/pexels-photo-30372650.jpeg?auto=compress&cs=tinysrgb&w=1920';

export default function FinalCTA() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Elegant outdoor pre-wedding photoshoot with flowing veil"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink-950/80" />
      </div>

      <div className="container-px relative z-10 mx-auto max-w-4xl py-24 text-center sm:py-32 lg:py-40">
        <div className="reveal">
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Have a Moment
            <br />
            <span className="text-gold-300 italic">Worth Capturing?</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-200">
            Whether it's your wedding, a special celebration, a professional
            portfolio, a brand project, or an idea you've never seen done before,
            let's turn it into something unforgettable.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => scrollTo('#contact')} className="btn-primary w-full sm:w-auto">
              Book a Shoot
            </button>
            <button onClick={() => scrollTo('#contact')} className="btn-ghost w-full sm:w-auto">
              Get a Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
