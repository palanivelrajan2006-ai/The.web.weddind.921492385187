import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAuditLog } from '@/admin/lib/auditLog';
import type { BusinessSettings } from '@/types/database';

export default function SettingsPage() {
  const logAction = useAuditLog();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle<BusinessSettings>()
      .then(({ data, error }) => {
        if (error) setErrorMsg(error.message);
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setErrorMsg(null);
    const { id, updated_at, ...rest } = settings;
    void updated_at;
    const { error } = await supabase.from('business_settings').update(rest as never).eq('id', id);
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSaved(true);
      logAction('Updated business settings', 'business_settings', id);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-medium text-ink-50">Business Settings</h1>
      <p className="mt-1 text-sm text-ink-400">
        Changes here update the public website immediately — phone, WhatsApp, and email everywhere on
        the site pull from this one place.
      </p>

      {loading && <p className="mt-8 text-sm text-ink-400">Loading settings...</p>}

      {!loading && settings && (
        <form onSubmit={handleSubmit} className="card-surface mt-6 max-w-2xl space-y-5 p-6 sm:p-8">
          <div>
            <label className={labelClass} htmlFor="studio_name">Studio Name</label>
            <input id="studio_name" value={settings.studio_name} onChange={(e) => handleChange('studio_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="tagline">Tagline</label>
            <input id="tagline" value={settings.tagline} onChange={(e) => handleChange('tagline', e.target.value)} className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="phone">Phone Number</label>
              <input id="phone" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className={labelClass} htmlFor="whatsapp">WhatsApp Number</label>
              <input id="whatsapp" value={settings.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} className={inputClass} placeholder="919876543210 (digits only)" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="email">Email Address</label>
            <input id="email" type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass} htmlFor="address">Studio Location</label>
            <input id="address" value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="business_hours">Business Hours</label>
              <input id="business_hours" value={settings.business_hours} onChange={(e) => handleChange('business_hours', e.target.value)} className={inputClass} placeholder="Mon–Sat, 10 AM – 7 PM" />
            </div>
            <div>
              <label className={labelClass} htmlFor="service_area">Service Area</label>
              <input id="service_area" value={settings.service_area ?? ''} onChange={(e) => handleChange('service_area', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="border-t border-ink-700/60 pt-5">
            <p className="mb-4 text-xs uppercase tracking-widest text-ink-400">Social Links</p>
            <div className="space-y-4">
              <input value={settings.instagram_url ?? ''} onChange={(e) => handleChange('instagram_url', e.target.value)} className={inputClass} placeholder="Instagram URL" />
              <input value={settings.facebook_url ?? ''} onChange={(e) => handleChange('facebook_url', e.target.value)} className={inputClass} placeholder="Facebook URL" />
              <input value={settings.youtube_url ?? ''} onChange={(e) => handleChange('youtube_url', e.target.value)} className={inputClass} placeholder="YouTube URL" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="booking_reference_prefix">Booking Reference Prefix</label>
            <input id="booking_reference_prefix" value={settings.booking_reference_prefix} onChange={(e) => handleChange('booking_reference_prefix', e.target.value)} className={inputClass} placeholder="LS" />
            <p className="mt-1.5 text-xs text-ink-400">e.g. "LS" produces references like LS-2026-0001.</p>
          </div>

          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? 'Saving...' : saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save Changes'}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
