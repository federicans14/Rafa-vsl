import { MessageCircle, PlayCircle } from 'lucide-react';
import MagneticButton from './MagneticButton.jsx';
import { buildWhatsappUrl } from '../config.js';

/**
 * Cierre. Repite la pregunta con la que Rafa termina el vídeo, casi literal:
 * "¿vas a seguir igual o vas a construir el físico que quieres de una vez?".
 *
 * Dos botones: el de WhatsApp (la acción real) y uno que devuelve al vídeo, para
 * quien haya bajado sin verlo.
 */
export default function FinalCTA() {
  return (
    <section className="container-site mt-28 sm:mt-36">
      <div className="relative overflow-hidden rounded-xl3 border border-brand-blue/20 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-blue/[0.14] via-transparent to-transparent"
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="kicker">La decisión</p>

          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Dentro de seis meses vas a estar en algún punto.{' '}
            <em className="not-italic text-brand-blue">¿Cuál?</em>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/55">
            Escríbeme y te explico cómo funciona el programa. Resuelvo tus dudas y vemos si de
            verdad puedo ayudarte en tu situación.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton href={buildWhatsappUrl()}>
              <MessageCircle size={17} />
              Escríbeme por WhatsApp
            </MagneticButton>

            <MagneticButton href="#top" variant="outline">
              <PlayCircle size={17} />
              Ver el vídeo
            </MagneticButton>
          </div>

          <p className="mt-6 text-[13px] text-white/35">
            Sin compromiso y sin comprar nada. Solo una conversación.
          </p>
        </div>
      </div>
    </section>
  );
}
