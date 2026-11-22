import React, { useState, useEffect } from 'react';
import { X, Search, ShieldCheck, ExternalLink, BookOpen } from 'lucide-react';
import { fetchRules, fetchGlossary } from '../../lib/api';
import { Rule, GlossaryItem } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useAppStore } from '../../lib/store';

interface HelpDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ open, onClose }) => {
  const [tab, setTab] = useState<'rules' | 'glossary'>('rules');
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const { language } = useAppStore();

  useEffect(() => {
    if (open) {
      Promise.all([fetchRules(), fetchGlossary()]).then(([r, g]) => {
        setRules(r || []);
        setGlossary(g || []);
      }).catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const filteredRules = rules.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.plain_en || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.source_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlossary = glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      ((g as any)[language] || g.en || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-carbon/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-surface border-l border-border shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-warm/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-btn bg-evergreen-50 flex items-center justify-center text-evergreen-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-carbon text-base">Knowledge & Rights</h3>
                <p className="text-xs text-carbon-2">Statutory rules and policyholder protections</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-carbon-3 hover:text-carbon hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Tabs */}
          <div className="p-4 border-b border-border space-y-3 bg-surface">
            <Input
              icon={<Search className="w-4 h-4 text-carbon-3" />}
              placeholder="Search rights, rules, citations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />
            <div className="flex rounded-btn bg-surface-warm p-1 border border-border">
              <button
                onClick={() => setTab('rules')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'rules'
                    ? 'bg-surface text-evergreen-700 shadow-xs'
                    : 'text-carbon-2 hover:text-carbon'
                }`}
              >
                IRDAI Rights ({filteredRules.length})
              </button>
              <button
                onClick={() => setTab('glossary')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === 'glossary'
                    ? 'bg-surface text-evergreen-700 shadow-xs'
                    : 'text-carbon-2 hover:text-carbon'
                }`}
              >
                Glossary Terms ({filteredGlossary.length})
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-paper/40">
            {tab === 'rules' ? (
              filteredRules.length === 0 ? (
                <div className="p-8 text-center text-sm text-carbon-3">
                  No regulations match "{search}".
                </div>
              ) : (
                filteredRules.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-card bg-surface border border-border shadow-xs hover:border-evergreen-700/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-carbon text-sm leading-snug">{r.title}</h4>
                      <Badge variant="default" size="sm" className="bg-sage-50 text-carbon-2 border-border flex-shrink-0">
                        {r.applies_to || 'Health'}
                      </Badge>
                    </div>

                    <p className="text-xs text-carbon-2 leading-relaxed">
                      {(r as any)[`plain_${language}`] || r.plain_en}
                    </p>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                      <span className="text-carbon-3 font-mono">{r.source_name}</span>
                      <a
                        href={r.source_url || 'https://irdai.gov.in'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-clay-50 text-clay-600 border border-clay-100 font-medium hover:bg-clay-100 transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Reference rule — confirm on irdai.gov.in
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </div>
                  </div>
                ))
              )
            ) : filteredGlossary.length === 0 ? (
              <div className="p-8 text-center text-sm text-carbon-3">
                No glossary terms match "{search}".
              </div>
            ) : (
              filteredGlossary.map((g) => (
                <div
                  key={g.term}
                  className="p-4 rounded-card bg-surface border border-border shadow-xs space-y-1.5"
                >
                  <h4 className="font-semibold text-carbon text-sm">{g.term}</h4>
                  <p className="text-xs text-carbon-2 leading-relaxed">
                    {(g as any)[language] || g.en}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
