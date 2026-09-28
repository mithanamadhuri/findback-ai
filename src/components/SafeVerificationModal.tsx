import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  HelpCircle, 
  Send, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  AlertCircle,
  EyeOff
} from 'lucide-react';
import { ItemReport, MatchResult } from '../types';

interface SafeVerificationModalProps {
  match: MatchResult;
  candidate: ItemReport;
  targetReport: ItemReport;
  onClose: () => void;
  onResolveItem: (reportId: string) => void;
}

export const SafeVerificationModal: React.FC<SafeVerificationModalProps> = ({
  match,
  candidate,
  targetReport,
  onClose,
  onResolveItem,
}) => {
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [contactMethod, setContactMethod] = useState<'desk' | 'proxy'>('desk');
  const [submitted, setSubmitted] = useState(false);
  const [resolved, setResolved] = useState(false);

  const handleSendSafeVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationAnswer.trim()) return;
    setSubmitted(true);
  };

  const handleConfirmReunited = () => {
    onResolveItem(targetReport.id);
    onResolveItem(candidate.id);
    setResolved(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Safe Ownership Verification
              </span>
              <h3 className="text-xl font-bold">
                {candidate.itemName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Match Comparison Summary Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matched Against {candidate.type.toUpperCase()} Report #{candidate.id.slice(-5)}
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {candidate.itemName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{candidate.category}</span>
                <span>•</span>
                <span>{candidate.color}</span>
                <span>•</span>
                <span>{candidate.location}</span>
                <span>•</span>
                <span>{candidate.date}</span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center shrink-0">
              <span className="text-lg font-black text-indigo-700 block">
                {match.similarityScore}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                AI Estimate
              </span>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3 text-xs sm:text-sm text-indigo-950">
            <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">FindBack Zero-Disclosure Privacy:</strong> Neither your phone number, email, nor exact residence will be revealed. Communication is facilitated either at the official campus desk or via our anonymized proxy.
            </div>
          </div>

          {/* AI Verification Question */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI-Suggested Private Verification Question</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              “{match.suggestedVerificationPrompt}”
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Provide unique details not listed publicly (such as interior labels, private stickers, lockscreen wallpaper, or contents).
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSendSafeVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Private Ownership Proof
                </label>
                <textarea
                  rows={3}
                  value={verificationAnswer}
                  onChange={(e) => setVerificationAnswer(e.target.value)}
                  placeholder="e.g. The case has a slight scratch on the left hinge, and medium sized black silicone tips are installed. Inside there is a 32GB SD card."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Contact Route Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Choose Preferred Safe Retrieval Route
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setContactMethod('desk')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      contactMethod === 'desk'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1 text-indigo-600" />
                    <span className="block font-bold">Campus Lost &amp; Found Desk</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Physical verification with a campus staff member
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactMethod('proxy')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      contactMethod === 'proxy'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Send className="w-4 h-4 mb-1 text-indigo-600" />
                    <span className="block font-bold">FindBack Anonymized Relay</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Send verified answer to finder without exchanging phone or email
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit safe verification */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Safe Claim Request</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success confirmation screen */
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-950">
                  Claim Request Dispatched Safely!
                </h4>
                <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto leading-relaxed">
                  {contactMethod === 'desk'
                    ? `Your proof has been assigned verification ticket #FB-${targetReport.id.toUpperCase().slice(-4)}. You can present your campus student card at ${candidate.custodyLocation || 'Main Campus Lost & Found Desk'}.`
                    : 'Your encrypted verification answer was routed to the finder. The finder will review your undisclosed details and confirm handoff via the campus desk.'}
                </p>
              </div>

              {/* Once recovered button */}
              <div className="pt-4 border-t border-emerald-200/80">
                {!resolved ? (
                  <button
                    onClick={handleConfirmReunited}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Item Recovered? Mark as Safely Reunited</span>
                  </button>
                ) : (
                  <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Report status updated to Reunited &amp; Resolved!</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            PII protection active
          </span>
          <button
            onClick={onClose}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
