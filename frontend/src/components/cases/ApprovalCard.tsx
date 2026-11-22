import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Edit3, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Approval } from '../../lib/types';
import { approveAction, undoApproval } from '../../lib/api';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface ApprovalCardProps {
  approval: Approval;
  onDecided?: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ approval, onDecided }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(approval.draft_body);
  const [loading, setLoading] = useState(false);
  const [approvedState, setApprovedState] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await approveAction(approval.id, isEditing ? draftText : undefined);
      setApprovedState(true);

      // Toast with 8-second Undo button per PRD 4.10
      toast.success('Complaint dispatched to Grievance Officer', {
        duration: 8000,
        action: {
          label: 'Undo (8s)',
          onClick: async () => {
            try {
              await undoApproval(approval.id);
              setApprovedState(false);
              toast.info('Dispatch undone. Restored to pending approvals.');
              if (onDecided) onDecided();
            } catch {
              toast.error('Undo grace period has expired.');
            }
          },
        },
      });

      setTimeout(() => {
        if (onDecided) onDecided();
      }, 1200);
    } catch (err: any) {
      toast.error('Approval failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (approvedState) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0.8, scale: 0.98 }}
        className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 flex items-center gap-3 text-emerald-800 dark:text-emerald-300"
      >
        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Approved and Dispatched</h4>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
            15-day statutory response window initiated. Undo available in toast.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-surface p-5 shadow-xs transition-all space-y-4">
      {/* Action Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Action Awaiting Your Authorization
          </span>
          <h3 className="text-base font-bold text-content mt-0.5">{approval.action}</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          Pending
        </span>
      </div>

      {/* Why & Evidence */}
      <div className="space-y-2">
        <p className="text-xs text-content-2">
          <strong>Why:</strong> The continuous policy coverage duration (64 months) bars non-disclosure repudiations under Clause 5.4.
        </p>

        {approval.evidence && approval.evidence.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {approval.evidence.map((ev, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[11px] font-mono text-content-3"
              >
                {ev.source}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Risk / Cost Note */}
      <div className="flex items-center gap-2 text-xs text-content-3 bg-surface-2/60 p-2.5 rounded-lg border border-border">
        <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
        <span>Starts a 15-day statutory reply window. Free to file.</span>
      </div>

      {/* Expandable Draft Preview */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <span>{expanded ? 'Hide draft letter' : 'Preview draft letter'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="mt-2.5 space-y-2">
            <div className="p-3 rounded-xl bg-surface-2/70 border border-border font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-full bg-surface p-2 rounded border border-border text-xs font-mono text-content focus:outline-none"
                  rows={8}
                />
              ) : (
                draftText
              )}
            </div>
            {isEditing && (
              <p className="text-[11px] text-content-3">
                Edit mode active. Click 'Approve & send' to dispatch your modified text.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button
          variant="primary"
          onClick={handleApprove}
          loading={loading}
          icon={<Send className="w-3.5 h-3.5" />}
        >
          Approve & send
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setExpanded(true);
            setIsEditing(!isEditing);
          }}
          icon={<Edit3 className="w-3.5 h-3.5" />}
        >
          {isEditing ? 'Cancel Edit' : 'Edit first'}
        </Button>
      </div>
    </div>
  );
};
