import React from 'react';
import { 
  FileEdit, 
  BrainCircuit, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Building2 
} from 'lucide-react';

interface WorkflowSectionProps {
  onStartReport: () => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onStartReport }) => {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How FindBack AI Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            An intelligent, non-chatbot agent workflow designed specifically to avoid public exposure of sensitive personal details while maximizing item recovery.
          </p>
        </div>

        {/* 4 Steps In-depth Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Step 1 */}
          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-md hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-lg mb-5 shadow-xs">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Report
            </h3>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Tell FindBack AI what you lost or found.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Users provide structured, non-sensitive characteristics such as item category, general color, campus building, and approximate time window.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs font-semibold text-rose-600 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero contact PII required</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-md hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg mb-5 shadow-xs">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Understand
            </h3>
            <p className="text-sm font-medium text-slate-700 mb-3">
              AI extracts important characteristics.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Gemini engine normalizes textual descriptors, detects brand tokens, analyzes physical attributes, and indexes campus zone proximity.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Semantic feature extraction</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-md hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg mb-5 shadow-xs">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Match
            </h3>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Agent compares reports &amp; ranks similarity.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              FindBack AI evaluates multi-dimensional compatibility (category, color, spatial distance, time overlap) and generates a probabilistic estimate.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs font-semibold text-violet-600 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Probabilistic similarity score</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-md hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-5 shadow-xs">
              04
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Recover
            </h3>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Users verify ownership safely.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Claimants answer an AI-generated verification challenge regarding undisclosed features, proceeding safely via the official campus desk.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus desk safe custody</span>
            </div>
          </div>

        </div>

        {/* Call to action bar */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-950/20">
          <div>
            <h3 className="text-xl font-bold">
              Ready to recover or report an item?
            </h3>
            <p className="text-sm text-indigo-200 mt-1">
              No registration or phone number required to submit an initial report.
            </p>
          </div>
          <button
            onClick={onStartReport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm shrink-0"
          >
            <span>Start a Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
