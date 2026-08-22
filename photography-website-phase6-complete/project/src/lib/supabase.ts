import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud in dev, but never crash the public site over a missing key.
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  );
}

// NOTE: not using supabase-js's generic `Database` typing here — our
// src/types/database.ts types are applied manually at each call site
// instead (see src/lib/bookings.ts, src/hooks/useBusinessSettings.ts).
// This keeps us decoupled from supabase-js's generated-type shape,
// which changes across major versions.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
