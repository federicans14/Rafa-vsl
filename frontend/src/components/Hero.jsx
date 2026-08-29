import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import VideoGate from './VideoGate.jsx';
import { BRAND } from '../config.js';

/**
 * Todo el copy sale del propio VSL (ver COPY-FUENTE.md). El titular repite la
 * promesa que Rafa hace en el minuto uno: perder grasa y verse fuerte sin vivir
 * para entrenar. Si la página prometiera otra cosa, el visitante notaría el salto
 * en cuanto empezara el vídeo.
 */
export default function Hero() {
  const raiz = useRef(null);

  useEffect(() => {
    // gsap.context() para que el cleanup revierta todo lo de este componente y no
    // queden animaciones huérfanas al desmontar.
    const ctx = gsap.context(() => {
      gsap.from('[data-anim="hero"]', {
        y: 22,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
      });
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} className="relative pt-28 sm:pt-32">
      {/* Dos resplandores azules muy tenues. Sin esto el negro queda plano. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-[120px]" />
      </div>

      <div className="container-site relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* "Gratis" en una píldora y no en una línea de texto: es la objeción
              numero uno que hay que desactivar antes de pedir nada. Va en verde
              y no en el azul de marca porque tiene que destacar SOBRE la marca,
              no fundirse con ella. */}
          <p
            data-anim="hero"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[13px] font-black uppercase tracking-[0.14em] text-emerald-300">
              Clase gratuita
            </span>
            <span className="text-[13px] font-semibold text-white/40">· 8 min</span>
          </p>

          <h1
            data-anim="hero"
            className="mt-4 text-[2rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Pierde grasa y vuelve a verte fuerte{' '}
            <em className="not-italic text-brand-blue">sin vivir para entrenar</em>
          </h1>

          <p
            data-anim="hero"
            className="mx-auto mt-5 max-w-xl font-semibold italic leading-relaxed text-brand-mist/70"
          >
            No hace falta hacer más. Hace falta hacer lo que funciona, adaptado a tu vida.
          </p>

          <p data-anim="hero" className="mt-6 text-sm text-white/45">
            {BRAND.coach} · entrenador online desde hace {BRAND.yearsCoaching} años ·{' '}
            {BRAND.peopleHelped} personas ayudadas
          </p>

          <p data-anim="hero" className="mt-3 text-[13px] text-white/35">
            Sin pagar nada y sin compromiso. Solo dime dónde te la mando.
          </p>
        </div>

        <div data-anim="hero" className="mt-10 sm:mt-12">
          <VideoGate />
        </div>
      </div>
    </section>
  );
}
