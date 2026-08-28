import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import MagneticButton from '../../components/MagneticButton.jsx';

/** Login del panel. Sin registro público: el admin se siembra desde el backend. */
export default function AdminLoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(event) {
    event.preventDefault();
    if (enviando) return;

    setEnviando(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch (e) {
      // Mensaje genérico a propósito: distinguir "no existe" de "contraseña mal"
      // le diría a cualquiera qué correos están dados de alta.
      setError(e.status === 401 ? 'Email o contraseña incorrectos' : e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5">
      <form onSubmit={enviar} className="surface w-full max-w-sm p-7">
        <p className="text-lg font-extrabold">
          Entrena con <span className="text-brand-blue">Rafa</span>
        </p>
        <p className="mt-1 text-[13px] text-white/45">Panel de leads del VSL</p>

        <div className="mt-6 space-y-3.5">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-white/45">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-base outline-none focus:border-brand-blue/70"
            />
          </div>

          <div>
            <label htmlFor="admin-pass" className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-white/45">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-base outline-none focus:border-brand-blue/70"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[13px] text-red-400">
            {error}
          </p>
        )}

        <MagneticButton type="submit" disabled={enviando} className="mt-6 w-full">
          {enviando ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Entrando
            </>
          ) : (
            'Entrar'
          )}
        </MagneticButton>
      </form>
    </div>
  );
}
