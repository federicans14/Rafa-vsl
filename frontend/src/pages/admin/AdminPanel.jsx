import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { apiFetch } from '../../lib/api.js';

const ESTADOS = {
  to_call: { label: 'Por llamar', color: 'text-amber-300' },
  called: { label: 'Llamados', color: 'text-emerald-300' },
  discarded: { label: 'Descartados', color: 'text-white/40' },
};

function horaCorta(valor) {
  // `created_at` viene de SQLite como 'YYYY-MM-DD HH:MM:SS' en UTC.
  const d = new Date(`${valor.replace(' ', 'T')}Z`);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(d);
}

function esDeHoy(valor) {
  const d = new Date(`${valor.replace(' ', 'T')}Z`);
  const hoy = new Date();
  return d.toDateString() === hoy.toDateString();
}

/** Tarjeta de lead con las acciones que Rafa necesita mientras llama. */
function TarjetaLead({ lead, onCambiar, ocupado }) {
  const soloDigitos = (lead.phone || '').replace(/\D/g, '');

  return (
    <article className="surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{lead.name}</p>
          <p className="mt-0.5 truncate text-[13px] text-white/50">{lead.email}</p>
          <p className="mt-0.5 text-[13px] text-white/50">{lead.phone}</p>
        </div>
        <span className="shrink-0 text-[11px] text-white/30">{horaCorta(lead.created_at)}</span>
      </div>

      {(lead.fuente || lead.utm_campaign) && (
        <p className="mt-2 truncate text-[11px] uppercase tracking-wider text-brand-blue/70">
          {[lead.fuente, lead.utm_campaign].filter(Boolean).join(' · ')}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={`https://wa.me/${soloDigitos}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1.5 text-[12px] font-semibold"
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>

        {lead.status !== 'called' && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => onCambiar(lead.id, 'called')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:text-white disabled:opacity-40"
          >
            <CheckCircle2 size={13} />
            Llamado
          </button>
        )}

        {lead.status !== 'to_call' && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => onCambiar(lead.id, 'to_call')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:text-white disabled:opacity-40"
          >
            <RotateCcw size={13} />
            Reabrir
          </button>
        )}

        {lead.status !== 'discarded' && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => onCambiar(lead.id, 'discarded')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/40 transition-colors hover:text-white/70 disabled:opacity-40"
          >
            <XCircle size={13} />
            Descartar
          </button>
        )}
      </div>
    </article>
  );
}

export default function AdminPanel({ user, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [ocupado, setOcupado] = useState(null);
  const [vista, setVista] = useState('llamadas');

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await apiFetch('/api/leads');
      setLeads(data?.leads ?? []);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarEstado(id, status) {
    setOcupado(id);
    // Optimista: el panel se usa mientras se llama, y esperar a la red en cada
    // clic haría que se sintiera lento.
    const previos = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

    try {
      await apiFetch(`/api/leads/${id}`, { method: 'PATCH', body: { status } });
    } catch (e) {
      setLeads(previos);
      setError(`No se pudo cambiar el estado: ${e.message}`);
    } finally {
      setOcupado(null);
    }
  }

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [leads, busqueda]);

  const contadores = useMemo(
    () => ({
      total: leads.length,
      to_call: leads.filter((l) => l.status === 'to_call').length,
      called: leads.filter((l) => l.status === 'called').length,
      discarded: leads.filter((l) => l.status === 'discarded').length,
      hoy: leads.filter((l) => esDeHoy(l.created_at)).length,
    }),
    [leads]
  );

  const navegacion = [
    { id: 'llamadas', label: 'Llamadas', icono: Phone },
    { id: 'resumen', label: 'Resumen', icono: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-5 sm:p-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <p className="text-sm font-extrabold">
            Entrena con <span className="text-brand-blue">Rafa</span>
          </p>
          <p className="mt-0.5 text-[12px] text-white/40">Leads del VSL</p>

          <nav className="mt-6 flex gap-2 lg:flex-col">
            {navegacion.map(({ id, label, icono: Icono }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVista(id)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
                  vista === id ? 'bg-white/[0.07] text-white' : 'text-white/50 hover:text-white'
                )}
              >
                <Icono size={15} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="truncate text-[12px] text-white/40">{user?.email}</p>
            <button
              type="button"
              onClick={onLogout}
              className="mt-2 inline-flex items-center gap-2 text-[13px] text-white/50 transition-colors hover:text-white"
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {error && (
            <p className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-[13px] text-red-300">
              {error}
            </p>
          )}

          {cargando ? (
            <p className="flex items-center gap-2 text-sm text-white/50">
              <Loader2 size={16} className="animate-spin" />
              Cargando leads…
            </p>
          ) : vista === 'resumen' ? (
            <section>
              <h1 className="text-xl font-extrabold">Resumen</h1>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Total', contadores.total],
                  ['Hoy', contadores.hoy],
                  ['Por llamar', contadores.to_call],
                  ['Llamados', contadores.called],
                ].map(([label, valor]) => (
                  <div key={label} className="surface p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</p>
                    <p className="mt-2 text-3xl font-black tabular-nums">{valor}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 text-sm font-bold text-white/70">Han entrado hoy</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {leads.filter((l) => esDeHoy(l.created_at)).map((lead) => (
                  <TarjetaLead
                    key={lead.id}
                    lead={lead}
                    ocupado={ocupado === lead.id}
                    onCambiar={cambiarEstado}
                  />
                ))}
                {contadores.hoy === 0 && (
                  <p className="text-sm text-white/40">Ninguno todavía.</p>
                )}
              </div>
            </section>
          ) : (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-extrabold">Llamadas</h1>

                <label className="relative flex-1 sm:max-w-xs">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre, email o teléfono"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm outline-none focus:border-brand-blue/70"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {['to_call', 'called'].map((estado) => {
                  const lista = filtrados.filter((l) => l.status === estado);

                  return (
                    <div key={estado}>
                      <h2 className={clsx('text-sm font-bold', ESTADOS[estado].color)}>
                        {ESTADOS[estado].label}
                        <span className="ml-2 text-white/30">{lista.length}</span>
                      </h2>

                      <div className="mt-3 space-y-3">
                        {lista.map((lead) => (
                          <TarjetaLead
                            key={lead.id}
                            lead={lead}
                            ocupado={ocupado === lead.id}
                            onCambiar={cambiarEstado}
                          />
                        ))}
                        {lista.length === 0 && (
                          <p className="text-sm text-white/30">Vacío.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
