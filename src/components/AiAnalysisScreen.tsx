import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Check, 
  Search, 
  Layers, 
  MapPin, 
  Clock, 
  Cpu, 
  ShieldCheck
} from 'lucide-react';
import { ItemReport } from '../types';

interface AiAnalysisScreenProps {
  targetReport: ItemReport;
  onAnalysisComplete: () => void;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    label: 'Understanding item description',
    detail: 'Parsing semantic entities, shape descriptors, and material cues...',
    icon: <BrainCircuit className="w-4 h-4" />
  },
  {
    id: 2,
    label: 'Extracting important characteristics',
    detail: 'Isolating category, verified colors, brand tokens, and unique physical traits...',
    icon: <Layers className="w-4 h-4" />
  },
  {
    id: 3,
    label: 'Comparing locations',
    detail: 'Calculating campus spatial proximity between reported loss and recovery zones...',
    icon: <MapPin className="w-4 h-4" />
  },
  {
    id: 4,
    label: 'Comparing time information',
    detail: 'Evaluating chronological feasibility window and reported intervals...',
    icon: <Clock className="w-4 h-4" />
  },
  {
    id: 5,
    label: 'Searching available reports',
    detail: 'Querying campus repository and active verified submissions...',
    icon: <Search className="w-4 h-4" />
  },
  {
    id: 6,
    label: 'Calculating possible matches',
    detail: 'Synthesizing multi-variable similarity estimates and generating safe verification reasoning...',
    icon: <Sparkles className="w-4 h-4" />
  }
];

export const AiAnalysisScreen: React.FC<AiAnalysisScreenProps> = ({
  targetReport,
  onAnalysisComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Step progression animation sequence
    const stepDuration = 650; // ms per step for smooth dramatic effect

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setCompletedSteps((done) => [...done, prev]);
          setProgress(Math.round(((next + 1) / STEPS.length) * 100));
          return next;
        } else {
          // Final step reached
          setCompletedSteps((done) => (done.includes(prev) ? done : [...done, prev]));
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            onAnalysisComplete();
          }, 600);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onAnalysisComplete]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-500/5 p-8 sm:p-12 text-center relative overflow-hidden">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Central Pulse Radar Graphic */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping opacity-40"></div>
          <div className="absolute -inset-3 rounded-full border border-indigo-200 animate-pulse opacity-60"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cpu className="w-10 h-10 animate-pulse text-indigo-200" />
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          FindBack AI is analyzing...
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Agent is correlating <span className="font-semibold text-slate-800">“{targetReport.itemName}”</span> across the campus database.
        </p>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span className="text-indigo-600">AI Reasoning Pipeline</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Live Extracted Entities Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Category: <strong className="text-slate-900">{targetReport.category}</strong>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Color: <strong className="text-slate-900">{targetReport.color}</strong>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Zone: <strong className="text-slate-900">{targetReport.location.split('—')[0].trim()}</strong>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> PII Protected
          </span>
        </div>

        {/* Multi-step Checklist with Transitions */}
        <div className="mt-8 text-left max-w-xl mx-auto space-y-3 pt-6 border-t border-slate-100">
          {STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isCurrent = currentStepIndex === idx && !isDone;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                    : isCurrent
                    ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 ring-2 ring-indigo-500/10'
                    : 'bg-slate-50/50 border-slate-200/50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDone ? 'text-emerald-900' : isCurrent ? 'text-indigo-950' : 'text-slate-500'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-indigo-700 mt-0.5 animate-in fade-in">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      Done
                    </span>
                  ) : isCurrent ? (
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                      Working...
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
