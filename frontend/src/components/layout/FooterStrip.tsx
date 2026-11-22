import React from 'react';
import { useAppStore } from '../../lib/store';
import { t } from '../../lib/i18n';

export const FooterStrip: React.FC = () => {
  const { language } = useAppStore();

  return (
    <footer className="w-full py-3 px-4 bg-surface border-t border-border text-center text-xs text-carbon-3 select-none flex-shrink-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-evergreen-700" />
        <span>{t('honesty_strip', language)}</span>
      </div>
    </footer>
  );
};
