import React, { useState, useEffect } from 'react';
import { Message } from '../lib/types';
import { fetchInsurerMessages } from '../lib/api';
import { formatDate } from '../lib/format';
import { Building2, Mail, RefreshCw, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const TwinInsurer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const loadData = () => {
    fetchInsurerMessages().then((res) => {
      setMessages(res);
      if (res.length > 0 && !selectedMsg) setSelectedMsg(res[0]);
    });
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Simulation Banner */}
      <div className="bg-amber-500 text-slate-900 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider select-none">
        ⚠️ SIMULATED INSURER TWIN — FOR HACKATHON STAGE DEMONSTRATION ONLY
      </div>

      {/* Corporate Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            MH
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Meridian Health Insurance Co. Ltd.
            </h1>
            <p className="text-xs text-slate-500">
              Grievance Redressal Officer Portal (Simulated Mailbox)
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

      {/* Two Column Mailbox Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Mail List */}
        <div className="md:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[700px]">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
            <span>Incoming Grievance Tickets</span>
            <span>{messages.length} Items</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {messages.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 italic">
                Inbox empty. Submit a complaint from ClaimKavach to simulate receipt.
              </p>
            ) : (
              messages.map((m) => {
                const isSelected = selectedMsg?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMsg(m)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span className="font-semibold text-slate-600 uppercase">{m.direction}</span>
                      <span>{formatDate(m.virtual_date)}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{m.subject}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{m.body}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Message Viewer */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col h-[700px]">
          {selectedMsg ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase font-bold">
                  {selectedMsg.step.toUpperCase()} Communication
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">{selectedMsg.subject}</h2>
                <div className="text-xs text-slate-500 mt-1 space-y-0.5 font-mono">
                  <p>From: {selectedMsg.from_addr}</p>
                  <p>To: {selectedMsg.to_addr}</p>
                  <p>Virtual Dispatch Date: {formatDate(selectedMsg.virtual_date)}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-700">
                {selectedMsg.body}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs italic">
              Select an email from the left pane to preview details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
