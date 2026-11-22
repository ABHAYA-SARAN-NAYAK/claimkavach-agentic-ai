import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProductMock } from './ProductMock';
import { loadJudgeDemo } from '../../lib/api';
import { toast } from 'sonner';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    try {
      const res = await loadJudgeDemo();
      toast.success("Loaded Priya Raghavan's demo scenario!");
      navigate(`/app/cases/${res.case_id}`);
    } catch {
      navigate('/app/cases');
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background radial gradient mesh */}
      <div className="absolute inset-0 bg-hero pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700/50 text-brand-600 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Autonomous Bureaucracy Execution Agent for Indian Families</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-content leading-[1.1]">
              Insurance said no.{' '}
              <span className="bg-gradient-to-r from-brand-500 to-teal-500 bg-clip-text text-transparent">
                We say, show me the policy.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-content-2 max-w-2xl leading-relaxed">
              ClaimKavach reads your papers, tells you honestly if the insurer is wrong, and then runs the whole complaint process for you — writing, tracking deadlines, and escalating until the claim is paid.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartDemo}
                icon={<Play className="w-4 h-4 fill-white" />}
              >
                Start with Priya's case (demo)
              </Button>
              <Link to="/how-it-works">
                <Button variant="secondary" size="lg">
                  See how it works
                </Button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-content-3">
              <span className="font-semibold text-content-2">Built on official IRDAI processes:</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Evidence-backed
              </span>
              <span>·</span>
              <span>You approve every send</span>
              <span>·</span>
              <span>Plain language</span>
              <span>·</span>
              <span>100% Free tier</span>
            </div>
          </div>

          {/* Right Product Mock */}
          <div className="lg:col-span-5 flex justify-center">
            <ProductMock />
          </div>
        </div>
      </div>
    </section>
  );
};
