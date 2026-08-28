import clsx from 'clsx';

/**
 * Botón con relleno que se desliza al pasar por encima.
 *
 * El truco es una capa absoluta que crece de `scale-x-0` a `scale-x-100` desde la
 * izquierda, con el contenido por encima en un `<span>` con `relative`. Sin ese
 * segundo span, el relleno taparía el texto.
 *
 * Renderiza `<a>` o `<button>` según reciba `href`: un CTA que navega debe ser un
 * enlace de verdad para que funcione el clic con rueda y el "abrir en pestaña".
 */
export default function MagneticButton({
  as,
  href,
  variant = 'solid',
  className,
  children,
  ...props
}) {
  const Etiqueta = as || (href ? 'a' : 'button');

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden ' +
    'rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] ' +
    'transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.99]';

  const variantes = {
    solid: 'bg-brand-gradient text-white shadow-pill',
    outline: 'border border-white/20 text-white',
    ghost: 'text-white/70 hover:text-white',
  };

  // El relleno del hover: en `solid` aclara, en el resto pinta el azul de marca.
  const relleno =
    variant === 'solid'
      ? 'bg-white/15'
      : 'bg-brand-gradient';

  return (
    <Etiqueta href={href} className={clsx(base, variantes[variant], className)} {...props}>
      <span
        aria-hidden="true"
        className={clsx(
          'absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out',
          'group-hover:scale-x-100',
          relleno
        )}
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </Etiqueta>
  );
}
