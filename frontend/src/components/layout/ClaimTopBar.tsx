import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { HelpCircle, Moon, Sun, ChevronDown, User, Settings as SettingsIcon, Trash2, PlusCircle, Check } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { fetchCases } from '../../lib/api';
import { Case } from '../../lib/types';

interface ClaimTopBarProps {
  currentClaimId?: string;
}

export const ClaimTopBar: React.FC<ClaimTopBarProps> = ({ currentClaimId }) => {
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    toggleHelpDrawer,
    toggleSettingsDrawer,
  } = useAppStore();

  const [cases, setCases] = useState<Case[]>([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    fetchCases().then((c) => {
      if (Array.isArray(c)) setCases(c);
    }).catch(() => {});
  }, []);

  const currentCase = cases.find((c) => c.case_id === currentClaimId);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & optional Claim Switcher */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center focus:outline-none">
            <Logo size={34} />
          </Link>

          {/* Small claim switcher dropdown if multiple claims exist */}
          {cases.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-xs font-medium bg-surface-warm border border-border text-carbon hover:bg-border/40 transition-colors"
              >
                <span className="truncate max-w-[140px]">
                  {currentCase?.title || currentClaimId}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-carbon-3" />
              </button>

              {switcherOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-surface rounded-card border border-border shadow-md py-1 z-50 animate-fade-in"
                  onClick={() => setSwitcherOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-carbon-3 uppercase tracking-wider">
                    Your Claims
                  </div>
                  {cases.map((c) => (
                    <button
                      key={c.case_id}
                      onClick={() => navigate(`/claim/${c.case_id}`)}
                      className="w-full text-left px-3 py-2 text-xs text-carbon hover:bg-surface-warm flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium truncate">{c.title}</div>
                        <div className="text-[10px] text-carbon-3">{c.insurer}</div>
                      </div>
                      {c.case_id === currentClaimId && (
                        <Check className="w-3.5 h-3.5 text-evergreen-700 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <Link
                      to="/start"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-evergreen-700 font-medium hover:bg-surface-warm"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Review another claim
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Drawer Trigger */}
          <button
            type="button"
            onClick={toggleHelpDrawer}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn text-xs font-medium text-carbon-2 hover:text-carbon hover:bg-surface-warm transition-colors"
            title="Insurance terms & IRDAI rights"
          >
            <HelpCircle className="w-4 h-4 text-sage" />
            <span className="hidden md:inline">Help & Rights</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <select
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="appearance-none bg-surface-warm border border-border text-carbon text-xs font-medium rounded-btn py-1.5 pl-2.5 pr-6 hover:bg-border/30 focus:outline-none focus:ring-1 focus:ring-evergreen-700/40 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
            <ChevronDown className="w-3 h-3 text-carbon-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-btn text-carbon-2 hover:text-carbon hover:bg-surface-warm transition-colors"
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-clay-500" /> : <Sun className="w-4 h-4 text-warning" />}
          </button>

          {/* User Avatar Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-evergreen-700/20 transition-all focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-evergreen-700 text-white font-semibold text-xs flex items-center justify-center">
                PR
              </div>
            </button>

            {avatarOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-surface rounded-card border border-border shadow-md py-1.5 z-50 animate-fade-in"
                onClick={() => setAvatarOpen(false)}
              >
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-carbon">Priya Raghavan</p>
                  <p className="text-[11px] text-carbon-3 truncate">priya.raghavan@example.com</p>
                </div>

                <button
                  onClick={toggleSettingsDrawer}
                  className="w-full text-left px-3 py-2 text-xs text-carbon hover:bg-surface-warm flex items-center gap-2 transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-carbon-3" />
                  Settings & Gemini Key
                </button>

                <button
                  onClick={toggleSettingsDrawer}
                  className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger-bg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete all my data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
