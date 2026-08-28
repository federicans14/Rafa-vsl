import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/** Lo que él rechaza, con sus palabras del vídeo. */
const SIEMPRE = [
  'Vivir en el gimnasio',
  'Hacer cardio durante horas',
  'Dietas de arroz y pollo',
  'Una rutina genérica y un PDF',
  'Cambiar de plan cada pocas semanas',
  'Esperar al lunes perfecto',
];

/** Lo que propone, también literal. */
const FUERTE = [
  'Un sistema construido alrededor de ti',
  'Entrenamiento adaptado al tiempo que tienes',
  'Nutrición que aguanta viajes y restaurantes',
  'Seguimiento constante de lo que funciona',
  'Ajustes cuando toca, no cuando toque',
  'Alguien a quien preguntar cuando se tuerce',
];

/**
 * Perfiles literales del VSL. **No inventar ninguno**: son las situaciones reales
 * que él nombra, y por eso suenan a él y no a marketing.
 */
const PERFILES = [
  'Ahora mismo no entrenas nada',
  'Llevas años entrenando y no consigues quitarte la barriga',
  'Tienes experiencia pero estás estancado',
  'Trabajas diez horas al día, tienes hijos y viajas',
  'Quieres volver a sentirte bien y no sabes por dónde',
];

export default function Philosophy() {
  const raiz = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax del fondo. `scrub` lo ata al scroll en vez de dispararlo.
      gsap.to('[data-anim="fondo"]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.from('[data-anim="col"]', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: raiz.current, start: 'top 70%' },
      });
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} className="relative mt-28 overflow-hidden rounded-xl3 bg-ink-soft py-20 sm:mt-36 sm:py-28">
      <div
        data-anim="fondo"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 bottom-0"
      >
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-blueDark/25 blur-[130px]" />
      </div>

      <div className="container-site relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker">Por qué no te ha funcionado antes</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            El problema no es que no quieras cambiar
          </h2>
          <p className="mt-4 leading-relaxed text-white/55">
            Es que estás usando estrategias que no están diseñadas para tu vida.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div data-anim="col" className="rounded-xl2 border border-white/[0.07] bg-black/30 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              El enfoque de siempre
            </p>

            <ul className="mt-6 space-y-3.5">
              {SIEMPRE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/35">
                  <X size={17} className="mt-0.5 shrink-0 text-white/25" />
                  <span className="line-through decoration-white/20">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-anim="col" className="rounded-xl2 border border-brand-blue/25 bg-brand-blue/[0.06] p-6 sm:p-8">
            <p className="kicker">Fuerte y Estético</p>

            <ul className="mt-6 space-y-3.5">
              {FUERTE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/80">
                  <Check size={17} className="mt-0.5 shrink-0 text-brand-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-anim="col" className="mx-auto mt-14 max-w-3xl rounded-xl2 border border-white/10 p-6 sm:p-8">
          <h3 className="text-center text-xl font-extrabold">¿Es esto para ti?</h3>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PERFILES.map((perfil) => (
              <li key={perfil} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-white/60">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                {perfil}
              </li>
            ))}
          </ul>

          {/* Del vídeo, literal. Filtrar a quien no encaja es lo que hace que
              lleguen leads cualificados en vez de curiosos. */}
          <p className="mt-7 border-t border-white/10 pt-6 text-center text-[15px] leading-relaxed text-white/45">
            Si buscas una dieta milagro, perder diez kilos en dos semanas o resultados sin cambiar
            nada, <span className="text-white/70">esto no es para ti</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
