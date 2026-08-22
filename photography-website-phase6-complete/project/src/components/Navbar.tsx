import { useEffect, useState } from 'react';
import { Menu, X, Aperture } from 'lucide-react';
import { navLinks } from '@/data/content';
import { studioConfig } from '@/config/studio';
import { useActiveSection } from '@/hooks/useScrollReveal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection([
    'home',
    'about',
    'services',
    'portfolio',
    'weddings',
    'modeling',
    'contact',
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ink-950/85 backdrop-blur-md border-b border-ink-700/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-px mx-auto flex max-w-7xl items-center justify-between py-4 lg:py-5">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2.5 text-ink-50 transition-colors hover:text-gold-300"
          >
            <Aperture className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
            <span className="font-display text-xl font-semibold tracking-wide">
              {studioConfig.name}
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                      isActive
                        ? 'text-gold-300'
                        : 'text-ink-200 hover:text-ink-50'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <button
            onClick={() => handleNavClick('#contact')}
            className="hidden lg:inline-flex btn-primary"
          >
            Book a Shoot
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink-100 transition-colors hover:text-gold-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-display text-3xl font-medium text-ink-100 transition-all duration-300 hover:text-gold-300"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#contact')}
            className="btn-primary mt-8"
          >
            Book a Shoot
          </button>
        </div>
      </div>
    </>
  );
}
