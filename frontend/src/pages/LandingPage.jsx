import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Philosophy from '../components/Philosophy.jsx';
import Protocol from '../components/Protocol.jsx';
import SocialProof from '../components/SocialProof.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import FloatingWhatsapp from '../components/FloatingWhatsapp.jsx';
import { prewarmBackend } from '../lib/prewarmBackend.js';

export default function LandingPage() {
  useEffect(() => {
    // Despierta el backend nada más entrar: duerme a los 15 min y tarda ~22 s.
    // Aquí importa más que en el otro funnel, porque el visitante puede rellenar
    // el formulario en quince segundos y quedarse esperando al vídeo.
    prewarmBackend();
  }, []);

  return (
    <div id="top" className="min-h-screen">
      <Header />

      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <SocialProof />
        <FinalCTA />
      </main>

      <Footer />

      <FloatingWhatsapp />
    </div>
  );
}
