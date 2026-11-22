import React, { useState } from 'react';
import { X, Send, Edit3, ShieldAlert, CheckCircle, Clock, FileText, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { approveAction, undoApproval } from '../../lib/api';
import { toast } from 'sonner';

interface ReviewApproveSheetProps {
  open: boolean;
  onClose: () => void;
  approval: any;
  onApproved: () => void;
}

export const ReviewApproveSheet: React.FC<ReviewApproveSheetProps> = ({
  open,
  onClose,
  approval,
  onApproved,
}) => {
  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(approval?.draft_body || '');
  const [submitting, setSubmitting] = useState(false);

  if (!open || !approval) return null;

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const res = await approveAction(approval.id, editing ? draftBody : undefined);
      toast.success('Grievance petition approved and dispatched.', {
        duration: 8000,
        action: {
          label: 'Undo (8s)',
          onClick: async () => {
            try {
              await undoApproval(approval.id);
              toast.info('Dispatch canceled. Action restored to your review.');
              onApproved();
            } catch (err: any) {
              toast.error(err.message || 'Could not cancel dispatch.');
            }
          },
        },
      });
      onApproved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve grievance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-carbon/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-2xl bg-surface border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface-warm/40 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-clay-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-clay-600">
                  Step 2 of 5: Formal Grievance Complaint
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-carbon">
                Review & Approve Grievance Dispatch
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-btn text-carbon-3 hover:text-carbon hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sheet Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Recipient Card */}
            <div className="p-4 rounded-card bg-surface-warm/50 border border-border flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-carbon-3 uppercase tracking-wider block mb-1">
                  Recipient Authority
                </span>
                <p className="text-sm font-bold text-carbon">
                  Grievance Redressal Officer (GRO)
                </p>
                <p className="text-xs text-carbon-2">
                  Meridian Health Insurance Co. Ltd. (Statutory 15-day SLA)
                </p>
              </div>
              <Badge variant="default" size="sm" className="bg-evergreen-50 text-evergreen-700 border-evergreen-100">
                Statutory Level 1
              </Badge>
            </div>

            {/* Evidence Chips */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-carbon block">
                Evidence Cited in This Grievance
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface border border-border text-xs text-carbon shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-evergreen-700" />
                  Policy Doc · Clause 5.4 Moratorium
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface border border-border text-xs text-carbon shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  Continuous Coverage: 64 Months Verified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface border border-border text-xs text-carbon shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-clay-600" />
                  IRDAI Master Circular 2024
                </span>
              </div>
            </div>

            {/* Complaint Draft Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-carbon">
                  Subject: {approval.draft_subject}
                </span>
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className="text-xs text-evergreen-700 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {editing ? 'Cancel edit' : 'Edit complaint text'}
                </button>
              </div>

              {editing ? (
                <textarea
                  rows={14}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full p-4 rounded-card border border-evergreen-700/50 bg-surface font-sans text-xs leading-relaxed text-carbon focus:outline-none focus:ring-2 focus:ring-evergreen-700/20"
                />
              ) : (
                <div className="p-4 rounded-card border border-border bg-surface font-sans text-xs leading-relaxed text-carbon-2 whitespace-pre-line max-h-96 overflow-y-auto">
                  {draftBody || approval.draft_body}
                </div>
              )}
            </div>

            {/* Reassurance Note */}
            <div className="p-4 rounded-card bg-clay-50/70 border border-clay-100 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-clay-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon-2 leading-relaxed">
                <strong className="text-carbon font-semibold block mb-0.5">
                  Nothing is sent without your tap.
                </strong>
                Once approved, ClaimKavach transmits this formal complaint directly to the insurer's statutory grievance desk and begins monitoring the 15-day statutory deadline. You can cancel within 8 seconds of tapping approve.
              </div>
            </div>
          </div>

          {/* Persistent Footer with Primary Action */}
          <div className="p-5 border-t border-border bg-surface flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={onClose} className="text-xs text-carbon-3">
              Not now
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                loading={submitting}
                onClick={handleApprove}
                className="gap-2 px-6 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Approve & send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
