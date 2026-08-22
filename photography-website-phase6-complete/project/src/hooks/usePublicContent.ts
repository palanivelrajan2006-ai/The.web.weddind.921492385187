import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { resolveIcon } from '@/lib/iconRegistry';
import {
  services as staticServices,
  testimonials as staticTestimonials,
  type Service as StaticService,
  type Testimonial as StaticTestimonial,
} from '@/data/content';
import { portfolioItems as staticPortfolioItems, type PortfolioItem as StaticPortfolioItem } from '@/data/portfolio';
import type { Service, Testimonial, PortfolioItem, Package } from '@/types/database';

/**
 * Generic "load from Supabase, fall back to static data" hook.
 * Keeps the public site working even before the admin has added any
 * content rows, and never breaks the build if Supabase isn't configured.
 */
function useLiveContent<TRow, TStatic>(
  table: string,
  mapRow: (row: TRow) => TStatic,
  fallback: TStatic[]
) {
  const [items, setItems] = useState<TStatic[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from(table)
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data || data.length === 0) {
          setItems(fallback);
        } else {
          setItems((data as TRow[]).map(mapRow));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { items, loading };
}

export function useServices() {
  return useLiveContent<Service, StaticService>(
    'services',
    (row) => ({
      icon: resolveIcon(row.icon_name),
      title: row.title,
      description: row.description ?? '',
      features: row.features ?? [],
      image: row.image_url ?? '',
    }),
    staticServices
  );
}

export function useTestimonials() {
  return useLiveContent<Testimonial, StaticTestimonial>(
    'testimonials',
    (row) => ({
      name: row.client_name,
      eventType: row.event_type ?? '',
      rating: row.rating,
      review: row.review,
      initials: row.client_name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }),
    staticTestimonials
  );
}

export function usePortfolio() {
  return useLiveContent<PortfolioItem, StaticPortfolioItem>(
    'portfolio_items',
    (row) => ({
      id: row.id,
      title: row.title,
      category: row.category as StaticPortfolioItem['category'],
      image: row.media_type === 'video' ? row.thumbnail_url ?? row.media_url : row.media_url,
      type: row.media_type,
      videoUrl: row.media_type === 'video' ? row.media_url : undefined,
    }),
    staticPortfolioItems
  );
}

export interface DisplayPackage {
  id: string;
  name: string;
  description: string;
  price: string | null;
  features: string[];
  isFeatured: boolean;
}

export function usePackages() {
  return useLiveContent<Package, DisplayPackage>(
    'packages',
    (row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? '',
      price: row.price,
      features: row.features ?? [],
      isFeatured: row.is_featured,
    }),
    []
  );
}
