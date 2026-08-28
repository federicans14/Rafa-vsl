import { Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import NoiseOverlay from './components/NoiseOverlay.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';
import { useAuth } from './hooks/useAuth.js';

function Admin() {
  const { user, cargando, login, logout } = useAuth();

  if (cargando) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <Loader2 size={22} className="animate-spin text-white/40" />
      </div>
    );
  }

  if (!user) return <AdminLoginPage onLogin={login} />;

  return <AdminPanel user={user} onLogout={logout} />;
}

export default function App() {
  return (
    <>
      <NoiseOverlay />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* `/admin/*` para que las rutas internas del panel no den 404. */}
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}
