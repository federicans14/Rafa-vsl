import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Los cuatro pasos son literales del vídeo: "primero analizamos tu situación
 * actual… después diseñamos tu estrategia… a partir de ahí empiezas a trabajar
 * con el plan… y durante el proceso vamos haciendo seguimiento".
 *
 * Cada uno lleva su SVG dibujado a medida en vez de un icono de librería: es lo
 * que separa esta página de una plantilla.
 */
const PASOS = [
  {
    titulo: 'Analizamos tu situación',
    copy: 'Objetivo, experiencia, disponibilidad, alimentación, horarios y contexto. El plan parte de ti, no de una rutina estándar.',
    dibujo: 'diana',
  },
  {
    titulo: 'Diseñamos tu estrategia',
    copy: 'Un entrenamiento adaptado al tiempo que tienes y una nutrición que puedas mantener con viajes, restaurantes y fines de semana.',
    dibujo: 'planos',
  },
  {
    titulo: 'Empiezas a trabajar',
    copy: 'Con un plan claro. Sin tener que descubrir por tu cuenta qué toca hacer cada semana.',
    dibujo: 'barras',
  },
  {
    titulo: 'Seguimiento y acompañamiento',
    copy: 'Para saber cuándo mantener, cuándo progresar y cuándo modificar. Y cuando aparezca un imprevisto, no improvisas: preguntas.',
    dibujo: 'pulso',
  },
];

/** Trazos que se dibujan solos con stroke-dasharray. */
function Dibujo({ tipo }) {
  const comun = {
    fill: 'none',
    stroke: '#0174C7',
    strokeWidth: 2.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'trazo',
  };

  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 sm:h-28 sm:w-28" aria-hidden="true">
      {tipo === 'diana' && (
        <>
          <circle cx="60" cy="60" r="42" {...comun} opacity="0.35" />
          <circle cx="60" cy="60" r="26" {...comun} opacity="0.6" />
          <circle cx="60" cy="60" r="10" {...comun} />
        </>
      )}

      {tipo === 'planos' && (
        <>
          <rect x="22" y="26" width="76" height="68" rx="8" {...comun} opacity="0.4" />
          <path d="M36 50h48M36 64h34M36 78h22" {...comun} />
        </>
      )}

      {tipo === 'barras' && (
        <>
          <path d="M24 96h72" {...comun} opacity="0.4" />
          <path d="M38 96V70M60 96V50M82 96V32" {...comun} />
        </>
      )}

      {tipo === 'pulso' && (
        <path d="M18 62h20l10-22 14 44 12-30 10 8h18" {...comun} />
      )}
    </svg>
  );
}

export default function Protocol() {
  const raiz = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tarjetas = gsap.utils.toArray('[data-paso]');

      tarjetas.forEach((tarjeta, i) => {
        // Cada tarjeta se queda fija mientras la siguiente la empuja. La última
        // no se pinnea: si no, el final de la sección se queda atascado.
        if (i < tarjetas.length - 1) {
          ScrollTrigger.create({
            trigger: tarjeta,
            start: 'top top+=90',
            endTrigger: tarjetas[tarjetas.length - 1],
            end: 'top center',
            pin: true,
            pinSpacing: false,
          });

          gsap.to(tarjeta, {
            scale: 0.94,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: tarjetas[i + 1],
              start: 'top bottom',
              end: 'top center',
              scrub: true,
            },
          });
        }

        gsap.from(tarjeta.querySelectorAll('.trazo'), {
          opacity: 0,
          y: 12,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: tarjeta, start: 'top 70%' },
        });
      });
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} className="container-site mt-28 sm:mt-36">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker">Cómo funciona</p>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
          No te damos un PDF y te dejamos solo
        </h2>
      </div>

      <div className="mt-14 space-y-6">
        {PASOS.map((paso, i) => (
          <article
            key={paso.titulo}
            data-paso
            className="surface flex flex-col items-center gap-6 bg-ink-card/90 p-7 text-center backdrop-blur-sm sm:flex-row sm:gap-10 sm:p-10 sm:text-left"
          >
            <Dibujo tipo={paso.dibujo} />

            <div className="flex-1">
              <p className="kicker">Paso {i + 1}</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-snug sm:text-3xl">{paso.titulo}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-white/55">{paso.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
