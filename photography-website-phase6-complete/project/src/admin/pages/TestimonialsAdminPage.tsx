import { useEffect, useState, type FormEvent } from 'react';
import { Star, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { fetchAll, createRow, updateRow, deleteRow, toggleActive } from '@/admin/lib/contentApi';
import { useAuditLog } from '@/admin/lib/auditLog';
import type { Testimonial } from '@/types/database';

type FormState = Omit<Testimonial, 'id' | 'created_at'>;

const emptyForm: FormState = {
  client_name: '',
  event_type: '',
  location: '',
  review: '',
  rating: 5,
  photo_url: '',
  is_active: true,
  display_order: 0,
};

export default function TestimonialsAdminPage() {
  const logAction = useAuditLog();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAll<Testimonial>('testimonials')
      .then(setItems)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, display_order: items.length });
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      client_name: t.client_name,
      event_type: t.event_type ?? '',
      location: t.location ?? '',
      review: t.review,
      rating: t.rating,
      photo_url: t.photo_url ?? '',
      is_active: t.is_active,
      display_order: t.display_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      if (editingId) {
        await updateRow('testimonials', editingId, form);
        logAction('Edited testimonial', 'testimonials', editingId);
      } else {
        const created = await createRow('testimonials', form);
        logAction('Added testimonial', 'testimonials', (created as { id: string }).id);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return;
    await deleteRow('testimonials', id);
    logAction('Deleted testimonial', 'testimonials', id);
    load();
  };

  const handleToggle = async (t: Testimonial) => {
    await toggleActive('testimonials', t.id, !t.is_active);
    logAction(t.is_active ? 'Disabled testimonial' : 'Enabled testimonial', 'testimonials', t.id);
    load();
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-400">{items.length} testimonials · shown on the public site in display order</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">{errorMsg}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink-50">
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Client Name</label>
              <input required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Event Type</label>
              <input value={form.event_type ?? ''} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className={inputClass} placeholder="Wedding, Pre-Wedding, ..." />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Location</label>
              <input value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rating (1–5)</label>
              <input type="number" min={1} max={5} required value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Review</label>
            <textarea required rows={3} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Photo URL (optional)</label>
              <input value={form.photo_url ?? ''} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Display Order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-400" />
            Active (visible on public site)
          </label>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink-400">Loading testimonials...</p>}
        {!loading && items.length === 0 && (
          <p className="card-surface p-8 text-center text-sm text-ink-400">No testimonials added yet.</p>
        )}
        {items.map((t) => (
          <div key={t.id} className="card-surface flex items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink-50">{t.client_name}</p>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-gold-400" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                {!t.is_active && <span className="text-xs text-ink-500">(hidden)</span>}
              </div>
              <p className="mt-1 text-xs text-ink-400">{t.event_type} {t.location && `· ${t.location}`}</p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-300">{t.review}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => handleToggle(t)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title={t.is_active ? 'Hide' : 'Show'}>
                {t.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(t)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-red-400 hover:text-red-300" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
