import { supabase } from '@/lib/supabase';
import { useAuth } from '@/admin/lib/AuthContext';

export async function logAdminAction(
  adminEmail: string | null,
  action: string,
  recordTable?: string,
  recordId?: string,
  details?: Record<string, unknown>
) {
  const { error } = await supabase.from('audit_logs').insert({
    admin_email: adminEmail,
    action,
    record_table: recordTable ?? null,
    record_id: recordId ?? null,
    details: details ?? null,
  } as never);
  if (error) console.error('Failed to write audit log:', error.message);
}

/** Convenience hook: bind the current admin's email into logAdminAction calls. */
export function useAuditLog() {
  const { session } = useAuth();
  const email = session?.user?.email ?? null;
  return (action: string, recordTable?: string, recordId?: string, details?: Record<string, unknown>) =>
    logAdminAction(email, action, recordTable, recordId, details);
}
