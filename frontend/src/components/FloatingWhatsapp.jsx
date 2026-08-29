import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';
import { buildWhatsappUrl } from '../config.js';

/**
 * Botón flotante de WhatsApp, siempre a mano.
 *
 * **Aparece solo cuando el visitante ha pasado el vídeo**, no desde el principio.
 * El motivo es de negocio, no de diseño: esta landing existe para traer leads
 * calientes, y quien escribe antes de ver el VSL llega tan frío como los del
 * funnel del plan gratuito. Se le deja ver primero y se le da el botón después.
 *
 * El umbral es el alto de la ventana: cuando el hero con el vídeo ya ha salido
 * de pantalla, el botón entra.
 */
export default function FloatingWhatsapp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alUsarScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };

    alUsarScroll();
    window.addEventListener('scroll', alUsarScroll, { passive: true });
    return () => window.removeEventListener('scroll', alUsarScroll);
  }, []);

  return (
    <a
      href={buildWhatsappUrl()}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={clsx(
        'fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full',
        'bg-brand-gradient py-4 pl-5 pr-6 text-sm font-semibold shadow-pill',
        'transition-all duration-500 ease-out sm:bottom-7 sm:right-7',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      )}
    >
      {/* El punto que late dice "hay alguien al otro lado" mejor que una frase. */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>

      <MessageCircle size={18} className="shrink-0" />

      {/* En móvil solo "Escríbeme": el texto largo se comería media pantalla. */}
      <span className="hidden sm:inline">Escríbeme por WhatsApp</span>
      <span className="sm:hidden">Escríbeme</span>
    </a>
  );
}
