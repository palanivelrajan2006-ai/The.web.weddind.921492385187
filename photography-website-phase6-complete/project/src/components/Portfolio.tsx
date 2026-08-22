import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { portfolioCategories, type PortfolioCategory } from '@/data/portfolio';
import { usePortfolio } from '@/hooks/usePublicContent';
import type { PortfolioItem } from '@/data/portfolio';

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center lightbox-backdrop"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-950/90" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-ink-100 transition-colors hover:border-gold-400 hover:text-gold-300"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev / Next */}
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav(-1);
          }}
          className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 text-ink-100 transition-colors hover:border-gold-400 hover:text-gold-300 sm:left-8"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {index < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav(1);
          }}
          className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 text-ink-100 transition-colors hover:border-gold-400 hover:text-gold-300 sm:right-8"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative z-[1] mx-4 max-h-[85vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[78vh] w-auto rounded-lg object-contain"
        />
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400 bg-ink-950/40 backdrop-blur-sm">
              <Play className="h-8 w-8 text-gold-300" fill="currentColor" />
            </div>
          </div>
        )}
        <div className="mt-4 text-center">
          <p className="font-display text-xl text-ink-50">{item.title}</p>
          <p className="mt-1 text-sm uppercase tracking-widest text-gold-400">{item.category}</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) {
  const spanClass =
    item.span === 'tall'
      ? 'row-span-2'
      : item.span === 'wide'
      ? 'sm:col-span-2'
      : '';

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl ${spanClass}`}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-100/50 bg-ink-950/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400/60">
            <Play className="h-6 w-6 text-ink-50" fill="currentColor" />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left opacity-0 transition-all duration-500 group-hover:opacity-100">
        <p className="font-display text-lg text-ink-50">{item.title}</p>
        <p className="text-xs uppercase tracking-widest text-gold-300">{item.category}</p>
      </div>
    </button>
  );
}

export default function Portfolio() {
  const { items: portfolioItems } = usePortfolio();
  const [filter, setFilter] = useState<'All' | PortfolioCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === 'All' ? portfolioItems : portfolioItems.filter((i) => i.category === filter);

  const openLightbox = useCallback((id: string) => {
    const idx = filtered.findIndex((i) => i.id === id);
    if (idx >= 0) setLightboxIndex(idx);
  }, [filtered]);

  const navigate = useCallback(
    (dir: number) => {
      setLightboxIndex((prev) => {
        if (prev === null) return prev;
        const next = prev + dir;
        if (next < 0 || next >= filtered.length) return prev;
        return next;
      });
    },
    [filtered.length]
  );

  return (
    <section id="portfolio" className="section-py relative bg-ink-900/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="reveal mb-12 text-center">
          <p className="eyebrow mb-6">Our Work</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Portfolio
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300">
            A selection of moments we've captured across weddings, events,
            portraits, and creative projects.
          </p>
        </div>

        {/* Filters */}
        <div className="reveal mb-10 flex flex-wrap items-center justify-center gap-2.5">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                filter === cat
                  ? 'bg-gold-500 text-ink-950'
                  : 'border border-ink-600 text-ink-300 hover:border-gold-400/50 hover:text-ink-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => openLightbox(item.id)}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={navigate}
        />
      )}
    </section>
  );
}
