import { Heart } from 'lucide-react';

const weddingImages = [
  { src: 'https://images.pexels.com/photos/38823745/pexels-photo-38823745.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Couple under warm lantern light', label: 'Candid Moments' },
  { src: 'https://images.pexels.com/photos/16229516/pexels-photo-16229516.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Bride and groom embracing during a dance', label: 'First Dance' },
  { src: 'https://images.pexels.com/photos/38708859/pexels-photo-38708859.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Happy couple on their wedding day', label: 'Pure Joy' },
  { src: 'https://images.pexels.com/photos/16748519/pexels-photo-16748519.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Bride admiring lace wedding dress', label: 'The Details' },
  { src: 'https://images.pexels.com/photos/6198377/pexels-photo-6198377.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Couple in wedding attire in dramatic setting', label: 'Cinematic Portraits' },
  { src: 'https://images.pexels.com/photos/32878576/pexels-photo-32878576.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Couple in traditional attire', label: 'Traditions' },
];

export default function WeddingFeature() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="weddings" className="section-py relative overflow-hidden">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-14 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold-500/40" />
            <Heart className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
            <span className="h-px w-12 bg-gold-500/40" />
          </div>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Every Love Story Deserves
            <br />
            <span className="text-gold-300 italic">to Be Remembered.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
            Candid moments, couple portraits, wedding rituals, family emotions,
            and cinematic films — captured with care and artistry.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {weddingImages.map((img, i) => (
            <div
              key={img.src}
              className={`reveal group relative overflow-hidden rounded-xl ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              } ${i === 4 ? 'lg:col-span-2' : ''}`}
              style={{ transitionDelay: `${(i % 4) * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? 'h-full min-h-[300px] sm:min-h-[400px]' : 'h-56 sm:h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="absolute bottom-4 left-5 font-display text-lg text-ink-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {img.label}
              </p>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 text-center">
          <button onClick={() => scrollTo('#contact')} className="btn-primary">
            Plan Your Wedding Shoot
          </button>
        </div>
      </div>
    </section>
  );
}
