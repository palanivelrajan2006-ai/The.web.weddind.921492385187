import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { fetchAll, createRow, updateRow, deleteRow, toggleActive } from '@/admin/lib/contentApi';
import { useAuditLog } from '@/admin/lib/auditLog';
import { iconRegistry, iconNames, resolveIcon } from '@/lib/iconRegistry';
import type { Service } from '@/types/database';

type FormState = Omit<Service, 'id' | 'created_at' | 'features'> & { featuresText: string };

const emptyForm: FormState = {
  title: '',
  description: '',
  image_url: '',
  icon_name: 'Camera',
  featuresText: '',
  is_active: true,
  display_order: 0,
};

export default function ServicesAdminPage() {
  const logAction = useAuditLog();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAll<Service>('services')
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

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description ?? '',
      image_url: s.image_url ?? '',
      icon_name: s.icon_name,
      featuresText: (s.features ?? []).join('\n'),
      is_active: s.is_active,
      display_order: s.display_order,
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
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await updateRow('services', editingId, payload);
        logAction('Edited service', 'services', editingId);
      } else {
        const created = await createRow('services', payload);
        logAction('Added service', 'services', (created as { id: string }).id);
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
    if (!confirm('Delete this service? This cannot be undone.')) return;
    await deleteRow('services', id);
    logAction('Deleted service', 'services', id);
    load();
  };

  const handleToggle = async (s: Service) => {
    await toggleActive('services', s.id, !s.is_active);
    logAction(s.is_active ? 'Disabled service' : 'Enabled service', 'services', s.id);
    load();
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">Services</h1>
          <p className="mt-1 text-sm text-ink-400">{items.length} services · shown on the public site in display order</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">{errorMsg}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink-50">
              {editingId ? 'Edit Service' : 'New Service'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className={labelClass}>Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className={labelClass}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconNames.map((name) => {
                const Icon = iconRegistry[name];
                const selected = form.icon_name === name;
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setForm({ ...form, icon_name: name })}
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                      selected ? 'border-gold-400 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300 hover:border-ink-400'
                    }`}
                    title={name}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Features (one per line)</label>
            <textarea rows={4} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} className={`${inputClass} resize-none`} placeholder={'Full-day coverage\nDrone shots\n2 photographers'} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Image URL (optional)</label>
              <input value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} />
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
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Service'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink-400">Loading services...</p>}
        {!loading && items.length === 0 && (
          <p className="card-surface p-8 text-center text-sm text-ink-400">No services added yet.</p>
        )}
        {items.map((s) => {
          const Icon = resolveIcon(s.icon_name);
          return (
            <div key={s.id} className="card-surface flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-500/10 text-gold-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-50">{s.title}</p>
                    {!s.is_active && <span className="text-xs text-ink-500">(hidden)</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-ink-300">{s.description}</p>
                  {s.features?.length > 0 && (
                    <p className="mt-1 text-xs text-ink-400">{s.features.slice(0, 3).join(' · ')}{s.features.length > 3 ? ' ...' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => handleToggle(s)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title={s.is_active ? 'Hide' : 'Show'}>
                  {s.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(s)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-gold-400 hover:text-gold-300" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="rounded-lg border border-ink-600 p-2 text-ink-300 hover:border-red-400 hover:text-red-300" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
