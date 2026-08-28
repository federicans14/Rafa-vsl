/**
 * Ruido de película sobre toda la pantalla.
 *
 * Es lo que separa un fondo negro plano de uno que parece grabado. Va fijo, por
 * encima de todo y sin capturar clics (`pointer-events-none`), con `mix-blend-mode:
 * overlay` para que module lo que hay debajo en vez de taparlo.
 *
 * Se genera con un SVG en línea en vez de una imagen: no añade ni una petición.
 */
export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05]"
      style={{ mixBlendMode: 'overlay' }}
    >
      <svg className="h-full w-full">
        <filter id="grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>
    </div>
  );
}
