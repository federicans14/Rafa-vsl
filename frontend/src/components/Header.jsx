import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';
import MagneticButton from './MagneticButton.jsx';
import { BRAND, buildWhatsappUrl } from '../config.js';

/**
 * Píldora fija arriba. Transparente al cargar para no competir con el titular, y
 * con fondo difuminado en cuanto se hace scroll.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={clsx(
          'container-site flex items-center justify-between gap-4 rounded-full px-5 py-3 transition-all duration-300',
          scrolled ? 'border border-white/10 bg-black/70 backdrop-blur-xl' : 'border border-transparent'
        )}
      >
        <span className="text-sm font-extrabold tracking-tight sm:text-base">
          {BRAND.wordmark} <span className="text-brand-blue">{BRAND.wordmarkAccent}</span>
        </span>

        <MagneticButton
          href={buildWhatsappUrl()}
          variant="outline"
          className="px-4 py-2 text-[11px] sm:px-5"
        >
          <MessageCircle size={15} />
          <span className="hidden sm:inline">Escríbeme</span>
          <span className="sm:hidden">WhatsApp</span>
        </MagneticButton>
      </div>
    </header>
  );
}
