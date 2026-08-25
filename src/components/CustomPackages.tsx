import { Lightbulb, MapPin, Plane, Clapperboard, Wand2, Megaphone } from 'lucide-react';

const customExamples = [
  { icon: Lightbulb, label: 'Custom themes & creative concepts' },
  { icon: Clapperboard, label: 'Story-based & cinematic shoots' },
  { icon: MapPin, label: 'Unique locations' },
  { icon: Plane, label: 'Drone photography & videography' },
  { icon: Megaphone, label: 'Social media campaigns & brand content' },
  { icon: Wand2, label: 'Special effects & customized editing' },
];

const bgImage =
  'https://images.pexels.com/photos/12984737/pexels-photo-12984737.jpeg?auto=compress&cs=tinysrgb&w=1600';

export default function CustomPackages() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Photographer silhouette against sunset sky"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink-950/85" />
      </div>

      <div className="container-px relative z-10 mx-auto max-w-5xl section-py">
        <div className="reveal text-center">
          <p className="eyebrow mb-6">Bespoke Services</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Your Idea. <span className="text-gold-300 italic">Our Creation.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-ink-200">
            We don't force customers into fixed packages. We understand that
            every client, event, brand, and story is different. If you have a
            specific idea, theme, location, concept, video style, or creative
            requirement, our team can work with you to create a customized
            photography or videography experience.
          </p>
        </div>

        {/* Examples grid */}
        <div className="reveal mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customExamples.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 rounded-xl border border-ink-700/60 bg-ink-900/50 px-5 py-4 backdrop-blur-sm transition-colors hover:border-gold-500/30"
            >
              <Icon className="h-5 w-5 flex-shrink-0 text-gold-400" strokeWidth={1.5} />
              <span className="text-sm text-ink-200">{label}</span>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 text-center">
          <button onClick={() => scrollTo('#contact')} className="btn-primary">
            Discuss Your Idea
          </button>
        </div>
      </div>
    </section>
  );
}
