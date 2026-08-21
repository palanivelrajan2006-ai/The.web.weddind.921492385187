import { processSteps } from '@/data/content';

export default function Process() {
  return (
    <section className="section-py relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-16 text-center">
          <p className="eyebrow mb-6">How We Work</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Our Process
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="reveal relative text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-gradient-to-r from-gold-500/30 to-transparent lg:block" />
                )}
                <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-ink-900">
                  <Icon className="h-7 w-7 text-gold-300" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-ink-950">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-medium text-ink-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
