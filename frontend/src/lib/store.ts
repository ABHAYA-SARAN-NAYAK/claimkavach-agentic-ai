import { create } from 'zustand';
import { Language } from './i18n';

interface AppState {
  language: Language;
  theme: 'light' | 'dark';
  largeText: boolean;
  geminiKey: string;
  geminiModel: string;
  geminiFallbackModel: string;
  virtualDate: string;
  activeClaimId: string | null;
  helpDrawerOpen: boolean;
  settingsDrawerOpen: boolean;
  judgeConfig: {
    insurer_behavior: 'silent' | 'partial_offer' | 'reject_again' | 'pay_full';
    auto_approve: boolean;
    pacing: number;
  };

  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLargeText: (enabled: boolean) => void;
  setGeminiKey: (key: string) => void;
  setGeminiModel: (model: string) => void;
  setGeminiFallbackModel: (model: string) => void;
  setVirtualDate: (date: string) => void;
  setActiveClaimId: (id: string | null) => void;
  setHelpDrawerOpen: (open: boolean) => void;
  toggleHelpDrawer: () => void;
  setSettingsDrawerOpen: (open: boolean) => void;
  toggleSettingsDrawer: () => void;
  setJudgeConfig: (cfg: Partial<AppState['judgeConfig']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: (localStorage.getItem('ck_lang') as Language) || 'en',
  theme: (localStorage.getItem('ck_theme') as 'light' | 'dark') || 'light',
  largeText: localStorage.getItem('ck_large_text') === 'true',
  geminiKey: localStorage.getItem('ck_gemini_key') || '',
  geminiModel: localStorage.getItem('ck_gemini_model') || 'gemini-2.5-flash',
  geminiFallbackModel: localStorage.getItem('ck_gemini_fallback_model') || 'gemini-2.5-flash-lite',
  virtualDate: new Date().toISOString().split('T')[0],
  activeClaimId: localStorage.getItem('ck_active_claim') || null,
  helpDrawerOpen: false,
  settingsDrawerOpen: false,
  judgeConfig: {
    insurer_behavior: 'partial_offer',
    auto_approve: false,
    pacing: 1.0,
  },

  setLanguage: (lang) => {
    localStorage.setItem('ck_lang', lang);
    set({ language: lang });
  },

  setTheme: (theme) => {
    localStorage.setItem('ck_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setLargeText: (enabled) => {
    localStorage.setItem('ck_large_text', String(enabled));
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    set({ largeText: enabled });
  },

  setGeminiKey: (key) => {
    localStorage.setItem('ck_gemini_key', key);
    set({ geminiKey: key });
  },

  setGeminiModel: (model) => {
    localStorage.setItem('ck_gemini_model', model);
    set({ geminiModel: model });
  },

  setGeminiFallbackModel: (model) => {
    localStorage.setItem('ck_gemini_fallback_model', model);
    set({ geminiFallbackModel: model });
  },

  setVirtualDate: (date) => set({ virtualDate: date }),

  setActiveClaimId: (id) => {
    if (id) {
      localStorage.setItem('ck_active_claim', id);
    } else {
      localStorage.removeItem('ck_active_claim');
    }
    set({ activeClaimId: id });
  },

  setHelpDrawerOpen: (open) => set({ helpDrawerOpen: open }),
  toggleHelpDrawer: () => set({ helpDrawerOpen: !get().helpDrawerOpen }),

  setSettingsDrawerOpen: (open) => set({ settingsDrawerOpen: open }),
  toggleSettingsDrawer: () => set({ settingsDrawerOpen: !get().settingsDrawerOpen }),

  setJudgeConfig: (cfg) =>
    set({ judgeConfig: { ...get().judgeConfig, ...cfg } }),
}));
