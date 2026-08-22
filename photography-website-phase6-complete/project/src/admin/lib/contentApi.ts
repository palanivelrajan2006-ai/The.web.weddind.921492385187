import { supabase } from '@/lib/supabase';

export async function fetchAll<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as T[];
}

export async function createRow<T extends object>(table: string, row: T) {
  const { data, error } = await supabase.from(table).insert(row as never).select().single();
  if (error) throw error;
  return data;
}

export async function updateRow<T extends object>(table: string, id: string, patch: Partial<T>) {
  const { error } = await supabase.from(table).update(patch as never).eq('id', id);
  if (error) throw error;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function toggleActive(table: string, id: string, is_active: boolean) {
  await updateRow(table, id, { is_active } as never);
}
