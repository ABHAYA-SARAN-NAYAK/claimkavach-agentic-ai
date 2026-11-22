import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, Sun, Globe, ArrowRight } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { useAppStore } from '../../lib/store';
import { Language } from '../../lib/i18n';

export const PublicNav: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useAppStore();

  const navLinks = [
    { to: '/how-it-works', label: 'How it works' },
    { to: '/rights', label: 'Know your rights' },
    { to: '/privacy', label: 'Privacy & safety' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/60 bg-surface/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <Logo size={32} />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-500 font-semibold' : 'text-content-2 hover:text-content'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Select language"
            className="text-xs bg-surface-2 border border-border rounded-lg px-2 py-1.5 text-content font-medium focus:outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-content-3 hover:text-content hover:bg-surface-2 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Open App Button */}
          <Link to="/app">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open the app
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
