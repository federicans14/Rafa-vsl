# Rafa Coaching — Landing VSL

Landing cinematográfica con **VSL** (Video Sales Letter) y captación de leads.
El visitante ve el vídeo, deja sus datos para desbloquearlo, y termina en WhatsApp.

Es la **tercera propiedad** de la misma marca. Antes de tocar copy, entender el reparto:

| Propiedad | Qué hace | Termina en |
|---|---|---|
| `entrenaconrafa.com` | Su web de siempre | WhatsApp |
| `plan.entrenaconrafa.com` | Regala un plan gratis. Quiz de 5 pasos, sin fricción | WhatsApp |
| **esta** | **Vende la asesoría 1-a-1.** VSL de 8:55 + formulario | WhatsApp |

> ⚠️ **Las tres captan al mismo público con ofertas distintas.** Si alguien
> escribe copy aquí que regale un plan, se pisa con `plan.` y se rompen las dos.
> Aquí se vende; ahí se regala.

---

## Decisiones tomadas el 25/08/2026

Las tomé yo con la información disponible. **Corregir cualquiera antes de que se
escriba el copy definitivo**, no después.

### 1. Qué vende: la asesoría 1-a-1 de pago

El vídeo se titula "VSL RAFA COACHING v6" y dura 8:55. Un VSL de nueve minutos es
un activo de venta, no un teaser. Y el funnel del plan gratuito ya existe aparte.

⚠️ **Sin confirmar con Rafa.** Si el vídeo en realidad regala algo, todo el copy
cambia y esta landing se solapa con `plan.`.

### 2. Paleta: la suya real, no un preset

La plantilla ofrecía cuatro presets estéticos. **Ninguno se usa.** Rafa tiene marca
propia, documentada en `Rafa/Landing Rafa/Branding`, y ya aplicada en sus otras dos
propiedades. Tres webs de la misma marca con tres estéticas distintas no es
"cinematográfico", es descuidado.

- Fondo: negro puro `#000000`
- Marca: gradiente azul `#0174C7` → `#014D82` a 135°
- Texto sobre oscuro: blanco y `#E9EEF7`
- Tipografía: **Poppins** (400/600/700/800/900), la única de la marca

Lo que sí se hereda de la plantilla VSL es el **sistema de forma**: ruido SVG por
encima, radios de 2-3rem, botones magnéticos, GSAP con `gsap.context()`.

### 3. El vídeo

- YouTube: `DGXR5Dj_TWI` — canal propio de Rafa
- 8:55, 16:9, incrustable, con `maxresdefault`
- Se sirve por **`youtube-nocookie.com`**: no planta cookies hasta que se
  reproduce, y esta marca todavía no tiene aviso de cookies

### 3.b El CTA no es de compra

El propio Rafa dice en el vídeo: *"no tienes que comprar nada directamente,
simplemente escríbeme"*. El botón **no puede decir "Comprar" ni "Reservar
plaza"** — contradiría lo que el visitante acaba de oír durante nueve minutos.
Va a WhatsApp, al **mismo número que la otra landing**: `+34 622 63 33 45`.

### 4. El formulario pide email, y aquí sí

En `plan.entrenaconrafa.com` **se retiró el email** el 19/08 para bajar fricción.
Aquí se mantiene, y no es una incoherencia: allí la conversión es inmediata por
WhatsApp; aquí hay un vídeo de nueve minutos y un seguimiento comercial detrás,
donde el correo sí se usa.

Validación idéntica en cliente y servidor: nombre no vacío, email con regex,
teléfono con **≥8 dígitos reales** tras quitar todo lo que no sea número. El
selector de país (`react-international-phone`) precarga el prefijo, así que el
`required` nativo no sirve de nada.

---

## Lo que se hereda del proyecto hermano, y por qué

El backend se copió de `Landing Rafa/backend`, que lleva desde el 19/08 en
producción. **No reescribir desde cero lo que ya funciona:**

- `session.js` — la cookie ya sale `secure` + `sameSite:'none'` en producción.
  Es el bug número uno de este tipo de proyecto y aquí ya está resuelto
- `rateLimit.js` — 10 altas por IP y hora en el endpoint público
- `notifyWhatsapp.js` — Green API, sin bloquear la respuesta si falla
- `comprobar-turso.js` y `cambiar-password-admin.js` — scripts de operación
- El precalentamiento (`prewarmBackend`) del frontend: **Render Free duerme a los
  15 min y tarda 22 s en despertar**, medido. Aquí duele más que en el quiz,
  porque el usuario envía el formulario y se queda esperando a que arranque el
  vídeo. No quitarlo

### Lo que cambia respecto al hermano

- La tabla `leads` gana `status` (`to_call` | `called` | `discarded`) y pierde las
  columnas del quiz
- Nueva ruta `PATCH /api/leads/:id` para cambiar el estado
- El panel `/admin` pasa de tabla simple a **mini-CRM** con columnas
  "Por llamar" / "Llamados", buscador y botón directo a `wa.me`

---

## Datos del cliente

- **WhatsApp de contacto:** `+34 622 63 33 45` (el que ve el visitante)
- **Grupo de avisos: el MISMO que `plan.entrenaconrafa.com`** (decidido el
  25/08). No hace falta grupo nuevo ni cupo nuevo de Green API. Se distinguen por
  tres cosas: el aviso empieza por `🎬 NUEVO LEAD VSL` en vez de `🔵 NUEVO LEAD`,
  el campo `fuente` vale `vsl`, y el `utm_campaign` lleva el nombre del anuncio.
  Si algún día hay volumen y molesta mezclarlos, se separa cambiando una variable
- **Instagram:** `@entrenaconrafa_`
- **Meta Pixel:** `573368385466909` — el mismo de la otra landing
- **Dominio:** PENDIENTE. La raíz y `plan.` están ocupadas, así que va un
  subdominio nuevo. Propuesta: `clase.entrenaconrafa.com`
- **DNS:** Namecheap (`dns1`/`dns2.registrar-servers.com`), **no Cloudflare**

---

## Antes de desplegar, comprobar

- **Cupo de dominios propios en Render.** En el proyecto de Álvaro quedó anotado
  que el plan Hobby limita los dominios por workspace, y por eso el suyo acabó en
  Netlify. Rafa ya tiene tres dominios en Render: si no queda cupo, esta landing
  va a Netlify igual que la de Álvaro
- **Grupo de WhatsApp nuevo creado** y su `chatId` sacado con `getChats`
- **Base de Turso propia.** Nunca compartir la base entre clientes ni entre
  landings: un `SELECT * FROM leads` mezclaría los dos funnels
