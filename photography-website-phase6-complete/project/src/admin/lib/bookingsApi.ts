import { supabase } from '@/lib/supabase';
import type { Booking, BookingStatus } from '@/types/database';

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Booking[];
}

export async function fetchBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as unknown as Booking | null;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from('bookings').update({ status } as never).eq('id', id);
  if (error) throw error;
}

export async function updateBookingNotes(id: string, internal_notes: string) {
  const { error } = await supabase.from('bookings').update({ internal_notes } as never).eq('id', id);
  if (error) throw error;
}

export async function updateBookingAssignedTeam(id: string, assigned_team: string) {
  const { error } = await supabase.from('bookings').update({ assigned_team } as never).eq('id', id);
  if (error) throw error;
}

export function bookingsToCsv(bookings: Booking[]): string {
  const headers = [
    'Booking Reference', 'Date Submitted', 'Customer Name', 'Phone', 'WhatsApp', 'Email',
    'Event Type', 'Event Date', 'Event Location', 'Number of Functions', 'Expected Guests',
    'Photography', 'Videography', 'Editing', 'Drone', 'Album', 'Reels',
    'Package', 'Budget', 'Requirements', 'Status', 'Assigned Team', 'Internal Notes',
  ];
  const rows = bookings.map((b) => [
    b.booking_reference, b.created_at, b.customer_name, b.phone, b.whatsapp ?? '', b.email ?? '',
    b.event_type, b.event_date ?? '', b.event_location ?? '', b.number_of_functions ?? '', b.expected_guests ?? '',
    b.photography_required ? 'Yes' : 'No', b.videography_required ? 'Yes' : 'No', b.editing_required ? 'Yes' : 'No',
    b.drone_required ? 'Yes' : 'No', b.album_required ? 'Yes' : 'No', b.reels_required ? 'Yes' : 'No',
    b.package_type ?? '', b.estimated_budget ?? '', (b.message ?? '').replace(/\n/g, ' '),
    b.status, b.assigned_team ?? '', (b.internal_notes ?? '').replace(/\n/g, ' '),
  ]);

  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  return [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
}
