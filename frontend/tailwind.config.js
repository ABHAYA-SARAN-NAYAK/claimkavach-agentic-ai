/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'hero-cream': 'var(--hero-cream)',
        surface: {
          DEFAULT: 'var(--surface)',
          warm: 'var(--surface-warm)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        carbon: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
          inverse: 'var(--text-inverse)',
        },
        evergreen: {
          50: 'var(--evergreen-50)',
          100: 'var(--evergreen-100)',
          500: 'var(--evergreen-500)',
          600: 'var(--evergreen-600)',
          700: 'var(--evergreen-700)',
          800: 'var(--evergreen-800)',
          900: 'var(--evergreen-900)',
          DEFAULT: 'var(--evergreen-700)',
        },
        clay: {
          50: 'var(--clay-50)',
          100: 'var(--clay-100)',
          400: 'var(--clay-400)',
          500: 'var(--clay-500)',
          600: 'var(--clay-600)',
          700: 'var(--clay-700)',
          DEFAULT: 'var(--clay-600)',
        },
        sage: {
          50: 'var(--sage-50)',
          100: 'var(--sage-100)',
          DEFAULT: 'var(--sage)',
        },
        // Backward-compatible semantic aliases
        brand: {
          50: 'var(--evergreen-50)',
          100: 'var(--evergreen-100)',
          500: 'var(--evergreen-600)',
          600: 'var(--evergreen-700)',
          700: 'var(--evergreen-800)',
          900: 'var(--evergreen-900)',
          DEFAULT: 'var(--evergreen-700)',
        },
        canvas: 'var(--paper)',
        content: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
          inverse: 'var(--text-inverse)',
        },
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
          text: 'var(--success-text)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
          text: 'var(--warning-text)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          bg: 'var(--danger-bg)',
          text: 'var(--danger-text)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
          text: 'var(--info-text)',
        },
      },
      borderRadius: {
        btn: '10px',
        card: '14px',
        'card-lg': '16px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
