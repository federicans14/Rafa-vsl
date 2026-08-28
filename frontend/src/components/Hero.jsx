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
          <p data-anim="hero" className="kicker">
            Mira gratis cómo funciona el sistema
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
        </div>

        <div data-anim="hero" className="mt-10 sm:mt-12">
          <VideoGate />
        </div>
      </div>
    </section>
  );
}
