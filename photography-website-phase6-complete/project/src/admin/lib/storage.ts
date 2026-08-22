import { supabase } from '@/lib/supabase';

/**
 * Uploads a file to the `portfolio` storage bucket (created by
 * supabase/migrations/0001_init.sql) and returns its public URL.
 */
export async function uploadPortfolioMedia(file: File, category: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const safeCategory = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const path = `${safeCategory}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('portfolio').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
  return data.publicUrl;
}
