import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is ClaimKavach legal advice?',
      a: 'No. ClaimKavach is an autonomous document analysis, drafting, and bureaucracy execution agent. It extracts contractual facts from your policy and compiles standard statutory complaint templates based on public IRDAI regulations. It does not replace a licensed advocate or legal counsel.',
    },
    {
      q: 'Will the insurer really reply?',
      a: 'Under Section 8.1 of standard policy conditions and IRDAI Grievance Redressal guidelines, every licensed insurance company in India is legally mandated to acknowledge grievances within 3 days and resolve them within 15 days. If they fail, our system automatically escalates to the regulator.',
    },
    {
      q: 'What does ClaimKavach cost?',
      a: 'ClaimKavach is 100% free to use. It runs on free-tier infrastructure, requires zero credit cards, and does not charge any commission or contingency fee on recovered claims.',
    },
    {
      q: 'Is my personal health data safe?',
      a: 'Yes. ClaimKavach operates on a zero-retention privacy principle. All Aadhaar numbers and private identifiers are masked before processing, and intermediate document caches are permanently purged upon case resolution.',
    },
    {
      q: "What if the insurer's deduction is actually valid?",
      a: 'We will tell you immediately. If the deduction matches room-rent proportionality formulas or standard non-payable consumables under IRDAI Annexure I, Nyaya flags it as "Valid Deduction" so you do not waste time pursuing untenable disputes.',
    },
    {
      q: 'Which insurance companies are covered?',
      a: 'All Indian health insurance companies (standalone health insurers like Star Health, Care Health, Niva Bupa, as well as general insurers like HDFC ERGO, ICICI Lombard, New India Assurance) operating under IRDAI PPI and Ombudsman rules.',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-bold text-content">
            Clear answers to common questions.
          </h2>
          <p className="text-sm text-content-2">
            Honest facts about our prototype, autonomy, and legal scope.
          </p>
        </div>

        <div className="divide-y divide-border border border-border rounded-2xl bg-surface overflow-hidden shadow-xs">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="transition-colors">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-content hover:bg-surface-2/60 transition-colors"
                >
                  <span>{f.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-content-3" /> : <ChevronDown className="w-4 h-4 text-content-3" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-content-2 leading-relaxed bg-surface-2/20">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
