import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { services } from '@/data/content';
import type { Service } from '@/data/content';

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <div
      className="reveal card-surface group overflow-hidden hover:border-gold-500/30 hover:bg-ink-800/80"
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-ink-950/60 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-7">
        <h3 className="font-display text-2xl font-medium text-ink-50">{service.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-300">{service.description}</p>

        {/* Features */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            expanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-200">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold-400 transition-colors hover:text-gold-300"
        >
          {expanded ? (
            <>
              <Minus className="h-4 w-4" /> Show Less
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> View Details
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section-py relative bg-ink-900/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-16 text-center">
          <p className="eyebrow mb-6">What We Do</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Services Crafted for Every Story
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
            From the first frame to the final edit, we offer a complete range of
            photography and videography services.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
