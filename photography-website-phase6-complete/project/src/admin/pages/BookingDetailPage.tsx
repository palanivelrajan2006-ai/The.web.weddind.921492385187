import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, RefreshCw, Check } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import StatusBadge from '@/admin/components/StatusBadge';
import { fetchBooking, updateBookingStatus, updateBookingNotes, updateBookingAssignedTeam } from '@/admin/lib/bookingsApi';
import { useAuditLog } from '@/admin/lib/auditLog';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import type { Booking, BookingStatus } from '@/types/database';

const statuses: BookingStatus[] = [
  'NEW', 'CONTACTED', 'DISCUSSION', 'QUOTATION_SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED',
];

const serviceFlags: { key: keyof Booking; label: string }[] = [
  { key: 'photography_required', label: 'Photography' },
  { key: 'videography_required', label: 'Videography' },
  { key: 'editing_required', label: 'Editing' },
  { key: 'drone_required', label: 'Drone' },
  { key: 'album_required', label: 'Album' },
  { key: 'reels_required', label: 'Reels' },
];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { settings } = useBusinessSettings();
  const logAction = useAuditLog();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [team, setTeam] = useState('');
  const [saved, setSaved] = useState<'notes' | 'team' | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBooking(id).then((b) => {
      setBooking(b);
      setNotes(b?.internal_notes ?? '');
      setTeam(b?.assigned_team ?? '');
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (status: BookingStatus) => {
    if (!booking) return;
    await updateBookingStatus(booking.id, status);
    setBooking({ ...booking, status });
    logAction('Changed booking status', 'bookings', booking.id, { to: status });
  };

  const handleSaveNotes = async () => {
    if (!booking) return;
    await updateBookingNotes(booking.id, notes);
    setSaved('notes');
    logAction('Updated internal notes', 'bookings', booking.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleSaveTeam = async () => {
    if (!booking) return;
    await updateBookingAssignedTeam(booking.id, team);
    setSaved('team');
    logAction('Updated assigned team', 'bookings', booking.id, { team });
    setTimeout(() => setSaved(null), 2000);
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-sm text-ink-400">Loading booking...</p>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <p className="text-sm text-ink-400">Booking not found.</p>
        <Link to="/admin/bookings" className="mt-4 inline-block text-sm text-gold-300 hover:underline">
          ← Back to bookings
        </Link>
      </AdminLayout>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi ${booking.customer_name}, this is ${settings.studio_name}. We received your photography/videography enquiry with booking reference ${booking.booking_reference}. We would like to discuss your requirements.`
  );
  const whatsappHref = `https://wa.me/${(booking.whatsapp ?? booking.phone).replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <AdminLayout>
      <Link to="/admin/bookings" className="flex items-center gap-2 text-sm text-ink-400 hover:text-gold-300">
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">{booking.customer_name}</h1>
          <p className="mt-1 text-sm text-ink-400">{booking.booking_reference} · Submitted {new Date(booking.created_at).toLocaleString()}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Customer Information</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-ink-200"><Phone className="h-4 w-4 text-gold-400" /> {booking.phone}</p>
              {booking.email && <p className="flex items-center gap-2 text-ink-200"><Mail className="h-4 w-4 text-gold-400" /> {booking.email}</p>}
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Event Information</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs uppercase tracking-wider text-ink-400">Event Type</p><p className="mt-1 text-ink-100">{booking.event_type}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-ink-400">Event Date</p><p className="mt-1 text-ink-100">{booking.event_date ? new Date(booking.event_date).toLocaleDateString() : '—'}</p></div>
              <div className="col-span-2 flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold-400 mt-0.5" /><p className="text-ink-100">{booking.event_location || '—'}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-ink-400">Functions</p><p className="mt-1 text-ink-100">{booking.number_of_functions ?? '—'}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-ink-400">Expected Guests</p><p className="mt-1 text-ink-100">{booking.expected_guests ?? '—'}</p></div>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Services Requested</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {serviceFlags.filter((f) => booking[f.key]).map((f) => (
                <span key={f.key} className="rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-1 text-xs text-gold-300">
                  {f.label}
                </span>
              ))}
              {serviceFlags.every((f) => !booking[f.key]) && <p className="text-sm text-ink-400">No specific services flagged.</p>}
            </div>
            {(booking.package_type || booking.estimated_budget) && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {booking.package_type && <div><p className="text-xs uppercase tracking-wider text-ink-400">Package</p><p className="mt-1 text-ink-100">{booking.package_type}</p></div>}
                {booking.estimated_budget && <div><p className="text-xs uppercase tracking-wider text-ink-400">Budget</p><p className="mt-1 text-ink-100">{booking.estimated_budget}</p></div>}
              </div>
            )}
          </div>

          {(booking.message || booking.special_requirements) && (
            <div className="card-surface p-6">
              <h2 className="font-display text-lg font-medium text-ink-50">Requirements</h2>
              {booking.message && <p className="mt-3 whitespace-pre-wrap text-sm text-ink-200">{booking.message}</p>}
              {booking.special_requirements && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-ink-200">
                  <span className="text-ink-400">Special requirements: </span>{booking.special_requirements}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: management */}
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Actions</h2>
            <div className="mt-4 space-y-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                <MessageCircle className="h-4 w-4" /> WhatsApp Customer
              </a>
              <a href={`tel:${booking.phone}`} className="btn-ghost w-full">
                <Phone className="h-4 w-4" /> Call Customer
              </a>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Status</h2>
            <select
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
              className={`${inputClass} mt-4`}
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-ink-900">{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Assigned Team</h2>
            <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Team A — Ravi & Priya" className={`${inputClass} mt-4`} />
            <button onClick={handleSaveTeam} className="btn-ghost mt-3 w-full">
              {saved === 'team' ? <><Check className="h-4 w-4" /> Saved</> : 'Save'}
            </button>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-medium text-ink-50">Internal Notes</h2>
            <p className="mt-1 text-xs text-ink-400">Never shown to the customer.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className={`${inputClass} mt-4 resize-none`}
              placeholder="e.g. Customer requested two photographers..."
            />
            <button onClick={handleSaveNotes} className="btn-ghost mt-3 w-full">
              {saved === 'notes' ? <><Check className="h-4 w-4" /> Saved</> : 'Save Notes'}
            </button>
          </div>

          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-medium text-ink-50">
              <RefreshCw className="h-4 w-4 text-gold-400" /> Google Sheets
            </h2>
            <div className="mt-4 space-y-1.5 text-sm text-ink-300">
              <p>Status: <span className="text-ink-100">{booking.sheet_sync_status}</span></p>
              {booking.last_sheet_sync_at && <p>Last synced: {new Date(booking.last_sheet_sync_at).toLocaleString()}</p>}
              {booking.sheet_sync_error && <p className="text-red-300">{booking.sheet_sync_error}</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
