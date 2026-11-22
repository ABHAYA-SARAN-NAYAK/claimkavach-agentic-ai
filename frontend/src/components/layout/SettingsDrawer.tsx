import React, { useState } from 'react';
import { X, Key, Shield, Trash2, Download, Check, AlertTriangle, Moon, Sun, Type } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../lib/store';
import { testGeminiKey, deleteData } from '../../lib/api';
import { toast } from 'sonner';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onClose }) => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    largeText,
    setLargeText,
    geminiKey,
    setGeminiKey,
  } = useAppStore();

  const [keyInput, setKeyInput] = useState(geminiKey);
  const [testingKey, setTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [aiMode, setAiMode] = useState<'auto' | 'live' | 'scripted'>('auto');
  const [gmailDemo, setGmailDemo] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      toast.error('Please enter a Gemini API key first');
      return;
    }
    setTestingKey(true);
    setKeyStatus('idle');
    try {
      await testGeminiKey(keyInput.trim());
      setGeminiKey(keyInput.trim());
      setKeyStatus('valid');
      toast.success('Gemini key verified successfully!');
    } catch (err: any) {
      setKeyStatus('invalid');
      toast.error(err.message || 'Key verification failed');
    } finally {
      setTestingKey(false);
    }
  };

  const handleExportData = () => {
    fetch('/api/data/export', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `claimkavach_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Your claim data has been exported.');
      })
      .catch(() => toast.error('Export failed'));
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all your claim records, uploaded PDFs and grievance history permanently?')) {
      return;
    }
    setDeleting(true);
    try {
      await deleteData();
      localStorage.clear();
      toast.success('All local and server data permanently purged.');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch {
      toast.error('Failed to purge data');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-carbon/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-warm/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-btn bg-evergreen-50 flex items-center justify-center text-evergreen-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-carbon text-base">Claim Settings</h3>
                <p className="text-xs text-carbon-2">Preferences, AI connectivity, and data privacy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-carbon-3 hover:text-carbon hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Display & Language */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-carbon-3">Display & Language</h4>
              
              <div className="grid grid-cols-3 gap-2">
                {(['en', 'hi', 'ta'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`py-2 px-3 text-xs font-semibold rounded-btn border transition-all ${
                      language === l
                        ? 'border-evergreen-700 bg-evergreen-50 text-evergreen-700'
                        : 'border-border bg-surface text-carbon-2 hover:border-border-strong'
                    }`}
                  >
                    {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'தமிழ்'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 rounded-card border border-border bg-surface-warm/30">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-clay-500" /> : <Sun className="w-4 h-4 text-warning" />}
                  <span className="text-xs font-medium text-carbon">Theme</span>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme} className="text-xs">
                  {theme === 'dark' ? 'Dark (Warm)' : 'Light (Warm Paper)'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-card border border-border bg-surface-warm/30">
                <div className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-carbon-2" />
                  <span className="text-xs font-medium text-carbon">Large text mode</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLargeText(!largeText)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    largeText ? 'bg-evergreen-700' : 'bg-border'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      largeText ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* AI Provider Config */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-carbon-3">AI Intelligence</h4>

              <div>
                <label className="block text-xs font-medium text-carbon mb-1">
                  Google Gemini API Key (100% Free Tier)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="AIzaSy..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="flex-1 text-xs font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    loading={testingKey}
                    onClick={handleTestKey}
                    className="text-xs whitespace-nowrap"
                  >
                    Test & Save
                  </Button>
                </div>
                <p className="text-[11px] text-carbon-3 mt-1.5 leading-relaxed">
                  Keys are stored exclusively in your browser memory/storage and never sent to our database.
                  Get a free key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-evergreen-700 underline font-medium"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-medium text-carbon">Processing Engine</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Auto (Recommended)' },
                    { id: 'live', label: 'Live AI Only' },
                    { id: 'scripted', label: 'Offline / Scripted' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setAiMode(m.id as any)}
                      className={`p-2 text-[11px] font-medium rounded-btn border text-center transition-all ${
                        aiMode === m.id
                          ? 'border-evergreen-700 bg-evergreen-50 text-evergreen-700 font-semibold'
                          : 'border-border bg-surface text-carbon-2 hover:border-border-strong'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Gmail Dispatcher */}
              <div className="flex items-center justify-between p-3 rounded-card border border-border bg-surface-warm/30 mt-3">
                <div>
                  <div className="text-xs font-medium text-carbon">Simulate via Demo Inbox</div>
                  <div className="text-[11px] text-carbon-3">Receive real grievance email copies</div>
                </div>
                <button
                  type="button"
                  onClick={() => setGmailDemo(!gmailDemo)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    gmailDemo ? 'bg-evergreen-700' : 'bg-border'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      gmailDemo ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-carbon-3">Data Governance</h4>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="flex-1 text-xs gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export All My Data
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting}
                  onClick={handleDeleteAll}
                  className="flex-1 text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete All My Data
                </Button>
              </div>
              <p className="text-[11px] text-carbon-3 leading-relaxed">
                ClaimKavach enforces zero long-term retention of raw medical records upon case resolution or manual purge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
