import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Marcas de index.html donde se inyectan el píxel y la verificación de dominio.
 *
 * Se hace aquí y no a mano en el HTML porque el ID no puede ir hardcodeado, y
 * porque sin ID no debe quedar NADA: un píxel con ID vacío carga fbevents.js
 * igual y planta cookies de Facebook en una página que no tiene aviso de cookies.
 */
const MARCA_VERIFICACION = '<!-- Verificación de dominio de Meta: la inyecta vite.config.js -->';
const MARCA_PIXEL = '<!-- Meta Pixel: lo inyecta vite.config.js. El <noscript> va en <body>. -->';

function snippetPixel(id) {
  return `<!-- Meta Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    </script>`;
}

function imgNoscript(id) {
  return `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${id}&amp;ev=PageView&amp;noscript=1" />`;
}

function metaPixel(env) {
  const pixelId = (env.VITE_FB_PIXEL_ID || '').trim();
  const verificacion = (env.VITE_FB_DOMAIN_VERIFICATION || '').trim();

  return {
    name: 'meta-pixel',
    transformIndexHtml(html) {
      let salida = html;

      if (verificacion) {
        salida = salida.replace(
          MARCA_VERIFICACION,
          `<meta name="facebook-domain-verification" content="${verificacion}" />`
        );
      }

      if (!pixelId) return salida;

      salida = salida.replace(MARCA_PIXEL, snippetPixel(pixelId));

      return {
        html: salida,
        tags: [{ tag: 'noscript', children: imgNoscript(pixelId), injectTo: 'body' }],
      };
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), metaPixel(env)],
    // 5174: el de plan.entrenaconrafa.com usa el 5173 y en local se levantan los dos.
    server: { port: 5174, host: true },
    preview: { port: 4174 },
  };
});
