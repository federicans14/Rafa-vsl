import { Instagram } from 'lucide-react';
import { BRAND } from '../config.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 rounded-t-xl3 border-t border-white/10 bg-ink-soft">
      <div className="container-site flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-base font-extrabold">
          {BRAND.wordmark} <span className="text-brand-blue">{BRAND.wordmarkAccent}</span>
        </p>

        <p className="max-w-md text-sm leading-relaxed text-white/45">
          {BRAND.program}: entrenamiento y nutrición adaptados a la vida que ya tienes.
        </p>

        <a
          href={`https://instagram.com/${BRAND.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <Instagram size={16} />
          {BRAND.instagram}
        </a>

        {/* Indicador de que hay alguien al otro lado. El punto que late hace más
            por la sensación de "esto está vivo" que cualquier frase. */}
        <p className="mt-2 inline-flex items-center gap-2 text-[13px] text-white/40">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Respondo personalmente por WhatsApp
        </p>

        <p className="mt-4 text-xs text-white/25">
          © {year} {BRAND.coach}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
