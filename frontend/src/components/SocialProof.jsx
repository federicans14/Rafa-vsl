import { useState } from 'react';
import { Play } from 'lucide-react';
import { VSL } from '../config.js';

/**
 * Testimonios en vídeo del canal propio de Rafa.
 *
 * Se eligen en vídeo y no fotos a propósito: esta landing busca leads
 * cualificados, y una persona hablando a cámara convence más que un antes/después
 * a alguien que acaba de ver nueve minutos de VSL.
 *
 * Las cifras son las que él dice en el vídeo. **No inventar ninguna**: colgar un
 * número sin confirmar sobre la cara de una persona real es publicidad falsa.
 */
const TESTIMONIOS = [
  {
    id: '4qTYmhSgwpM',
    nombre: 'Michal',
    dato: '−10 kg',
    resumen: 'Tenía entrenador presencial dos días por semana y seguía sin quitarse la grasa abdominal.',
    miniatura: '/testimonios/michal.jpg',
  },
  {
    id: '-LCE9UVlpKY',
    nombre: 'José',
    dato: '−16 kg',
    resumen: 'Evitaba los planes de playa y llegó a pensar en pasar por quirófano. Siete meses después, otro cuerpo.',
    miniatura: '/testimonios/jose.jpg',
  },
  {
    id: 'yHJmPxEnILo',
    nombre: 'Miguel',
    dato: null,
    resumen: 'Uno de los más de 800 procesos acompañados por Rafa.',
    miniatura: '/testimonios/miguel.jpg',
  },
];

function Tarjeta({ testimonio }) {
  const [reproduciendo, setReproduciendo] = useState(false);

  return (
    <article className="surface overflow-hidden">
      <div className="relative aspect-video bg-black/50">
        {reproduciendo ? (
          <iframe
            className="h-full w-full"
            src={`${VSL.embedBase}${testimonio.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`Testimonio de ${testimonio.nombre}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setReproduciendo(true)}
            aria-label={`Reproducir el testimonio de ${testimonio.nombre}`}
            className="group relative h-full w-full"
          >
            <img
              src={testimonio.miniatura}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />

            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-gradient shadow-pill transition-transform duration-300 group-hover:scale-110">
              <Play size={20} className="translate-x-0.5 fill-white text-white" />
            </span>

            {testimonio.dato && (
              <span className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
                <span className="block text-sm font-black leading-none">{testimonio.dato}</span>
              </span>
            )}
          </button>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm font-bold">{testimonio.nombre}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/50">{testimonio.resumen}</p>
      </div>
    </article>
  );
}

export default function SocialProof() {
  return (
    <section className="container-site mt-28 sm:mt-36">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker">Casos reales</p>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
          No buscamos que la báscula marque menos
        </h2>
        <p className="mt-4 leading-relaxed text-white/55">
          Buscamos que vuelvas a sentirte fuerte, seguro y cómodo con tu cuerpo.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIOS.map((t) => (
          <Tarjeta key={t.id} testimonio={t} />
        ))}
      </div>
    </section>
  );
}
