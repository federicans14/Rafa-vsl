/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * La paleta real de Rafa, no un preset de plantilla. Es la misma que usan
         * su web y plan.entrenaconrafa.com: tres propiedades de la misma marca
         * con tres estéticas distintas no se ve cinematográfico, se ve descuidado.
         */
        brand: {
          blue: '#0174C7',
          blueDark: '#014D82',
          // Azul claro para texto secundario sobre fondo oscuro, de su branding.
          mist: '#E9EEF7',
        },
        ink: {
          DEFAULT: '#000000',
          // Un negro con una pizca de azul para las superficies elevadas: el
          // negro puro sobre negro puro no separa nada.
          soft: '#070B10',
          card: '#0B1219',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // El sistema de forma de la plantilla VSL: nada de esquinas afiladas en
        // los bloques grandes.
        xl2: '2rem',
        xl3: '3rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0174C7 0%, #014D82 100%)',
      },
      boxShadow: {
        pill: '0 10px 30px -12px rgba(1, 116, 199, 0.55)',
        card: '0 24px 60px -32px rgba(0, 0, 0, 0.9)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
