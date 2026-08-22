import { type ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Aperture, LayoutDashboard, CalendarRange, Settings, LogOut, Menu, X, MessageSquareQuote, PackageIcon, Sparkles, Images } from 'lucide-react';
import { useAuth } from '@/admin/lib/AuthContext';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarRange, end: false },
  { to: '/admin/content/services', label: 'Services', icon: Sparkles, end: false },
  { to: '/admin/content/portfolio', label: 'Portfolio', icon: Images, end: false },
  { to: '/admin/content/testimonials', label: 'Testimonials', icon: MessageSquareQuote, end: false },
  { to: '/admin/content/packages', label: 'Packages', icon: PackageIcon, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, session } = useAuth();
  const { settings } = useBusinessSettings();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
      isActive
        ? 'bg-gold-500/10 text-gold-300 border border-gold-400/30'
        : 'text-ink-300 border border-transparent hover:text-ink-50 hover:bg-ink-800/60'
    }`;

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-4 lg:hidden">
        <div className="flex items-center gap-2 text-ink-50">
          <Aperture className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
          <span className="font-display text-lg font-semibold">{settings.studio_name} Admin</span>
        </div>
        <button onClick={() => setMenuOpen((v) => !v)} className="text-ink-200" aria-label="Toggle menu">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={`border-b border-ink-700/60 bg-ink-900/60 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r ${
            menuOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <div className="hidden items-center gap-2.5 border-b border-ink-700/60 px-6 py-6 lg:flex">
            <Aperture className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
            <div>
              <p className="font-display text-lg font-semibold text-ink-50">{settings.studio_name}</p>
              <p className="text-xs uppercase tracking-widest text-ink-400">Admin</p>
            </div>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass} onClick={() => setMenuOpen(false)}>
                <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-ink-700/60 p-4">
            <p className="mb-3 truncate px-2 text-xs text-ink-400">{session?.user?.email}</p>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg border border-ink-600 px-4 py-2.5 text-sm text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
