import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Info, 
  Compass, 
  PlusCircle, 
  HelpCircle,
  EyeOff
} from 'lucide-react';
import { ItemReport, MatchResult } from '../types';

interface MatchResultsViewProps {
  targetReport: ItemReport;
  matches: MatchResult[];
  candidateReports: ItemReport[];
  engineUsed?: string;
  onVerifyAndConnect: (match: MatchResult, candidate: ItemReport) => void;
  onDismissMatch: (candidateId: string) => void;
  onGoToDashboard: () => void;
  onCreateNewReport: () => void;
}

export const MatchResultsView: React.FC<MatchResultsViewProps> = ({
  targetReport,
  matches,
  candidateReports,
  engineUsed,
  onVerifyAndConnect,
  onDismissMatch,
  onGoToDashboard,
  onCreateNewReport,
}) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const activeMatches = matches.filter((m) => !dismissedIds.includes(m.candidateId));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    onDismissMatch(id);
  };

  const getCandidate = (id: string): ItemReport | undefined => {
    return candidateReports.find((c) => c.id === id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return '🎧';
      case 'water bottles':
        return '💧';
      case 'cards & ids':
        return '💳';
      case 'wallets & bags':
        return '🎒';
      case 'keys':
        return '🔑';
      case 'clothing & accessories':
        return '🧣';
      case 'books & stationery':
        return '📚';
      default:
        return '📦';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Banner: Query Report Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                targetReport.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                Your {targetReport.type.toUpperCase()} Report
              </span>
              <span className="text-xs text-slate-400">ID: {targetReport.id}</span>
              {engineUsed && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold flex items-center gap-1">
                  {engineUsed.startsWith('gemini') ? '✨ Google Gemini AI' : '⚡ Semantic Heuristics'}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <span>{getCategoryIcon(targetReport.category)}</span>
              <span>{targetReport.itemName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View in Dashboard</span>
            </button>
            <button
              onClick={onCreateNewReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Report</span>
            </button>
          </div>
        </div>

        {/* Query Report Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Category &amp; Color</span>
            <span className="font-semibold text-slate-800">{targetReport.category} • {targetReport.color}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Location</span>
            <span className="font-semibold text-slate-800 truncate block" title={targetReport.location}>
              {targetReport.location}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Reported Date &amp; Time</span>
            <span className="font-semibold text-slate-800">{targetReport.date} ({targetReport.time})</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active &amp; Monitored
            </span>
          </div>
        </div>
      </div>

      {/* MATCHES SECTION */}
      {activeMatches.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Possible Match{activeMatches.length > 1 ? 'es' : ''} Found ({activeMatches.length})
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                AI cross-checked attributes against recorded {targetReport.type === 'lost' ? 'found' : 'lost'} records.
              </p>
            </div>

            {/* Verification Caution Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Please verify ownership using details not publicly disclosed.</span>
            </div>
          </div>

          {/* Cards for each match */}
          {activeMatches.map((match) => {
            const candidate = getCandidate(match.candidateId);
            if (!candidate) return null;

            const isHighScore = match.similarityScore >= 75;
            const scoreColor = isHighScore
              ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
              : 'text-amber-700 bg-amber-50 border-amber-200';

            return (
              <div
                key={match.candidateId}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden p-6 sm:p-8"
              >
                
                {/* Header row: Title + Match Score badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                      {getCategoryIcon(candidate.category)}
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Candidate {candidate.type.toUpperCase()} Record
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                        {candidate.itemName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                          {candidate.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {candidate.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {candidate.date} ({candidate.time})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Similarity Percentage Box */}
                  <div className="flex flex-col items-start sm:items-end">
                    <div className={`px-4 py-2 rounded-2xl border text-center shadow-xs ${scoreColor}`}>
                      <span className="text-2xl sm:text-3xl font-black tracking-tight block">
                        {match.similarityScore}%
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider block mt-0.5">
                        Possible Match
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 font-medium text-right">
                      AI-generated similarity estimate
                    </span>
                  </div>
                </div>

                {/* Candidate Description Snippet */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Publicly Disclosed Characteristics
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    “{candidate.description}”
                  </p>
                  {candidate.custodyLocation && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-indigo-700">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Currently Deposited at: {candidate.custodyLocation}</span>
                    </div>
                  )}
                </div>

                {/* Match Indicators Grid */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Match Indicators Evaluation</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    
                    {/* Item type */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block mb-1">Item Type</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {match.indicators.itemType.label}
                      </span>
                    </div>

                    {/* Color */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block mb-1">Color</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {match.indicators.color.label}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block mb-1">Location</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        {match.indicators.location.label}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block mb-1">Time</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {match.indicators.time.label}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block mb-1">Description</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {match.indicators.description.label}
                      </span>
                    </div>

                  </div>
                </div>

                {/* AI Explanation in Simple Language */}
                <div className="mt-6 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      Why this may match (AI Reasoning)
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {match.explanation}
                  </p>

                  {/* Bullet points of why */}
                  <div className="mt-3 pt-3 border-t border-indigo-200/50 flex flex-wrap gap-2">
                    {match.matchingCharacteristics.map((char, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/90 text-indigo-950 font-medium border border-indigo-200/60 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Step & Action Buttons */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 max-w-md">
                    <span className="font-bold text-slate-700 block mb-0.5">Recommended Next Step:</span>
                    <span>{match.recommendedAction}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleDismiss(match.candidateId)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Not My Item</span>
                    </button>

                    <button
                      onClick={() => onVerifyAndConnect(match, candidate)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>View Match Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty / No Matches State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            No strong match found yet.
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your report is saved and will remain active. The AI agent continuously compares newly submitted campus reports against yours.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
            <span className="font-bold text-slate-800 block">Recommended actions while you wait:</span>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span>Check in person at the central campus lost &amp; found desk (Main Library or Student Union).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span>Keep your notification channel active; you’ll receive an alert if a matching item is logged.</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={onCreateNewReport}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Report Another Item
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
