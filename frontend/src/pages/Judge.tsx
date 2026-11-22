import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import {
  loadJudgeDemo,
  fetchClock,
  advanceClock,
  resetClock,
  updateJudgeConfig,
  fetchCases,
} from '../lib/api';
import { useAppStore } from '../lib/store';
import { formatDate } from '../lib/format';
import {
  Play,
  RotateCcw,
  FastForward,
  Building,
  ShieldAlert,
  ArrowRight,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const Judge: React.FC = () => {
  const navigate = useNavigate();
  const { virtualDate, setVirtualDate, geminiKey, setActiveClaimId, judgeConfig, setJudgeConfig } =
    useAppStore();

  const [loadingDemo, setLoadingDemo] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [activeCase, setActiveCase] = useState<any>(null);

  const refreshClock = async () => {
    try {
      const c = await fetchClock();
      if (c?.virtual_now) setVirtualDate(c.virtual_now);
    } catch {}
  };

  const refreshActiveCase = async () => {
    try {
      const cases = await fetchCases();
      if (Array.isArray(cases) && cases.length > 0) {
        setActiveCase(cases[0]);
        setActiveClaimId(cases[0].case_id);
      }
    } catch {}
  };

  useEffect(() => {
    refreshClock();
    refreshActiveCase();
  }, []);

  const handleLoadSample = async () => {
    setLoadingDemo(true);
    try {
      const res = await loadJudgeDemo(geminiKey);
      setActiveClaimId(res.case_id);
      toast.success('Sample claim loaded (2026-09-08 start date).');
      await refreshClock();
      await refreshActiveCase();
      navigate(`/claim/${res.case_id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load sample claim');
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleAdvance = async (days: number) => {
    setAdvancing(true);
    try {
      const res = await advanceClock(days);
      if (res?.virtual_now) setVirtualDate(res.virtual_now);
      toast.success(`Advanced ${days} day(s) → ${res.virtual_now}`);
      await refreshActiveCase();
    } catch (err: any) {
      toast.error(err.message || 'Clock leap failed');
    } finally {
      setAdvancing(false);
    }
  };

  const handleResetClock = async () => {
    try {
      await resetClock();
      await refreshClock();
      toast.info('Clock reset to default start date.');
    } catch {
      toast.error('Clock reset failed');
    }
  };

  const handleBehaviorChange = async (behavior: string) => {
    setJudgeConfig({ insurer_behavior: behavior as any });
    await updateJudgeConfig({ insurer_behavior: behavior });
    toast.success(`Insurer behavior updated to: ${behavior}`);
  };

  const handleAutoApproveToggle = async () => {
    const next = !judgeConfig.auto_approve;
    setJudgeConfig({ auto_approve: next });
    await updateJudgeConfig({ auto_approve: next });
    toast.success(`Auto-approve set to ${next ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col text-carbon antialiased selection:bg-evergreen-700 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-clay-50 text-clay-600 border border-clay-100">
              PRESENTER / JUDGE TOOLS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeCase && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/claim/${activeCase.case_id}`)}
                className="text-xs gap-1.5"
              >
                Go to Active Claim ({activeCase.case_id})
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
            <Link to="/" className="text-xs text-carbon-3 hover:text-carbon">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Suite */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-carbon">
            Presenter Controls & Virtual Time Machine
          </h1>
          <p className="text-xs sm:text-sm text-carbon-2 mt-1">
            Simulate the multi-week dispute escalation cycle in 60 seconds on stage.
          </p>
        </div>

        {/* Action 1: Load Sample Claim */}
        <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-carbon text-sm">
                1. Load Synthetic Sample Claim
              </h3>
              <p className="text-xs text-carbon-2">
                Loads Priya Raghavan's knee replacement dispute, resets virtual clock to 2026-09-08, and runs analysis.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              loading={loadingDemo}
              onClick={handleLoadSample}
              className="gap-2 px-5 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Load Sample Claim
            </Button>
          </div>
        </div>

        {/* Action 2: Time Machine Buttons */}
        <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-carbon text-sm">
                2. Virtual Time Machine
              </h3>
              <p className="text-xs text-carbon-2">
                Fast-forward the virtual clock to trigger statutory timeouts and twin insurer replies.
              </p>
            </div>

            <div className="text-xs font-mono bg-surface-warm px-3 py-1 rounded-btn border border-border">
              Current Virtual Date: <strong>{formatDate(virtualDate)}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[1, 3, 7, 15, 30].map((d) => (
              <Button
                key={d}
                variant="outline"
                size="sm"
                loading={advancing}
                onClick={() => handleAdvance(d)}
                className="font-mono text-xs gap-1"
              >
                <FastForward className="w-3 h-3 text-clay-600" />+ {d} d
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetClock}
              className="font-mono text-xs gap-1 text-carbon-3"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Clock
            </Button>
          </div>
        </div>

        {/* Action 3: Simulation Parameters */}
        <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-5">
          <h3 className="font-bold text-carbon text-sm">
            3. Insurer Twin Behavior & Automation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Insurer Behavior */}
            <div className="space-y-1.5">
              <label className="block text-carbon-3 font-semibold">
                Simulated Insurer Behavior
              </label>
              <select
                aria-label="Simulated Insurer Behavior"
                value={judgeConfig.insurer_behavior}
                onChange={(e) => handleBehaviorChange(e.target.value)}
                className="w-full p-2 rounded-btn border border-border bg-surface-warm text-carbon font-medium"
              >
                <option value="partial_offer">Partial Offer / Full Recovery (₹60k)</option>
                <option value="silent">Stay Silent (Triggers Ombudsman Escalation)</option>
                <option value="reject_again">Reject Again</option>
                <option value="pay_full">Pay in Full Immediately</option>
              </select>
            </div>

            {/* Auto-Approve Switch */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <label className="block text-carbon-3 font-semibold">
                Auto-Approve Outbound Grievance
              </label>
              <button
                type="button"
                onClick={handleAutoApproveToggle}
                className={`py-2 px-3 rounded-btn border text-xs font-semibold flex items-center justify-between transition-colors ${
                  judgeConfig.auto_approve
                    ? 'border-success bg-success-bg text-success'
                    : 'border-border bg-surface-warm text-carbon-2'
                }`}
              >
                <span>Auto-Approve (1.5s delay)</span>
                <span>{judgeConfig.auto_approve ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action 4: Simulated Twin Links */}
        <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-4">
          <h3 className="font-bold text-carbon text-sm">
            4. Simulated External Portals
          </h3>
          <p className="text-xs text-carbon-2">
            Inspect the simulated backend desks receiving and processing ClaimKavach petitions.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/twin/insurer"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-btn border border-border bg-surface-warm text-xs font-semibold text-carbon hover:bg-border/30 transition-colors"
            >
              <Building className="w-4 h-4 text-evergreen-700" />
              Open Insurer Twin Portal
              <ExternalLink className="w-3.5 h-3.5 text-carbon-3" />
            </Link>

            <Link
              to="/twin/regulator"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-btn border border-border bg-surface-warm text-xs font-semibold text-carbon hover:bg-border/30 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-clay-600" />
              Open Regulator Twin Portal
              <ExternalLink className="w-3.5 h-3.5 text-carbon-3" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
