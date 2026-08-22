import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, Film, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { fetchAll, createRow, updateRow, deleteRow, toggleActive } from '@/admin/lib/contentApi';
import { uploadPortfolioMedia } from '@/admin/lib/storage';
import { useAuditLog } from '@/admin/lib/auditLog';
import type { PortfolioItem } from '@/types/database';

const categories = ['Weddings', 'Events', 'Pre-Wedding', 'Portraits', 'Modeling', 'Fashion', 'Commercial', 'Videos'];

type FormState = Omit<PortfolioItem, 'id' | 'created_at'>;

const emptyForm: FormState = {
  title: '',
  category: 'Weddings',
  media_type: 'image',
  media_url: '',
  thumbnail_url: '',
  is_active: true,
  display_order: 0,
};

export default function PortfolioAdminPage() {
  const logAction = useAuditLog();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAll<PortfolioItem>('portfolio_items')
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

  const openEdit = (p: PortfolioItem) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      media_type: p.media_type,
      media_url: p.media_url,
      thumbnail_url: p.thumbnail_url ?? '',
      is_active: p.is_active,
      display_order: p.display_order,
    });
    setShowForm(true);
  };

  const handleFileChange = async (file: File | undefined, target: 'media_url' | 'thumbnail_url') => {
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const url = await uploadPortfolioMedia(file, form.category);
      setForm((f) => ({ ...f, [target]: url }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const payload = { ...form, thumbnail_url: form.thumbnail_url || null };
    try {
      if (editingId) {
        await updateRow('portfolio_items', editingId, payload);
        logAction('Edited portfolio item', 'portfolio_items', editingId);
      } else {
        const created = await createRow('portfolio_items', payload);
        logAction('Added portfolio item', 'portfolio_items', (created as { id: string }).id);
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
    if (!confirm('Delete this portfolio item? This cannot be undone.')) return;
    await deleteRow('portfolio_items', id);
    logAction('Deleted portfolio item', 'portfolio_items', id);
    load();
  };

  const handleToggle = async (p: PortfolioItem) => {
    await toggleActive('portfolio_items', p.id, !p.is_active);
    logAction(p.is_active ? 'Disabled portfolio item' : 'Enabled portfolio item', 'portfolio_items', p.id);
    load();
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">Portfolio</h1>
          <p className="mt-1 text-sm text-ink-400">{items.length} items · shown on the public site, filterable by category</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Portfolio Item
        </button>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">{errorMsg}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink-50">
              {editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-ink-900">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, media_type: 'image' })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  form.media_type === 'image' ? 'border-gold-400 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300'
                }`}
              >
                <ImageIcon className="h-4 w-4" /> Image
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, media_type: 'video' })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  form.media_type === 'video' ? 'border-gold-400 bg-gold-500/10 text-gold-300' : 'border-ink-600 text-ink-300'
                }`}
              >
                <Film className="h-4 w-4" /> Video
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>{form.media_type === 'video' ? 'Video File' : 'Image File'}</label>
            <div className="flex items-center gap-3">
              <label className="btn-ghost cursor-pointer">
                <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept={form.media_type === 'video' ? 'video/*' : 'image/*'}
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleFileChange(e.target.files?.[0], 'media_url')}
                />
              </label>
              {form.media_url && <span className="truncate text-xs text-ink-400">{form.media_url.split('/').pop()}</span>}
            </div>
            <input
              value={form.media_url}
              onChange={(e) => setForm({ ...form, media_url: e.target.value })}
              className={`${inputClass} mt-2`}
              placeholder="Or paste a URL directly"
              required
            />
          </div>

          {form.media_type === 'video' && (
            <div>
              <label className={labelClass}>Thumbnail Image (optional but recommended)</label>
              <div className="flex items-center gap-3">
                <label className="btn-ghost cursor-pointer">
                  <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleFileChange(e.target.files?.[0], 'thumbnail_url')} />
                </label>
                {form.thumbnail_url && <span className="truncate text-xs text-ink-400">{form.thumbnail_url.split('/').pop()}</span>}
              </div>
              <input value={form.thumbnail_url ?? ''} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className={`${inputClass} mt-2`} placeholder="Or paste a URL directly" />
            </div>
          )}

          {form.media_url && form.media_type === 'image' && (
            <img src={form.media_url} alt="Preview" className="h-32 w-full rounded-lg object-cover" />
          )}

          <div>
            <label className={labelClass}>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={`${inputClass} max-w-[10rem]`} />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-400" />
            Active (visible on public site)
          </label>

          <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-70">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading && <p className="col-span-full text-sm text-ink-400">Loading portfolio...</p>}
        {!loading && items.length === 0 && (
          <p className="card-surface col-span-full p-8 text-center text-sm text-ink-400">No portfolio items added yet.</p>
        )}
        {items.map((p) => (
          <div key={p.id} className="card-surface group relative overflow-hidden">
            <img
              src={p.media_type === 'video' ? p.thumbnail_url ?? p.media_url : p.media_url}
              alt={p.title}
              className="h-40 w-full object-cover"
            />
            {p.media_type === 'video' && (
              <span className="absolute right-2 top-2 rounded-full bg-ink-950/70 p-1.5">
                <Film className="h-3.5 w-3.5 text-gold-300" />
              </span>
            )}
            {!p.is_active && (
              <span className="absolute left-2 top-2 rounded-full bg-ink-950/70 px-2 py-0.5 text-xs text-ink-300">Hidden</span>
            )}
            <div className="p-3">
              <p className="truncate text-sm font-medium text-ink-50">{p.title}</p>
              <p className="text-xs text-ink-400">{p.category}</p>
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => handleToggle(p)} className="rounded-lg border border-ink-600 p-1.5 text-ink-300 hover:border-gold-400 hover:text-gold-300" title={p.is_active ? 'Hide' : 'Show'}>
                  {p.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => openEdit(p)} className="rounded-lg border border-ink-600 p-1.5 text-ink-300 hover:border-gold-400 hover:text-gold-300" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-ink-600 p-1.5 text-ink-300 hover:border-red-400 hover:text-red-300" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
