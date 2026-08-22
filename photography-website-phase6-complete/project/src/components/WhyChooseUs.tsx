import { advantages } from '@/data/content';

export default function WhyChooseUs() {
  return (
    <section className="section-py relative bg-ink-900/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-16 text-center">
          <p className="eyebrow mb-6">Why Us</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Why Choose Our Studio
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="reveal card-surface p-7 hover:border-gold-500/30 hover:bg-ink-800/80"
                style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-ink-900">
                  <Icon className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-ink-50">
                  {adv.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
