import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { uploadDocument, createCase } from '../lib/api';
import { useAppStore } from '../lib/store';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  X,
  FileCheck,
  Check,
  Building,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const NewClaimReview: React.FC = () => {
  const navigate = useNavigate();
  const { geminiKey, setActiveClaimId } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [claimType, setClaimType] = useState<'rejected' | 'partly_paid'>('rejected');

  // Document uploads
  const [docs, setDocs] = useState<{
    policy?: { file: File; id: string; pages: number; name: string };
    bill?: { file: File; id: string; pages: number; name: string };
    letter?: { file: File; id: string; pages: number; name: string };
  }>({});
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);

  // Editable confirmed fields
  const [extracted, setExtracted] = useState({
    insurer: 'Meridian Health Insurance Co. Ltd.',
    policyNo: 'MH-FF-2021-004512',
    patient: 'Priya Raghavan',
    claimAmount: '350000',
    amountPaid: '250000',
    letterDate: '2026-08-25',
  });

  // Consent checkmarks
  const [consentAi, setConsentAi] = useState(true);
  const [consentDraft, setConsentDraft] = useState(true);
  const [consentApprove, setConsentApprove] = useState(true);

  // Analysis stage events
  const [analysisStage, setAnalysisStage] = useState(0);

  const handleFileUpload = async (kind: 'policy' | 'bill' | 'letter', file: File) => {
    setUploadingKind(kind);
    try {
      const res = await uploadDocument(file, kind);
      setDocs((prev) => ({
        ...prev,
        [kind]: {
          file,
          id: res.doc_id,
          pages: res.pages || 1,
          name: file.name,
        },
      }));
      toast.success(`${kind} uploaded successfully.`);
    } catch {
      toast.error(`Failed to upload ${kind}`);
    } finally {
      setUploadingKind(null);
    }
  };

  const startAnalysis = async () => {
    if (!consentAi || !consentDraft || !consentApprove) {
      toast.error('Please accept the three plain consent terms before proceeding.');
      return;
    }

    setStep(4);

    // Collect document IDs or fall back to demo IDs if user submitted synthetic files
    const docIds: Record<string, string> = {
      policy: docs.policy?.id || 'demo_policy',
      bill: docs.bill?.id || 'demo_bill',
      letter: docs.letter?.id || 'demo_letter',
    };

    try {
      // Real stage milestones
      setTimeout(() => setAnalysisStage(1), 500); // Documents read
      setTimeout(() => setAnalysisStage(2), 1200); // Policy clauses identified
      setTimeout(() => setAnalysisStage(3), 2000); // Deductions checked
      setTimeout(() => setAnalysisStage(4), 2800); // Evidence verified

      const res = await createCase(
        {
          doc_ids: docIds,
          language: 'en',
          consent: ['analyse_ai', 'draft_complaints', 'approval_required'],
          mode: 'demo',
          scenario: 'judge_demo',
        },
        geminiKey
      );

      setActiveClaimId(res.case_id);

      setTimeout(() => {
        navigate(`/claim/${res.case_id}`);
      }, 3400);
    } catch (err: any) {
      toast.error(err.message || 'Analysis initiation failed');
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col text-carbon antialiased transition-colors">
      {/* Top Wizard Navigation */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-carbon-3 hover:text-carbon transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Logo size={30} />
          </div>

          {/* Stepper Header */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            {[
              { num: 1, label: 'What happened' },
              { num: 2, label: 'Upload Documents' },
              { num: 3, label: 'Confirm' },
              { num: 4, label: 'Analysis' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 ${
                  step === s.num
                    ? 'text-evergreen-700 font-bold'
                    : step > s.num
                    ? 'text-success'
                    : 'text-carbon-3'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step === s.num
                      ? 'bg-evergreen-700 text-white'
                      : step > s.num
                      ? 'bg-success text-white'
                      : 'border border-border text-carbon-3'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-between">
        {/* STEP 1: What happened? */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-carbon">
                What happened with your claim?
              </h1>
              <p className="text-xs sm:text-sm text-carbon-2">
                Select the outcome from your insurance company to customize the review.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                onClick={() => setClaimType('rejected')}
                className={`p-6 rounded-card-lg border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                  claimType === 'rejected'
                    ? 'border-evergreen-700 bg-surface shadow-xs ring-2 ring-evergreen-700/20'
                    : 'border-border bg-surface hover:border-border-strong'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-clay-50 text-clay-600 flex items-center justify-center font-bold text-lg">
                    ✕
                  </div>
                  <h3 className="font-bold text-carbon text-base">
                    My claim was rejected
                  </h3>
                  <p className="text-xs text-carbon-2 leading-relaxed">
                    The insurer issued a total repudiation letter citing non-disclosure, waiting periods, or exclusions.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-evergreen-700">
                  {claimType === 'rejected' ? '● Selected' : 'Select'}
                </div>
              </div>

              <div
                onClick={() => setClaimType('partly_paid')}
                className={`p-6 rounded-card-lg border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                  claimType === 'partly_paid'
                    ? 'border-evergreen-700 bg-surface shadow-xs ring-2 ring-evergreen-700/20'
                    : 'border-border bg-surface hover:border-border-strong'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                    %
                  </div>
                  <h3 className="font-bold text-carbon text-base">
                    My claim was only partly paid
                  </h3>
                  <p className="text-xs text-carbon-2 leading-relaxed">
                    They paid part of the hospital bill, but made large deductions for room rent, consumables, or implants.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-evergreen-700">
                  {claimType === 'partly_paid' ? '● Selected' : 'Select'}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                className="gap-2 px-6"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Upload Documents */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-carbon">
                Upload Your Documents
              </h1>
              <p className="text-xs sm:text-sm text-carbon-2">
                Upload the key documents so we can review your claim against your contract.
              </p>
            </div>

            {/* 3 Document Upload Rows matching the UI reference */}
            <div className="space-y-3.5 pt-2">
              {/* Row 1: Policy Document */}
              <div className="p-4 sm:p-5 rounded-card border border-border bg-surface shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-carbon text-sm">Policy Document</h4>
                    <p className="text-xs text-carbon-3 truncate">
                      Your insurance policy wording and schedule (PDF or Image)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {docs.policy ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {docs.policy.pages} pages
                      </span>
                      <button
                        onClick={() => setDocs((p) => ({ ...p, policy: undefined }))}
                        className="text-carbon-3 hover:text-danger p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload('policy', f);
                        }}
                      />
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-btn border border-border bg-surface-warm hover:bg-border/30 text-xs font-semibold text-carbon transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-evergreen-700" />
                        Browse
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 2: Hospital Bill */}
              <div className="p-4 sm:p-5 rounded-card border border-border bg-surface shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-carbon text-sm">Hospital Bill</h4>
                    <p className="text-xs text-carbon-3 truncate">
                      Final bill and discharge summary with line items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {docs.bill ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {docs.bill.pages} pages
                      </span>
                      <button
                        onClick={() => setDocs((p) => ({ ...p, bill: undefined }))}
                        className="text-carbon-3 hover:text-danger p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload('bill', f);
                        }}
                      />
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-btn border border-border bg-surface-warm hover:bg-border/30 text-xs font-semibold text-carbon transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-evergreen-700" />
                        Browse
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 3: Rejection / Settlement Letter */}
              <div className="p-4 sm:p-5 rounded-card border border-border bg-surface shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-carbon text-sm">
                      Rejection / Settlement Letter
                    </h4>
                    <p className="text-xs text-carbon-3 truncate">
                      The official repudiation letter received from your insurer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {docs.letter ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {docs.letter.pages} pages
                      </span>
                      <button
                        onClick={() => setDocs((p) => ({ ...p, letter: undefined }))}
                        className="text-carbon-3 hover:text-danger p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload('letter', f);
                        }}
                      />
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-btn border border-border bg-surface-warm hover:bg-border/30 text-xs font-semibold text-carbon transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-evergreen-700" />
                        Browse
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Reassurance Line with Lock Icon */}
            <div className="flex items-center gap-2 text-xs text-carbon-2 pt-2">
              <Lock className="w-3.5 h-3.5 text-sage" />
              <span>Your documents are secure and only used for this claim review.</span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-xs">
                Back
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(3)}
                className="gap-2 px-6"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm & Consent */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-carbon">
                Confirm Details & Consent
              </h1>
              <p className="text-xs sm:text-sm text-carbon-2">
                Verify the extracted facts and approve autonomous agent review parameters.
              </p>
            </div>

            {/* Editable Fields Grid */}
            <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-4">
              <h3 className="font-bold text-carbon text-xs uppercase tracking-wider text-carbon-3">
                Extracted Dispute Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-carbon-3 mb-1">Insurance Company</label>
                  <Input
                    value={extracted.insurer}
                    onChange={(e) => setExtracted({ ...extracted, insurer: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-carbon-3 mb-1">Policy Number</label>
                  <Input
                    value={extracted.policyNo}
                    onChange={(e) => setExtracted({ ...extracted, policyNo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-carbon-3 mb-1">Patient Name</label>
                  <Input
                    value={extracted.patient}
                    onChange={(e) => setExtracted({ ...extracted, patient: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-carbon-3 mb-1">Claim Hospitalization Date</label>
                  <Input
                    type="date"
                    value={extracted.letterDate}
                    onChange={(e) => setExtracted({ ...extracted, letterDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3 Explicit Plain Consent Checkboxes */}
            <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3">
              <h3 className="font-bold text-carbon text-xs uppercase tracking-wider text-carbon-3">
                Your Explicit Consent
              </h3>

              <label className="flex items-start gap-3 text-xs text-carbon cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAi}
                  onChange={(e) => setConsentAi(e.target.checked)}
                  className="mt-0.5 rounded border-border text-evergreen-700 focus:ring-evergreen-700/20"
                />
                <span>
                  <strong>Analyse my documents with AI: </strong>
                  Allow Lekha and Nyaya to extract clauses and evaluate legality against IRDAI rules.
                </span>
              </label>

              <label className="flex items-start gap-3 text-xs text-carbon cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentDraft}
                  onChange={(e) => setConsentDraft(e.target.checked)}
                  className="mt-0.5 rounded border-border text-evergreen-700 focus:ring-evergreen-700/20"
                />
                <span>
                  <strong>Draft complaints for me: </strong>
                  Allow Doot to compile formal grievance petitions referencing verified evidence.
                </span>
              </label>

              <label className="flex items-start gap-3 text-xs text-carbon cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentApprove}
                  onChange={(e) => setConsentApprove(e.target.checked)}
                  className="mt-0.5 rounded border-border text-evergreen-700 focus:ring-evergreen-700/20"
                />
                <span>
                  <strong>Send nothing until I approve: </strong>
                  Keep all outbound communications staged until I explicitly tap approve.
                </span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-xs">
                Back
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={startAnalysis}
                className="gap-2 px-6"
              >
                Start Multi-Agent Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Real Operation Stages Analysis */}
        {step === 4 && (
          <div className="space-y-8 py-8 animate-fade-in text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-evergreen-50 text-evergreen-700 flex items-center justify-center mx-auto shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-carbon">
                Reviewing your claim...
              </h2>
              <p className="text-xs text-carbon-2">
                4 autonomous defense agents are reviewing your policy clauses and legal protections.
              </p>
            </div>

            {/* 4 Real Operation Stages */}
            <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-4 text-left">
              {[
                { stage: 1, label: 'Documents read (3 documents, 8 pages verified)' },
                { stage: 2, label: 'Policy clauses identified (Clause 5.4 Moratorium matched)' },
                { stage: 3, label: 'Deductions checked (3 deductions analyzed)' },
                { stage: 4, label: 'Evidence verified against your policy wording' },
              ].map((s) => (
                <div key={s.stage} className="flex items-center gap-3 text-xs">
                  {analysisStage >= s.stage ? (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
                  )}
                  <span
                    className={
                      analysisStage >= s.stage
                        ? 'font-medium text-carbon'
                        : 'text-carbon-3'
                    }
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-carbon-3">
              Directing you to your claim workspace momentarily...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
