import { useCallback, useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/content';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const t = testimonials[current];

  return (
    <section
      className="section-py relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-px mx-auto max-w-4xl">
        <div className="reveal mb-14 text-center">
          <p className="eyebrow mb-6">Client Love</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Stories From Our Clients
          </h2>
        </div>

        {/* Carousel */}
        <div className="reveal relative">
          <Quote className="mx-auto h-12 w-12 text-gold-500/30" strokeWidth={1} />

          <div className="mt-6 min-h-[200px] text-center">
            <div key={current} className="animate-fade-in">
              {/* Stars */}
              <div className="mb-5 flex items-center justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold-400" fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <p className="mx-auto max-w-3xl font-display text-xl italic leading-relaxed text-ink-100 sm:text-2xl">
                "{t.review}"
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 bg-ink-800 text-sm font-semibold text-gold-300">
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="font-medium text-ink-50">{t.name}</p>
                  <p className="text-xs uppercase tracking-widest text-ink-400">{t.eventType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-colors hover:border-gold-400 hover:text-gold-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-gold-400' : 'w-1.5 bg-ink-600'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition-colors hover:border-gold-400 hover:text-gold-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
