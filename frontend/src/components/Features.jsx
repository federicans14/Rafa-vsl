import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Los tres pilares del programa. **Son exactamente tres y son literalmente suyos**
 * (ver COPY-FUENTE.md): entrenamiento eficiente, nutrición flexible y seguimiento.
 * No inventar un cuarto para "equilibrar" la retícula.
 */
const PILARES = [
  {
    etiqueta: 'Entrenamiento',
    titulo: 'Eficiente, no eterno',
    copy: 'Estimular tu musculatura y progresar sin necesitar pasar dos horas en el gimnasio.',
    micro: 'sesiones',
  },
  {
    etiqueta: 'Nutrición',
    titulo: 'Flexible de verdad',
    copy: 'Perder grasa sin comer exactamente lo mismo todos los días, ni eliminar tu vida social.',
    micro: 'plato',
  },
  {
    etiqueta: 'Seguimiento',
    titulo: 'Alguien mirando tus datos',
    copy: 'Lo que funciona hoy puede necesitar ajustes dentro de cuatro semanas. Ahí entra el acompañamiento.',
    micro: 'progreso',
  },
];

/** Semanas de entrenamiento que se van encendiendo: la idea es "poco, pero constante". */
function MicroSesiones() {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActivo((n) => (n + 1) % 8), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className="w-full rounded-sm transition-all duration-500"
          style={{
            height: `${18 + ((i * 7) % 26)}px`,
            background: i <= activo ? 'linear-gradient(180deg,#0174C7,#014D82)' : 'rgba(255,255,255,0.07)',
          }}
        />
      ))}
    </div>
  );
}

/** El plato va rotando: comer distinto cada día sigue valiendo. */
function MicroPlato() {
  const opciones = ['Cena fuera', 'Comida rápida', 'Fin de semana', 'Viaje de trabajo'];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % opciones.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm" aria-hidden="true">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-blue/20 text-brand-blue">
        ✓
      </span>
      <span key={i} className="animate-fade-up text-white/70">
        {opciones[i]}
      </span>
    </div>
  );
}

/** Línea que sube: no es una cifra concreta, es la sensación de progreso revisado. */
function MicroProgreso() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + 1) % 5), 900);
    return () => clearInterval(id);
  }, []);

  const puntos = [30, 26, 24, 19, 14];

  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" aria-hidden="true">
      <polyline
        points={puntos.map((y, i) => `${i * 30},${y}`).join(' ')}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
      />
      <polyline
        points={puntos.slice(0, n + 1).map((y, i) => `${i * 30},${y}`).join(' ')}
        fill="none"
        stroke="#0174C7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={n * 30} cy={puntos[n]} r="3.5" fill="#0174C7" />
    </svg>
  );
}

const MICROS = { sesiones: MicroSesiones, plato: MicroPlato, progreso: MicroProgreso };

export default function Features() {
  const raiz = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-anim="card"]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: raiz.current, start: 'top 75%' },
      });
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} className="container-site mt-28 sm:mt-36">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker">Los tres pilares</p>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
          No vas a recibir una rutina y una dieta genérica
        </h2>
        <p className="mt-4 leading-relaxed text-white/55">
          Vamos a construir un sistema alrededor de ti.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PILARES.map((pilar) => {
          const Micro = MICROS[pilar.micro];

          return (
            <article
              key={pilar.etiqueta}
              data-anim="card"
              className="surface flex flex-col gap-5 p-6 sm:p-7"
            >
              <p className="kicker">{pilar.etiqueta}</p>

              <h3 className="text-xl font-extrabold leading-snug">{pilar.titulo}</h3>

              <p className="flex-1 text-[15px] leading-relaxed text-white/55">{pilar.copy}</p>

              <div className="rounded-xl border border-white/[0.07] bg-black/40 p-4">
                <Micro />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
