import type { BookingStatus } from '@/types/database';

const statusStyles: Record<BookingStatus, string> = {
  NEW: 'bg-gold-500/10 text-gold-300 border-gold-400/30',
  CONTACTED: 'bg-ink-700/60 text-ink-100 border-ink-500',
  DISCUSSION: 'bg-ink-700/60 text-ink-100 border-ink-500',
  QUOTATION_SENT: 'bg-ink-700/60 text-ink-100 border-ink-500',
  CONFIRMED: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  COMPLETED: 'bg-ink-800/80 text-ink-300 border-ink-600',
  CANCELLED: 'bg-red-500/10 text-red-300 border-red-400/30',
};

const statusLabels: Record<BookingStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  DISCUSSION: 'In Discussion',
  QUOTATION_SENT: 'Quotation Sent',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
