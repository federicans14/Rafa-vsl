import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { PhoneInput } from 'react-international-phone';
import { Loader2, Lock, MessageCircle, VolumeX } from 'lucide-react';
import MagneticButton from './MagneticButton.jsx';
import { VSL, buildWhatsappUrl } from '../config.js';
import { submitLead } from '../lib/submitLead.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const MIN_PHONE_DIGITS = 8;

/**
 * Misma validación que el backend, repetida a propósito: la del cliente se puede
 * saltar, la del servidor no.
 *
 * CRÍTICO con el teléfono: `PhoneInput` precarga el prefijo del país, así que el
 * campo nunca llega vacío y el `required` nativo del navegador siempre pasa. Hay
 * que contar los dígitos reales.
 */
export function validarContacto({ name, email, phone }) {
  const errores = {};

  if (!name.trim()) errores.name = 'Escribe tu nombre';

  if (!email.trim()) errores.email = 'Escribe tu email';
  else if (!EMAIL_REGEX.test(email.trim())) errores.email = 'Revisa el email, no parece válido';

  const digitos = phone.replace(/\D/g, '');
  if (!digitos) errores.phone = 'Escribe tu teléfono';
  else if (digitos.length < MIN_PHONE_DIGITS) errores.phone = 'El número no parece completo';

  return errores;
}

function entradaClase(error) {
  return clsx(
    'h-[3.25rem] w-full rounded-xl border bg-white/[0.04] px-3.5 text-base text-white',
    'placeholder:text-white/30 outline-none transition-colors',
    error ? 'border-red-400/70' : 'border-white/10 focus:border-brand-blue/70'
  );
}

function Campo({ label, htmlFor, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45"
      >
        {label}
      </label>

      {children}

      {error && (
        <p role="alert" className="mt-1.5 text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * El VSL con su puerta de entrada.
 *
 * Tres estados: `cerrado` (póster + "tu vídeo ya ha comenzado"), `formulario` y
 * `abierto` (el embed real). El botón de WhatsApp aparece con retardo una vez
 * abierto: si saliera de golpe competiría con el vídeo que acaba de arrancar.
 */
export default function VideoGate() {
  const [estado, setEstado] = useState('cerrado');
  const [datos, setDatos] = useState({ name: '', email: '', phone: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mostrarCta, setMostrarCta] = useState(false);

  const yaContado = useRef(false);

  useEffect(() => {
    if (estado !== 'abierto') return undefined;

    // 25 s: lo bastante tarde para no pisar el arranque del vídeo, lo bastante
    // pronto para que quien lo abandone a mitad ya haya visto el botón.
    const t = setTimeout(() => setMostrarCta(true), 25000);
    return () => clearTimeout(t);
  }, [estado]);

  function actualizar(campo, valor) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const siguiente = { ...prev };
      delete siguiente[campo];
      return siguiente;
    });
  }

  async function enviar(event) {
    event.preventDefault();
    if (enviando) return;

    const fallos = validarContacto(datos);
    setErrores(fallos);
    if (Object.keys(fallos).length > 0) return;

    setEnviando(true);
    const res = await submitLead(datos);
    setEnviando(false);

    // Se abre el vídeo pase lo que pase. Ya ha dado sus datos: dejarle fuera
    // porque el backend falle sería el peor final posible.
    if (!res.ok) {
      console.warn('[VideoGate] El lead no se guardó, pero se abre el vídeo igual.');
    }

    // Evento Lead del píxel. El ref evita contarlo dos veces.
    if (!yaContado.current && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      yaContado.current = true;
      window.fbq('track', 'Lead');
    }

    setEstado('abierto');
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-ink-card shadow-card">
        <div className="relative aspect-video">
          {estado === 'abierto' ? (
            <iframe
              className="h-full w-full"
              src={`${VSL.embedBase}${VSL.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="Fuerte y Estético, cómo funciona"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={VSL.posterUrl}
                alt=""
                className="h-full w-full object-cover opacity-40"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            </>
          )}

          {estado === 'cerrado' && (
            <button
              type="button"
              onClick={() => setEstado('formulario')}
              className="absolute inset-0 grid place-items-center px-6 text-center"
            >
              <span className="flex flex-col items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient shadow-pill">
                  <VolumeX size={26} className="text-white" />
                </span>
                <span className="text-lg font-extrabold sm:text-2xl">Tu clase ya ha comenzado</span>
                <span className="text-sm text-white/60">Toca para activar el sonido</span>
                {/* Recordarle que es gratis justo aqui, que es donde decide. */}
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                  Gratis
                </span>
              </span>
            </button>
          )}

          {estado === 'formulario' && (
            <div className="absolute inset-0 overflow-y-auto bg-black/85 p-5 backdrop-blur-sm sm:p-8">
              <form onSubmit={enviar} noValidate className="mx-auto max-w-md animate-fade-up">
                <p className="text-center text-lg font-extrabold sm:text-xl">
                  Dime dónde te escribo y sigue viendo
                </p>
                <p className="mt-1.5 text-center text-[13px] text-white/50">
                  La clase se reanuda en cuanto envíes. No te cobro nada.
                </p>

                <div className="mt-5 space-y-3.5">
                  <Campo label="Tu nombre" htmlFor="name" error={errores.name}>
                    <input
                      id="name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Cómo te llamas"
                      value={datos.name}
                      onChange={(event) => actualizar('name', event.target.value)}
                      aria-invalid={Boolean(errores.name)}
                      className={entradaClase(errores.name)}
                    />
                  </Campo>

                  <Campo label="Tu email" htmlFor="email" error={errores.email}>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="tucorreo@email.com"
                      value={datos.email}
                      onChange={(event) => actualizar('email', event.target.value)}
                      aria-invalid={Boolean(errores.email)}
                      className={entradaClase(errores.email)}
                    />
                  </Campo>

                  <Campo label="Tu WhatsApp" htmlFor="phone" error={errores.phone}>
                    <div className={clsx(errores.phone && 'phone-error')}>
                      <PhoneInput
                        inputProps={{ id: 'phone', autoComplete: 'tel' }}
                        defaultCountry="es"
                        value={datos.phone}
                        onChange={(phone) => actualizar('phone', phone)}
                      />
                    </div>
                  </Campo>
                </div>

                <MagneticButton type="submit" disabled={enviando} className="mt-6 w-full">
                  {enviando ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Enviando
                    </>
                  ) : (
                    'Seguir viendo el vídeo'
                  )}
                </MagneticButton>

                <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-white/35">
                  <Lock size={12} />
                  Tus datos son solo para contactarte. Sin spam.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {mostrarCta && (
        <div className="mt-6 animate-fade-up text-center">
          <MagneticButton href={buildWhatsappUrl()}>
            <MessageCircle size={17} />
            Escríbeme por WhatsApp
          </MagneticButton>

          {/* El propio Rafa dice en el vídeo "no tienes que comprar nada
              directamente". Prometer una venta aquí lo contradiría. */}
          <p className="mt-3 text-[13px] text-white/40">
            Sin compromiso. Te cuento cómo funciona y vemos si puedo ayudarte.
          </p>
        </div>
      )}
    </div>
  );
}
