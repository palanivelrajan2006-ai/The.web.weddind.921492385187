import { Check } from 'lucide-react';
import { photoEditingServices, videoEditingServices } from '@/data/content';

const editingImage =
  'https://images.pexels.com/photos/11894290/pexels-photo-11894290.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function EditingServices() {
  return (
    <section className="section-py relative overflow-hidden">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-16 text-center">
          <p className="eyebrow mb-6">Post-Production</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            The Shoot Is Only Half the Story.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
            We provide professional editing after photography and videography —
            and also offer editing-only services if you already have your own
            photos or videos.
          </p>
        </div>

        {/* Image banner */}
        <div className="reveal relative mb-16 h-64 overflow-hidden rounded-2xl sm:h-80">
          <img
            src={editingImage}
            alt="Professional color grading and video editing workspace"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-px max-w-xl">
              <p className="font-display text-2xl italic text-ink-100 sm:text-3xl">
                "Every frame is sculpted — color, light, and sound shaped into
                something that feels alive."
              </p>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Photo Editing */}
          <div className="reveal card-surface p-8 lg:p-10">
            <h3 className="font-display text-3xl font-medium text-gold-300">Photo Editing</h3>
            <ul className="mt-6 space-y-3.5">
              {photoEditingServices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Video Editing */}
          <div
            className="reveal card-surface p-8 lg:p-10"
            style={{ transitionDelay: '120ms' }}
          >
            <h3 className="font-display text-3xl font-medium text-gold-300">Video Editing</h3>
            <ul className="mt-6 space-y-3.5">
              {videoEditingServices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editing-only note */}
        <div className="reveal mt-8 text-center">
          <p className="text-sm uppercase tracking-widest text-ink-400">
            Editing-only services available — bring your own raw photos or videos
          </p>
        </div>
      </div>
    </section>
  );
}
