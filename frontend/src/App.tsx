import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { NewClaimReview } from './pages/NewClaimReview';
import { MyClaim } from './pages/MyClaim';
import { Judge } from './pages/Judge';
import { TwinInsurer } from './pages/TwinInsurer';
import { TwinRegulator } from './pages/TwinRegulator';
import { NotFound } from './pages/NotFound';
import { useAppStore } from './lib/store';
import { fetchClock, fetchCurrentClaim } from './lib/api';

// Redirect helper for old /app bookmarks
const AppRedirect: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    fetchCurrentClaim().then((res) => {
      if (res.case_id) {
        navigate(`/claim/${res.case_id}`, { replace: true });
      } else {
        navigate('/start', { replace: true });
      }
    }).catch(() => navigate('/', { replace: true }));
  }, [navigate]);
  return null;
};

// Redirect helper for old /app/cases/:id bookmarks
const CaseRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/claim/${id}`} replace />;
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setVirtualDate, largeText } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    fetchClock()
      .then((c) => {
        if (c?.virtual_now) setVirtualDate(c.virtual_now);
      })
      .catch(() => {});
  }, [setVirtualDate]);

  // Global hidden presenter shortcut: Ctrl+Shift+J opens /judge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        navigate('/judge');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Routes>
      {/* 1. Landing Page (One scrolling page) */}
      <Route path="/" element={<Landing />} />

      {/* 2. New Claim Review (4-step guided wizard) */}
      <Route path="/start" element={<NewClaimReview />} />

      {/* 3. My Claim (The unified single-claim workspace) */}
      <Route path="/claim/:id" element={<MyClaim />} />

      {/* 4. Hidden Presenter / Judge Tools */}
      <Route path="/judge" element={<Judge />} />

      {/* 5. Simulated Twins (Reachable only from /judge) */}
      <Route path="/twin/insurer" element={<TwinInsurer />} />
      <Route path="/twin/regulator" element={<TwinRegulator />} />

      {/* Backwards Compatibility Redirects */}
      <Route path="/app" element={<AppRedirect />} />
      <Route path="/app/cases/:id" element={<CaseRedirect />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
