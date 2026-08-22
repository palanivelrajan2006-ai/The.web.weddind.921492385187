import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Star } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { fetchAll, createRow, updateRow, deleteRow, toggleActive } from '@/admin/lib/contentApi';
import { useAuditLog } from '@/admin/lib/auditLog';
import type { Package } from '@/types/database';

type FormState = Omit<Package, 'id' | 'created_at' | 'features'> & { featuresText: string };

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  featuresText: '',
  is_featured: false,
  is_active: true,
  display_order: 0,
};

export default function PackagesAdminPage() {
  const logAction = useAuditLog();
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAll<Package>('packages')
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

  const openEdit = (p: Package) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: p.price ?? '',
      featuresText: (p.features ?? []).join('\n'),
      is_featured: p.is_featured,
      is_active: p.is_active,
      display_order: p.display_order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const { featuresText, ...rest } = form;
    const payload = {
      ...rest,
      price: rest.price?.trim() || null,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await updateRow('packages', editingId, payload);
        logAction('Edited package', 'packages', editingId);
      } else {
        const created = await createRow('packages', payload);
        logAction('Added package', 'packages', (created as { id: string }).id);
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
    if (!confirm('Delete this package? This cannot be undone.')) return;
    await deleteRow('packages', id);
    logAction('Deleted package', 'packages', id);
    load();
  };

  const handleToggle = async (p: Package) => {
    await toggleActive('packages', p.id, !p.is_active);
    logAction(p.is_active ? 'Disabled package' : 'Enabled package', 'packages', p.id);
    load();
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">Packages</h1>
          <p className="mt-1 text-sm text-ink-400">{items.length} packages · internal reference for now (no public display slot yet)</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Package
        </button>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">{errorMsg}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink-50">
              {editingId ? 'Edit Package' : 'New Package'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Package Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price (leave blank for "Contact for pricing")</label>
              <input value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="₹45,000" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className={labelClass}>Features (one per line)</label>
            <textarea rows={5} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} className={`${inputClass} resize-none`} placeholder={'2 photographers\nFull-day coverage\n500 edited photos'} />
          </div>

          <div>
            <label className={labelClass}>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={`${inputClass} max-w-[10rem]`} />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-200">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-400" />
              Featured (highlighted package)
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-200">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-400" />
              Active
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Package'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink-400">Loading packages...</p>}
        {!loading && items.length === 0 && (
          <p className="card-surface p-8 text-center text-sm text-ink-400">No packages added yet.</p>
        )}
        {items.map((p) => (
          <div key={p.id} className="card-surface flex items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink-50">{p.name}</p>
                {p.is_featured && <Star className="h-3.5 w-3.5 text-gold-400" fill="currentColor" strokeWidth={0} />}
                {!p.is_active && <span className="text-xs text-ink-500">(hidden)</span>}
              </div>
              <p className="mt-1 text-sm text-gold-300">{p.price || 'Contact for pricing'}</p>
              {p.features?.length > 0 && (
                <p className="mt-1 text-xs text-ink-400">{p.features.slice(0, 3).join(' · ')}{p.features.length > 3 ? ' ...' : ''}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => handleToggle(p)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title={p.is_active ? 'Hide' : 'Show'}>
                {p.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-red-400 hover:text-red-300" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
