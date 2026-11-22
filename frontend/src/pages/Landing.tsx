import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../lib/store';
import { fetchCurrentClaim, deleteData } from '../lib/api';
import {
  ShieldCheck,
  Scale,
  FileText,
  Clock,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Lock,
  ExternalLink,
  HelpCircle,
  Moon,
  Sun,
  Shield,
  Send,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage, activeClaimId, setActiveClaimId } = useAppStore();
  const [existingClaimId, setExistingClaimId] = useState<string | null>(activeClaimId);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchCurrentClaim().then((res) => {
      if (res.case_id) {
        setExistingClaimId(res.case_id);
        setActiveClaimId(res.case_id);
      }
    });
  }, [setActiveClaimId]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartReview = () => {
    if (existingClaimId) {
      navigate(`/claim/${existingClaimId}`);
    } else {
      navigate('/start');
    }
  };

  const handleDeleteData = async () => {
    if (window.confirm('Delete all stored claim records and uploaded synthetic files?')) {
      await deleteData();
      setExistingClaimId(null);
      setActiveClaimId(null);
      toast.success('All local and server data purged.');
    }
  };

  const faqs = [
    {
      q: 'Is ClaimKavach legal advice or a law firm?',
      a: 'No. ClaimKavach is an autonomous digital advocate and bureaucracy execution agent. It analyzes contractual facts from your policy and compiles standard statutory complaint templates based on public IRDAI regulations. It does not replace a licensed advocate or legal counsel.',
    },
    {
      q: 'Will the insurance company really reply?',
      a: 'Under IRDAI Protection of Policyholders’ Interests Regulations, insurers are legally mandated to acknowledge complaints within 3 days and resolve grievances within 15 days. If they fail, ClaimKavach prepares the formal escalation to the Insurance Ombudsman and IRDAI Bima Bharosa.',
    },
    {
      q: 'What does ClaimKavach cost?',
      a: 'ClaimKavach is 100% free and open-source. It operates entirely on free tiers with zero credit card required, zero hidden subscriptions, and zero claim commissions.',
    },
    {
      q: 'Is my personal health data and document privacy safe?',
      a: 'Yes. ClaimKavach only stores documents in memory or in isolated temporary workspaces during review. We never share, sell, or retain medical records after your dispute is resolved, and you can permanently delete all data at any time with one click.',
    },
    {
      q: 'What if the insurer’s deduction is actually contractually valid?',
      a: 'We tell you honestly! ClaimKavach never hallucinates fake arguments or disputes legitimate deductions like room-rent caps or non-medical schedules. If an item is valid under your policy, we explain why and focus your fight solely on unlawful deductions.',
    },
    {
      q: 'Which insurance companies are covered?',
      a: 'All general and standalone health insurance companies registered under the Insurance Regulatory and Development Authority of India (IRDAI) are covered by these statutory rules.',
    },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col text-carbon antialiased selection:bg-evergreen-700 selection:text-white">
      {/* 1. Sticky Top Navigation Bar matching UI Reference */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center focus:outline-none">
            <Logo size={36} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-carbon-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-carbon transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-carbon transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-carbon transition-colors"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('faqs')}
              className="hover:text-carbon transition-colors"
            >
              FAQs
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <select
                aria-label="Select language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="appearance-none bg-surface-warm border border-border text-carbon text-xs font-medium rounded-btn py-1.5 pl-2.5 pr-6 hover:bg-border/30 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
              </select>
              <ChevronDown className="w-3 h-3 text-carbon-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-btn text-carbon-2 hover:text-carbon hover:bg-surface-warm transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-clay-500" /> : <Sun className="w-4 h-4 text-warning" />}
            </button>

            {/* Primary Action Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartReview}
              className="text-xs font-semibold px-4 shadow-xs"
            >
              {existingClaimId ? 'Open my claim' : 'Start My Claim Review'}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section matching the UI Reference Top-Left Hero Screen */}
      <section
        id="hero"
        className="relative bg-[#FBF1E6] dark:bg-[#17201B] border-b border-border overflow-hidden pt-12 pb-16 sm:py-20 lg:py-24"
      >
        {/* Soft Organic Leaf SVG shapes in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-40 overflow-hidden">
          <svg viewBox="0 0 500 500" className="w-full h-full text-evergreen-100 fill-current">
            <path d="M400,0 C450,150 480,300 350,450 C250,300 200,150 400,0 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* AI-Powered Claim Support Chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-carbon shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-evergreen-700" />
                AI-Powered Claim Support
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-carbon leading-[1.12]">
                Insurance said No?
                <br />
                <span className="text-clay-600">Let's check if it was right.</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-carbon-2 max-w-xl leading-relaxed">
                Upload your policy, hospital bill and rejection letter. ClaimKavach checks the reason, shows the true picture, and helps you fight for what you're entitled to.
              </p>

              {/* Hero CTA Buttons matching reference */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartReview}
                  className="gap-2 text-sm px-6 font-semibold shadow-sm"
                >
                  {existingClaimId ? 'Open my claim' : 'Start My Claim Review'}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm px-5 font-semibold"
                >
                  See how it works
                </Button>
              </div>
            </div>

            {/* Right Hero Graphic: Real React Component Mockup matching UI Reference */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Tilted Floating Mockup Card */}
              <div className="relative w-full max-w-sm transform sm:-rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4">
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <Logo size={26} />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/30">
                      Strong Case
                    </span>
                  </div>

                  {/* Mock Headline */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-carbon-3 uppercase tracking-wider">
                      Your Claim Review
                    </span>
                    <div className="text-3xl font-extrabold text-carbon tabular-nums">
                      ₹60,000
                    </div>
                    <p className="text-xs text-clay-600 font-medium">
                      worth challenging
                    </p>
                  </div>

                  {/* Checklist with Green Checks */}
                  <div className="space-y-2.5 pt-2 border-t border-border text-xs text-carbon">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <span>Policy analyzed (Clause 5.4 Moratorium)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <span>Deductions checked (1 worth disputing)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <span>Complaint ready for your approval</span>
                    </div>
                  </div>

                  {/* Small Action Preview Button */}
                  <div className="pt-2">
                    <div className="w-full py-2 px-3 rounded-btn bg-evergreen-700 text-white text-xs font-semibold text-center shadow-xs">
                      Review & Approve Grievance →
                    </div>
                  </div>
                </div>

                {/* Decorative Small Clay Shield Floating Badge */}
                <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-clay-500 text-white p-3 shadow-lg flex items-center justify-center transform rotate-12">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Feature Row matching UI Reference */}
      <section className="py-12 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-carbon text-sm">Policy Analysis</h4>
                <p className="text-xs text-carbon-2 leading-relaxed">
                  Read & understand your coverage wording without insurance jargon.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-carbon text-sm">Fairness Check</h4>
                <p className="text-xs text-carbon-2 leading-relaxed">
                  Know if the rejection is legally valid or violates IRDAI rules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-carbon text-sm">Complaint & Follow-up</h4>
                <p className="text-xs text-carbon-2 leading-relaxed">
                  We draft statutory legal notices, send with your tap, and track deadlines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-carbon text-sm">Deadline Protection</h4>
                <p className="text-xs text-carbon-2 leading-relaxed">
                  Never miss an insurer's 15-day SLA or Insurance Ombudsman filing window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works: 5 Steps */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-paper border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
              The 5-Step Resolution Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
              How ClaimKavach fights for your family
            </h2>
            <p className="text-xs sm:text-sm text-carbon-2">
              From rejection letter to full settlement without hiring expensive intermediaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: '1',
                title: 'Upload documents',
                desc: 'Upload your policy, hospital bill, and rejection letter. Even just the letter is enough to start.',
              },
              {
                num: '2',
                title: "Check insurer's reasons",
                desc: 'We cross-reference every cited clause against your coverage history and IRDAI regulations.',
              },
              {
                num: '3',
                title: 'Review the evidence',
                desc: 'See exact clause highlights on your original documents and understand your legal position.',
              },
              {
                num: '4',
                title: 'Approve the complaint',
                desc: 'Nothing is sent without your tap. Review the drafted legal notice with an 8-second undo window.',
              },
              {
                num: '5',
                title: 'Deadline & Escalation',
                desc: 'We monitor the 15-day insurer SLA and escalate to the Ombudsman if unresolved.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-card bg-surface border border-border shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-evergreen-700 text-white font-bold text-xs flex items-center justify-center">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-carbon text-sm leading-snug">{step.title}</h4>
                  <p className="text-xs text-carbon-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact & Reality of Health Disputes */}
      <section id="impact" className="py-16 sm:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
              The Reality of Health Claims in India
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
              Why families need an autonomous advocate
            </h2>
            <p className="text-xs sm:text-sm text-carbon-2">
              Indian families pay premiums for years, only to face automated repudiations when hospitalization strikes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-card border border-border bg-surface-warm/50 space-y-2">
              <div className="text-3xl font-bold text-clay-600 tabular-nums">41% ↑</div>
              <h4 className="font-bold text-carbon text-sm">Complaints Rose in FY25</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Health insurance complaints jumped to 1,37,361 grievances as automated rejections surged.{' '}
                <a
                  href="https://irdai.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-evergreen-700 underline"
                >
                  IRDAI Annual Report
                </a>
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-surface-warm/50 space-y-2">
              <div className="text-3xl font-bold text-evergreen-700 tabular-nums">7 in 10</div>
              <h4 className="font-bold text-carbon text-sm">Disputes are Claims</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Over 70% of all consumer insurance complaints pertain directly to claim repudiation or deductions.{' '}
                <a
                  href="https://bimabharosa.irdai.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-evergreen-700 underline"
                >
                  Bima Bharosa Portal
                </a>
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-surface-warm/50 space-y-2">
              <div className="text-3xl font-bold text-clay-600 tabular-nums">50%+</div>
              <h4 className="font-bold text-carbon text-sm">Faced Rejection / Cut</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Over half of surveyed Indian policyholders experienced partial payment or rejection on their last claim.{' '}
                <span className="text-carbon-3">LocalCircles Survey</span>
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-surface-warm/50 space-y-2">
              <div className="text-3xl font-bold text-evergreen-700 tabular-nums">₹2 Crore</div>
              <h4 className="font-bold text-carbon text-sm">Penalty Imposed</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                IRDAI fined Star Health ₹2 Crore in Nov 2026 for systemic claim settlement delays.{' '}
                <span className="text-carbon-3">IRDAI Regulatory Order</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Meet Your Agent Team */}
      <section className="py-16 sm:py-20 bg-paper border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
              Specialized Multi-Agent AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
              Meet your defense team
            </h2>
            <p className="text-xs sm:text-sm text-carbon-2">
              Four specialized agents collaborate to read contracts, verify evidence, draft notices, and protect consent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-card bg-surface border border-border shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-evergreen-50 text-evergreen-700 font-bold text-sm flex items-center justify-center">
                L
              </div>
              <h4 className="font-bold text-carbon text-sm">Lekha (Reader)</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Parses dense multi-page policy wordings, exclusions, and itemized hospital bills with OCR.
              </p>
            </div>

            <div className="p-5 rounded-card bg-surface border border-border shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-clay-50 text-clay-600 font-bold text-sm flex items-center justify-center">
                N
              </div>
              <h4 className="font-bold text-carbon text-sm">Nyaya (Judge)</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Evaluates legality against IRDAI master circulars, moratorium periods, and case law precedents.
              </p>
            </div>

            <div className="p-5 rounded-card bg-surface border border-border shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#EFF4FA] text-[#3B6EA5] font-bold text-sm flex items-center justify-center">
                D
              </div>
              <h4 className="font-bold text-carbon text-sm">Doot (Escalator)</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Drafts formal statutory grievance petitions and tracks strict 15-day insurer SLA windows.
              </p>
            </div>

            <div className="p-5 rounded-card bg-surface border border-border shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-success-bg text-success font-bold text-sm flex items-center justify-center">
                R
              </div>
              <h4 className="font-bold text-carbon text-sm">Rakshak (Guardian)</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Gates every outbound action behind explicit user consent and scrubs sensitive medical PII.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Honest by Design Section */}
      <section className="py-16 sm:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
              Ethical Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
              Honest by Design
            </h2>
            <p className="text-xs sm:text-sm text-carbon-2">
              ClaimKavach is built on radical transparency and verifiable evidence, not opaque AI guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-card border border-border bg-surface-warm/40 space-y-3">
              <div className="w-9 h-9 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-carbon text-sm">Sometimes the insurer is right</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                If a deduction is fair under policy terms (e.g. room rent limits or non-medical items), we say so openly and explain why. We never invent false disputes.
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-surface-warm/40 space-y-3">
              <div className="w-9 h-9 rounded-btn bg-clay-50 text-clay-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-carbon text-sm">Nothing is sent without your tap</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                No autonomous bots spamming desks. Every petition, letter, and regulator escalation requires your explicit one-tap approval with an 8-second undo window.
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-surface-warm/40 space-y-3">
              <div className="w-9 h-9 rounded-btn bg-success-bg text-success flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-carbon text-sm">Every claim cites your papers</h4>
              <p className="text-xs text-carbon-2 leading-relaxed">
                Every argument points directly to exact clause numbers on your policy PDF and verified IRDAI circulars. If an agent cannot prove a claim, it remains silent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faqs" className="py-16 sm:py-20 bg-paper border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-border rounded-card border border-border bg-surface shadow-xs overflow-hidden">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-semibold text-carbon text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-carbon-3 flex-shrink-0 transform transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-2.5 text-xs text-carbon-2 leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="py-16 bg-[#FBF1E6] dark:bg-[#17201B] border-b border-border text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-carbon">
            Don't accept the first "No".
          </h2>
          <p className="text-xs sm:text-sm text-carbon-2">
            Upload your policy and rejection letter to see if the insurer's decision is contractually sound.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartReview}
              className="gap-2 text-sm px-8 font-semibold shadow-sm"
            >
              Start My Claim Review
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Footer with Honesty Line and Data Purge */}
      <footer className="py-8 bg-surface text-center space-y-3 text-xs text-carbon-3 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>Prototype · Synthetic data only · Not legal advice · Insurer and regulator portals are simulated</span>
          <button
            onClick={handleDeleteData}
            className="text-danger hover:underline font-medium"
          >
            Delete all my data
          </button>
        </div>
      </footer>
    </div>
  );
};
