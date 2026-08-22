import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Inbox, PhoneCall, MessageSquareText, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import StatusBadge from '@/admin/components/StatusBadge';
import { fetchBookings } from '@/admin/lib/bookingsApi';
import type { Booking } from '@/types/database';

const statCards: { key: Booking['status'] | 'TOTAL'; label: string; icon: typeof Inbox }[] = [
  { key: 'TOTAL', label: 'Total Enquiries', icon: Inbox },
  { key: 'NEW', label: 'New', icon: Inbox },
  { key: 'CONTACTED', label: 'Contacted', icon: PhoneCall },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
  { key: 'CANCELLED', label: 'Cancelled', icon: XCircle },
];

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { TOTAL: bookings.length };
    for (const b of bookings) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [bookings]);

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status === 'CONFIRMED' && b.event_date && new Date(b.event_date) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime())
        .slice(0, 6),
    [bookings]
  );

  const recent = useMemo(() => bookings.slice(0, 6), [bookings]);

  const syncCounts = useMemo(() => {
    const c = { SYNCED: 0, PENDING: 0, FAILED: 0 };
    for (const b of bookings) c[b.sheet_sync_status] = (c[b.sheet_sync_status] ?? 0) + 1;
    return c;
  }, [bookings]);

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-medium text-ink-50">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-400">Overview of your bookings and enquiries.</p>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-ink-400">Loading bookings...</p>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map(({ key, label, icon: Icon }) => (
              <div key={key} className="card-surface p-4 sm:p-5">
                <Icon className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                <p className="mt-3 font-display text-2xl font-medium text-ink-50">{counts[key] ?? 0}</p>
                <p className="text-xs uppercase tracking-wider text-ink-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Upcoming events */}
            <div className="card-surface p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-medium text-ink-50">
                <CalendarClock className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                Upcoming Events
              </h2>
              <div className="mt-4 space-y-3">
                {upcoming.length === 0 && <p className="text-sm text-ink-400">No upcoming confirmed events.</p>}
                {upcoming.map((b) => (
                  <Link
                    key={b.id}
                    to={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-lg border border-ink-700 px-4 py-3 transition-colors hover:border-gold-400/40"
                  >
                    <div>
                      <p className="text-sm text-ink-100">{b.customer_name}</p>
                      <p className="text-xs text-ink-400">{b.event_type} · {b.event_location || 'No location set'}</p>
                    </div>
                    <p className="text-sm font-medium text-gold-300">
                      {new Date(b.event_date!).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent enquiries */}
            <div className="card-surface p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-medium text-ink-50">
                <MessageSquareText className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                Recent Enquiries
              </h2>
              <div className="mt-4 space-y-3">
                {recent.length === 0 && <p className="text-sm text-ink-400">No enquiries yet.</p>}
                {recent.map((b) => (
                  <Link
                    key={b.id}
                    to={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-lg border border-ink-700 px-4 py-3 transition-colors hover:border-gold-400/40"
                  >
                    <div>
                      <p className="text-sm text-ink-100">{b.customer_name}</p>
                      <p className="text-xs text-ink-400">{b.booking_reference}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sync status */}
          <div className="card-surface mt-6 flex flex-wrap items-center gap-6 p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-medium text-ink-50">
              <RefreshCw className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
              Google Sheets Sync
            </h2>
            <div className="flex gap-6 text-sm">
              <span className="text-emerald-300">{syncCounts.SYNCED} synced</span>
              <span className="text-gold-300">{syncCounts.PENDING} pending</span>
              <span className="text-red-300">{syncCounts.FAILED} failed</span>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
