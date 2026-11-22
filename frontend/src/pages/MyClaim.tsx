import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ClaimTopBar } from '../components/layout/ClaimTopBar';
import { FooterStrip } from '../components/layout/FooterStrip';
import { HelpDrawer } from '../components/layout/HelpDrawer';
import { SettingsDrawer } from '../components/layout/SettingsDrawer';
import { ClaimResultTab } from '../components/cases/ClaimResultTab';
import { ClaimEvidenceTab } from '../components/cases/ClaimEvidenceTab';
import { ClaimJourneyTab } from '../components/cases/ClaimJourneyTab';
import { ClaimLettersTab } from '../components/cases/ClaimLettersTab';
import { ClaimDocumentsTab } from '../components/cases/ClaimDocumentsTab';
import { ClaimActivityPanel } from '../components/cases/ClaimActivityPanel';
import { ReviewApproveSheet } from '../components/cases/ReviewApproveSheet';
import { ShieldSuccess } from '../components/brand/ShieldSuccess';
import { VerdictBadge } from '../components/cases/VerdictBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { fetchClaimSummary, fetchCase } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { useAppStore } from '../lib/store';
import { useSSE } from '../lib/sse';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Hospital,
  DollarSign,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MyClaim: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { helpDrawerOpen, setHelpDrawerOpen, settingsDrawerOpen, setSettingsDrawerOpen, virtualDate } =
    useAppStore();

  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [selectedDeductionId, setSelectedDeductionId] = useState('D1');

  const activeTab = searchParams.get('tab') || 'result';

  const loadClaim = async () => {
    if (!id) return;
    try {
      const summary = await fetchClaimSummary(id);
      setClaim(summary);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load claim');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaim();
  }, [id]);

  // Live updates over SSE
  useSSE(id || '', (evt) => {
    if (
      evt.type === 'approval_needed' ||
      evt.type === 'approved' ||
      evt.type === 'escalation' ||
      evt.type === 'clock' ||
      evt.type === 'case_done'
    ) {
      loadClaim();
    }
  });

  const setTab = (t: string) => {
    setSearchParams({ tab: t });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col">
        <ClaimTopBar currentClaimId={id} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-20 w-full rounded-card" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
          </div>
          <Skeleton className="h-44 rounded-card" />
          <Skeleton className="h-96 rounded-card" />
        </main>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-paper flex flex-col">
        <ClaimTopBar currentClaimId={id} />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 flex items-center justify-center">
          <ErrorState
            title="Claim Not Found"
            message={error || 'This claim record does not exist or has been purged.'}
            actionLabel="Start a New Review"
            onAction={() => navigate('/start')}
          />
        </main>
      </div>
    );
  }

  const isResolved = claim.status === 'resolved' || (claim.recovered_total && claim.recovered_total > 0);
  const nextAction = claim.next_action;

  return (
    <div className="min-h-screen bg-paper flex flex-col text-carbon antialiased transition-colors">
      <ClaimTopBar currentClaimId={id} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header Greeting & 4 Stat Cards matching reference Overview */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-carbon">
              Good evening, Priya <span className="inline-block transform origin-bottom-right hover:rotate-12 transition-transform">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-carbon-2 mt-0.5">
              Here's the latest on your health insurance claim.
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Amount in Dispute */}
            <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-clay-50 text-clay-600 flex items-center justify-center flex-shrink-0 font-bold text-base">
                ₹
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-carbon tabular-nums truncate">
                  {formatCurrency(claim.amount_in_dispute || 100000)}
                </div>
                <div className="text-[11px] sm:text-xs text-carbon-3 font-medium truncate">
                  Amount in Dispute
                </div>
              </div>
            </div>

            {/* 2. Likely Recoverable */}
            <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-success-bg text-success flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-carbon tabular-nums truncate">
                  {formatCurrency(claim.likely_recoverable || 60000)}
                </div>
                <div className="text-[11px] sm:text-xs text-carbon-3 font-medium truncate">
                  Likely Recoverable
                </div>
              </div>
            </div>

            {/* 3. Deductions Reviewed */}
            <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EFF4FA] text-[#3B6EA5] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-carbon tabular-nums truncate">
                  {claim.deductions_reviewed || 3}
                </div>
                <div className="text-[11px] sm:text-xs text-carbon-3 font-medium truncate">
                  Deductions Reviewed
                </div>
              </div>
            </div>

            {/* 4. Next Deadline */}
            <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-carbon tabular-nums truncate">
                  {isResolved ? 'Resolved' : claim.next_deadline || '6 Days'}
                </div>
                <div className="text-[11px] sm:text-xs text-carbon-3 font-medium truncate">
                  Next Deadline
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resolved Celebration Banner if resolved */}
        {isResolved && (
          <ShieldSuccess
            recoveredAmount={claim.recovered_total || 60000}
            caseTitle={claim.title}
            insurer={claim.insurer}
          />
        )}

        {/* Core Case Card matching the UI reference Overview */}
        <div className="rounded-card-lg border border-border bg-surface shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Active Case
                </span>
                <VerdictBadge verdict="strong_case" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-carbon tracking-tight">
                {claim.title || 'Knee Replacement Treatment'}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-carbon-2">
                <span className="inline-flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-carbon-3" />
                  {claim.insurer || 'Meridian Health Insurance'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-carbon-3" />
                  SRM Multi-Speciality Hospital
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-carbon">
                  Claim Amount: ₹3,50,000
                </span>
              </div>
            </div>

            {/* 5-Step Stepper */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-carbon-3 overflow-x-auto py-1">
              <div className="flex items-center gap-1.5 text-success font-semibold">
                <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]">✓</div>
                <span>Review</span>
              </div>
              <div className="w-4 sm:w-6 h-0.5 bg-success" />

              <div className="flex items-center gap-1.5 text-evergreen-700 font-semibold">
                <div className="w-5 h-5 rounded-full border-2 border-evergreen-700 bg-evergreen-50 text-evergreen-700 flex items-center justify-center text-[10px]">●</div>
                <span>Complaint</span>
              </div>
              <div className="w-4 sm:w-6 h-0.5 bg-border" />

              <div className="flex items-center gap-1.5 text-carbon-3">
                <div className="w-5 h-5 rounded-full border border-border text-carbon-3 flex items-center justify-center text-[10px]">○</div>
                <span className="hidden sm:inline">Insurer Reply</span>
              </div>
              <div className="w-4 sm:w-6 h-0.5 bg-border" />

              <div className="flex items-center gap-1.5 text-carbon-3">
                <div className="w-5 h-5 rounded-full border border-border text-carbon-3 flex items-center justify-center text-[10px]">○</div>
                <span className="hidden sm:inline">Escalation</span>
              </div>
              <div className="w-4 sm:w-6 h-0.5 bg-border" />

              <div className="flex items-center gap-1.5 text-carbon-3">
                <div className="w-5 h-5 rounded-full border border-border text-carbon-3 flex items-center justify-center text-[10px]">○</div>
                <span className="hidden sm:inline">Resolution</span>
              </div>
            </div>
          </div>

          {/* Clay-tinted Next Action panel */}
          {!isResolved && nextAction && (
            <div className="p-4 sm:p-5 rounded-card bg-[#FBF0E7] border border-[#F7E3D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-clay-600">
                  <Shield className="w-3.5 h-3.5" />
                  Next Action
                </div>
                <h3 className="font-bold text-carbon text-sm sm:text-base">
                  Review and approve the complaint
                </h3>
                <p className="text-xs text-carbon-2">
                  We've prepared a grievance letter with verified Clause 5.4 evidence.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setReviewSheetOpen(true)}
                className="whitespace-nowrap gap-1.5 self-start sm:self-center bg-evergreen-700 hover:bg-evergreen-800 text-white font-semibold text-xs px-5 shadow-xs"
              >
                Review & Approve
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid: Tabs on Left (8 cols), What ClaimKavach Did on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Nav Tabs + Tab Content */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tabs Navigation Bar */}
            <div className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'result', label: 'Result' },
                { id: 'evidence', label: 'Evidence & Highlights' },
                { id: 'journey', label: 'Journey' },
                { id: 'letters', label: 'Letters & Replies' },
                { id: 'documents', label: 'Documents' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`py-3 px-1 border-b-2 whitespace-nowrap transition-all ${
                    activeTab === t.id
                      ? 'border-evergreen-700 text-evergreen-700'
                      : 'border-transparent text-carbon-3 hover:text-carbon'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'result' && (
                <ClaimResultTab
                  verdict={claim.verdict}
                  onSelectDeduction={(dedId) => {
                    setSelectedDeductionId(dedId);
                    setTab('evidence');
                  }}
                  onPrepareComplaint={() => setReviewSheetOpen(true)}
                />
              )}

              {activeTab === 'evidence' && (
                <ClaimEvidenceTab
                  caseId={claim.case_id}
                  selectedDeductionId={selectedDeductionId}
                  onBackToResults={() => setTab('result')}
                />
              )}

              {activeTab === 'journey' && (
                <ClaimJourneyTab
                  ladder={claim.ladder}
                  nextAction={claim.next_action}
                  onReviewApprove={() => setReviewSheetOpen(true)}
                  virtualDate={virtualDate}
                  isResolved={isResolved}
                />
              )}

              {activeTab === 'letters' && (
                <ClaimLettersTab caseId={claim.case_id} messages={[]} />
              )}

              {activeTab === 'documents' && (
                <ClaimDocumentsTab caseId={claim.case_id} />
              )}
            </div>
          </div>

          {/* Right Column: What ClaimKavach Did Panel */}
          <div className="lg:col-span-4 space-y-4 sticky top-20">
            <ClaimActivityPanel caseId={claim.case_id} />

            <div className="p-4 rounded-card bg-surface-warm/40 border border-border text-xs text-carbon-2 space-y-1.5">
              <span className="font-semibold text-carbon block">Need clarification?</span>
              <p className="text-[11px] text-carbon-3 leading-relaxed">
                Open the Help Drawer in the top navigation to search statutory rights, or tap any dotted term for instant definitions.
              </p>
              <button
                type="button"
                onClick={() => setHelpDrawerOpen(true)}
                className="text-evergreen-700 font-semibold text-xs hover:underline block pt-1"
              >
                Browse IRDAI Rights & Glossary →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Review & Approve Full-Screen Sheet */}
      <ReviewApproveSheet
        open={reviewSheetOpen}
        onClose={() => setReviewSheetOpen(false)}
        approval={claim.next_action}
        onApproved={() => {
          setReviewSheetOpen(false);
          loadClaim();
        }}
      />

      {/* Slide-over Drawers */}
      <HelpDrawer open={helpDrawerOpen} onClose={() => setHelpDrawerOpen(false)} />
      <SettingsDrawer open={settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)} />

      <FooterStrip />
    </div>
  );
};
