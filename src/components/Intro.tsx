import { stats } from '@/data/content';
import { useCountUp } from '@/hooks/useScrollReveal';

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="font-display text-5xl font-semibold text-gold-300 sm:text-6xl">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm uppercase tracking-widest text-ink-300">{label}</p>
    </div>
  );
}

export default function Intro() {
  return (
    <section id="about" className="section-py relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="container-px mx-auto max-w-5xl">
        <div className="reveal text-center">
          <p className="eyebrow mb-6">Who We Are</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            We Capture More Than Moments.
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-ink-200">
            We are a creative photography and videography team dedicated to
            capturing authentic emotions, unforgettable moments, and powerful
            visual stories. From intimate celebrations to grand weddings,
            professional portfolios, special events, and creative productions,
            we bring our own vision and style to every project.
          </p>
        </div>

        {/* Stats */}
        <div className="reveal mt-16 grid grid-cols-2 gap-8 sm:gap-12 lg:mt-20 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>

        {/* Tagline */}
        <div className="reveal mt-16 text-center lg:mt-20">
          <p className="font-display text-2xl italic text-ink-300 sm:text-3xl">
            Professional Photography & Cinematography
          </p>
        </div>
      </div>
    </section>
  );
}
