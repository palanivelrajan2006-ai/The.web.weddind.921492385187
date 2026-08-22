import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import StatusBadge from '@/admin/components/StatusBadge';
import { fetchBookings, bookingsToCsv } from '@/admin/lib/bookingsApi';
import type { Booking, BookingStatus } from '@/types/database';

const statusOptions: (BookingStatus | 'ALL')[] = [
  'ALL', 'NEW', 'CONTACTED', 'DISCUSSION', 'QUOTATION_SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED',
];

type SortKey = 'newest' | 'oldest' | 'event_date';

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  const eventTypes = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.event_type))).sort(),
    [bookings]
  );

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter !== 'ALL') list = list.filter((b) => b.status === statusFilter);
    if (eventTypeFilter !== 'ALL') list = list.filter((b) => b.event_type === eventTypeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(q) ||
          b.booking_reference.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          (b.email ?? '').toLowerCase().includes(q) ||
          (b.event_location ?? '').toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      // event_date, nulls last
      const ad = a.event_date ? new Date(a.event_date).getTime() : Infinity;
      const bd = b.event_date ? new Date(b.event_date).getTime() : Infinity;
      return ad - bd;
    });

    return list;
  }, [bookings, statusFilter, eventTypeFilter, query, sort]);

  const handleExport = () => {
    const csv = bookingsToCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    'rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-50">Bookings</h1>
          <p className="mt-1 text-sm text-ink-400">{filtered.length} of {bookings.length} enquiries</p>
        </div>
        <button onClick={handleExport} className="btn-ghost">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card-surface mt-6 flex flex-wrap gap-4 p-4 sm:p-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, reference, phone, email, location..."
            className={`${inputClass} w-full pl-9`}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')} className={inputClass}>
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-ink-900">{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)} className={inputClass}>
          <option value="ALL" className="bg-ink-900">All Event Types</option>
          {eventTypes.map((t) => (
            <option key={t} value={t} className="bg-ink-900">{t}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={inputClass}>
          <option value="newest" className="bg-ink-900">Newest First</option>
          <option value="oldest" className="bg-ink-900">Oldest First</option>
          <option value="event_date" className="bg-ink-900">By Event Date</option>
        </select>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">{errorMsg}</p>
      )}

      {/* List */}
      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink-400">Loading bookings...</p>}
        {!loading && filtered.length === 0 && (
          <p className="card-surface p-8 text-center text-sm text-ink-400">No enquiries match these filters.</p>
        )}
        {filtered.map((b) => (
          <Link
            key={b.id}
            to={`/admin/bookings/${b.id}`}
            className="card-surface flex flex-col gap-3 p-4 transition-colors hover:border-gold-400/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-ink-50">{b.customer_name}</p>
                <span className="text-xs text-ink-500">{b.booking_reference}</span>
              </div>
              <p className="mt-1 truncate text-xs text-ink-400">
                {b.event_type} · {b.phone}
                {b.event_location ? ` · ${b.event_location}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-ink-400">
                {b.event_date ? new Date(b.event_date).toLocaleDateString() : '— no date —'}
              </p>
              <StatusBadge status={b.status} />
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
