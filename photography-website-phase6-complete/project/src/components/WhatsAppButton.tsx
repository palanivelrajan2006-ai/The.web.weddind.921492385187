import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { studioConfig } from '@/config/studio';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

export default function WhatsAppButton() {
  const { settings } = useBusinessSettings();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setTooltip(true), 1000);
      const dismiss = setTimeout(() => setTooltip(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(dismiss);
      };
    }
  }, [visible]);

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    studioConfig.whatsappMessage
  )}`;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 pointer-events-none opacity-0'
      }`}
    >
      {/* Tooltip bubble */}
      {tooltip && (
        <div className="relative max-w-[200px] animate-fade-in rounded-2xl border border-ink-600 bg-ink-800 px-4 py-3 shadow-xl">
          <button
            onClick={() => setTooltip(false)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-700 text-ink-300 hover:text-ink-50"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="text-sm text-ink-100">Have a question? Chat with us on WhatsApp!</p>
        </div>
      )}

      {/* Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
      </a>
    </div>
  );
}
