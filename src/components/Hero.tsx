import React from 'react';
import { 
  Search, 
  HelpCircle, 
  ArrowRight, 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/mockData';

interface HeroProps {
  onReportLost: () => void;
  onReportFound: () => void;
  onExploreWorkflow: () => void;
  onLoadPreset: (preset: typeof DEMO_PRESETS[0]) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onReportLost,
  onReportFound,
  onExploreWorkflow,
  onLoadPreset,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl -z-10">
        <div className="w-full h-full bg-gradient-to-tr from-indigo-200 via-violet-200 to-sky-100 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-xs sm:text-sm font-medium text-indigo-800 shadow-xs hover:bg-indigo-100 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Intelligent Campus Recovery Platform</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              Google Gemini Powered <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Hero Title & Taglines */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            FindBack <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">AI</span>
            <span className="block mt-2 text-3xl sm:text-5xl font-bold text-slate-800">
              Lost something? Let AI help you find it.
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl font-medium text-indigo-700 max-w-2xl mx-auto">
            An intelligent lost &amp; found assistant for safer, faster item recovery.
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Report lost or found items and let our AI agent analyze descriptions, locations, timing, and item characteristics to discover possible matches.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
            <button
              onClick={onReportLost}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-5 h-5 text-rose-100" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={onReportFound}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 className="w-5 h-5 text-indigo-100" />
              <span>Report Found Item</span>
            </button>

            <button
              onClick={onExploreWorkflow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Explore How It Works</span>
            </button>
          </div>

          {/* Quick Demo Pre-load Bar for Reviewers */}
          <div className="mt-10 pt-6 border-t border-slate-200/70 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Test Scenarios (Demo Data)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DEMO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onLoadPreset(preset)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-medium transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 group"
                >
                  <span>{preset.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual AI Workflow Step Strip */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
              Agent Execution Lifecycle
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              From Report to Safe Recovery in Four Stages
            </h2>
          </div>

          {/* 4 Connected Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1 */}
            <div className="relative group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-sm border border-rose-100">
                  01
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Intake
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                <span>Report</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Tell FindBack AI what you lost or found. Fast submission with guided category, time, and location cues.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero sensitive info stored</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100">
                  02
                </span>
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5" /> NLP
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <span>AI Understands</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                AI extracts important characteristics: color variations, physical traits, location landmarks, and time frames.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Semantic entity extraction</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-sm border border-violet-100">
                  03
                </span>
                <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">
                  Analysis
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
                <span>AI Matches</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                The agent compares candidate reports, calculates probabilistic similarity estimates, and produces reasoning breakdown.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-violet-500" />
                <Clock className="w-3.5 h-3.5 text-violet-500 ml-1" />
                <span>Multi-factor scoring</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm border border-emerald-100">
                  04
                </span>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Safe
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                <span>Recover</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Users verify the item safely with private questions and proceed through the campus lost &amp; found desk or secure proxy.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero contact disclosure</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
