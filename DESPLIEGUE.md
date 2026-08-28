# Despliegue — Landing VSL

Guion en orden. Lo que ya está hecho lleva ✅; lo que necesita navegador o tu
cuenta lleva 🔸.

---

## ✅ Ya hecho

- Backend adaptado y probado en local: validación, estados, panel, CORS
- Frontend construido y verificado, 15 comprobaciones en verde
- `render.yaml` escrito, **sin el fallo del `plan` en el sitio estático** que hizo
  fallar el blueprint de la otra landing
- `.gitignore` que deja fuera los `.env` y la base local
- Repo inicializado y primer commit hecho (`723efd8`, 58 archivos)
- Secretos de producción generados: `JWT_SECRET` y contraseña del panel
- Green API ya cableado: **misma instancia y mismo grupo** que la otra landing
- Meta Pixel `573368385466909` puesto en `frontend/.env.production`

---

## 🔸 Lo que falta, en orden

### 1. Base de datos en Turso

Tiene que ser **propia de esta landing**. Compartir la de
`plan.entrenaconrafa.com` haría que un `SELECT * FROM leads` devolviera los dos
funnels mezclados, y los esquemas ni siquiera coinciden.

**Dos caminos:**

- **Dame un token de API de Turso** (app.turso.tech → Settings → API Tokens →
  Create Token) y la creo yo entera: grupo en Irlanda, base, token de acceso y
  las variables escritas en el `.env`. Después lo revocas, como la otra vez.
- **O la creas tú** en el panel: base nueva, región europea, y me pasas la URL
  `libsql://…` y su token.

Con cualquiera de los dos, después se comprueba con:

```
cd backend && npm run comprobar-turso
```

### 2. Repo en GitHub

Créalo **privado** y vacío (sin README, sin `.gitignore`, sin licencia). Nombre
sugerido: `rafa-vsl`. Me pasas la URL, configuro el remoto, y lanzas tú el
`git push` — esa parte necesita tu login.

### 3. Blueprint en Render

**New → Blueprint** → el repo. Te pedirá las variables `sync: false`:

| Variable | De dónde |
|---|---|
| `TURSO_DATABASE_URL` | del paso 1 |
| `TURSO_AUTH_TOKEN` | del paso 1 |
| `GREEN_API_INSTANCE_ID` | `710722714295` |
| `GREEN_API_TOKEN` | está en `backend/.env` |
| `GREEN_API_CHAT_ID` | `120363428235074342@g.us` |
| `ADMIN_SEED_EMAIL` | `rafa@entrenaconrafa.com` |
| `ADMIN_SEED_PASSWORD` | está en `../CREDENCIALES-VSL.md` |
| `VITE_FB_PIXEL_ID` | `573368385466909` |
| `CORS_ORIGIN` | **vacía** — segunda vuelta |
| `VITE_API_URL` | **vacía** — segunda vuelta |
| `VITE_FB_DOMAIN_VERIFICATION` | vacía hasta tener el código de Meta |

> ⚠️ **Comprobar antes el cupo de dominios propios de Render.** Rafa ya tiene tres
> (`entrenaconrafa.com`, `www` y `plan.`). Si el plan Hobby no admite un cuarto,
> esta landing va a **Netlify**, igual que la de Álvaro. No es un problema: el
> `dist` es estático y Netlify da dominios ilimitados sin tarjeta.

### 4. Segunda vuelta

Cuando Render dé las direcciones:

| Servicio | Variable | Valor |
|---|---|---|
| `rafa-vsl-api` | `CORS_ORIGIN` | la URL del **web**, y luego también el dominio final, separados por coma |
| `rafa-vsl-web` | `VITE_API_URL` | la URL del **api** |

Y después **Manual Deploy del frontend**. Vite incrusta `VITE_API_URL` durante el
build: sin reconstruir, la web publicada conserva el valor vacío y **los leads no
se guardan sin dar ningún error**.

### 5. El subdominio

La raíz y `plan.` están ocupadas. Propuesta: **`clase.entrenaconrafa.com`**.

DNS en **Namecheap** (no Cloudflare): Advanced DNS → un solo `CNAME`, host
`clase`, valor `rafa-vsl-web.onrender.com`. Un subdominio no necesita registro
`A`, y **nunca crear `AAAA`**: Render solo va por IPv4.

Y añadir el dominio en Render → el servicio web → Custom Domains.

### 6. Verificar

- La landing carga y el vídeo está bloqueado
- El formulario guarda el lead y desbloquea el VSL
- El aviso llega al grupo de WhatsApp empezando por **🎬 NUEVO LEAD VSL**
- `/admin` entra y deja marcar "llamado" y "descartado"
- Borrar el lead de prueba antes de dar tráfico

---

## Recordatorios

- **La contraseña del panel es distinta** de la de `plan.entrenaconrafa.com`. Son
  dos bases y dos paneles: cada uno con su admin.
- **El aviso de WhatsApp cae en el mismo grupo** que la otra landing. Se
  distingue por el emoji y por el `utm_campaign` con el nombre del anuncio.
- **`CREDENCIALES-VSL.md` no entra en el repo.** Vive en `Rafa/`, un nivel por
  encima de lo que se sube.
