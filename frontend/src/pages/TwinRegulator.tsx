import React, { useState, useEffect } from 'react';
import { Message } from '../lib/types';
import { fetchRegulatorComplaints } from '../lib/api';
import { formatDate } from '../lib/format';
import { Landmark, RefreshCw, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const TwinRegulator: React.FC = () => {
  const [complaints, setComplaints] = useState<Message[]>([]);

  const loadData = () => {
    fetchRegulatorComplaints().then(setComplaints);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Simulation Banner */}
      <div className="bg-emerald-600 text-white px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider select-none">
        🏛️ SIMULATED IRDAI BIMA BHAROSA PORTAL — REGULATORY ESCALATION REGISTER
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Bima Bharosa Portal (Simulated)
            </h1>
            <p className="text-xs text-slate-500">
              Insurance Regulatory and Development Authority of India (IRDAI)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/judge">
            <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Judge Tools
            </Button>
          </Link>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Register Table */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Consumer Grievance Docket Register
              </h2>
              <p className="text-xs text-slate-500">
                Transmitted disputes under active regulatory oversight.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              {complaints.length} Dockets Active
            </span>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs italic">
              No regulatory dockets registered yet. Escalate an unresolved GRO grievance from ClaimKavach to view records.
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                      Docket #BB-2026-094821
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Date Registered: {formatDate(c.virtual_date)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">{c.subject}</h3>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 max-h-48 overflow-y-auto">
                    {c.body}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Target Insurer: Meridian Health Insurance Co. Ltd.</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Statutory 15-Day Insurer Notice Transmitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
