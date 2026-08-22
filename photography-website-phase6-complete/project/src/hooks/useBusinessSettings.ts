import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { studioConfig } from '@/config/studio';
import type { BusinessSettings } from '@/types/database';

// Fallback so the site still renders correctly if Supabase isn't configured
// yet (e.g. first local run before .env is filled in).
const fallback: BusinessSettings = {
  id: 'fallback',
  studio_name: studioConfig.name,
  tagline: studioConfig.tagline,
  phone: studioConfig.contact.phone,
  whatsapp: studioConfig.contact.whatsapp,
  email: studioConfig.contact.email,
  address: studioConfig.contact.location,
  business_hours: '',
  instagram_url: studioConfig.social.instagram,
  facebook_url: studioConfig.social.facebook,
  youtube_url: studioConfig.social.youtube,
  service_area: studioConfig.contact.serviceArea,
  logo_url: null,
  booking_reference_prefix: 'LS',
  updated_at: new Date().toISOString(),
};

let cache: BusinessSettings | null = null;

/**
 * Single source of truth for public contact info. Reads from the
 * business_settings table (editable by the admin), falling back to
 * src/config/studio.ts if Supabase hasn't been configured yet.
 */
export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(cache ?? fallback);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;

    supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle<BusinessSettings>()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          console.warn('Falling back to static studio config:', error?.message);
          setSettings(fallback);
        } else {
          cache = data;
          setSettings(data);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}
