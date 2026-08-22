export type BookingStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'DISCUSSION'
  | 'QUOTATION_SENT'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export type SheetSyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';

export interface Booking {
  id: string;
  booking_reference: string;
  created_at: string;
  updated_at: string;

  customer_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;

  event_type: string;
  event_date: string | null;
  event_end_date: string | null;
  event_location: string | null;
  number_of_functions: number | null;
  expected_guests: number | null;

  photography_required: boolean;
  videography_required: boolean;
  editing_required: boolean;
  drone_required: boolean;
  album_required: boolean;
  reels_required: boolean;

  package_type: string | null;
  estimated_budget: string | null;

  message: string | null;
  special_requirements: string | null;

  status: BookingStatus;
  assigned_team: string | null;
  internal_notes: string | null;
  source: string;

  sheet_sync_status: SheetSyncStatus;
  sheet_sync_error: string | null;
  last_sheet_sync_at: string | null;
}

export type NewBooking = Pick<
  Booking,
  'customer_name' | 'phone' | 'event_type'
> &
  Partial<
    Omit<
      Booking,
      | 'id'
      | 'booking_reference'
      | 'created_at'
      | 'updated_at'
      | 'status'
      | 'sheet_sync_status'
      | 'sheet_sync_error'
      | 'last_sheet_sync_at'
      | 'customer_name'
      | 'phone'
      | 'event_type'
    >
  >;

export interface BusinessSettings {
  id: string;
  studio_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  service_area: string | null;
  logo_url: string | null;
  booking_reference_prefix: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  icon_name: string;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string | null;
  location: string | null;
  review: string;
  rating: number;
  photo_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_email: string | null;
  action: string;
  record_table: string | null;
  record_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

// Minimal Supabase generic Database shape — enough for typed client calls.
// Expand with `supabase gen types typescript` once the project is linked.
export interface Database {
  public: {
    Tables: {
      bookings: { Row: Booking; Insert: NewBooking; Update: Partial<Booking> };
      business_settings: {
        Row: BusinessSettings;
        Insert: Partial<BusinessSettings>;
        Update: Partial<BusinessSettings>;
      };
      services: { Row: Service; Insert: Partial<Service>; Update: Partial<Service> };
      packages: { Row: Package; Insert: Partial<Package>; Update: Partial<Package> };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Partial<PortfolioItem>;
        Update: Partial<PortfolioItem>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Partial<Testimonial>;
        Update: Partial<Testimonial>;
      };
      audit_logs: { Row: AuditLog; Insert: Partial<AuditLog>; Update: Partial<AuditLog> };
    };
  };
}
