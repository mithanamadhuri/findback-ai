import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  CheckCheck, 
  FolderClock, 
  HelpCircle,
  Shield,
  Layers,
  Archive
} from 'lucide-react';
import { ItemReport, ReportType } from '../types';

interface DashboardViewProps {
  reports: ItemReport[];
  potentialMatchesCount: number;
  onSelectReportToMatch: (report: ItemReport) => void;
  onMarkReunited: (reportId: string) => void;
  onCreateReport: (type: ReportType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  potentialMatchesCount,
  onSelectReportToMatch,
  onMarkReunited,
  onCreateReport,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'lost' | 'found' | 'matches' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics calculation
  const lostCount = reports.filter((r) => r.type === 'lost' && r.status !== 'resolved').length;
  const foundCount = reports.filter((r) => r.type === 'found' && r.status !== 'resolved').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const filteredReports = reports.filter((report) => {
    if (filterTab === 'lost' && (report.type !== 'lost' || report.status === 'resolved')) return false;
    if (filterTab === 'found' && (report.type !== 'found' || report.status === 'resolved')) return false;
    if (filterTab === 'resolved' && report.status !== 'resolved') return false;
    if (filterTab === 'matches') {
      if (report.status === 'resolved') return false;
      const oppositeType = report.type === 'lost' ? 'found' : 'lost';
      const hasOppositeMatch = reports.some(
        (o) =>
          o.type === oppositeType &&
          o.status !== 'resolved' &&
          (o.category.toLowerCase() === report.category.toLowerCase() ||
            (report.color && o.color && report.color.toLowerCase().includes(o.color.toLowerCase())))
      );
      if (!hasOppositeMatch) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${report.itemName} ${report.category} ${report.location} ${report.color} ${report.description}`.toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
            Campus Live Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Community Reports &amp; Recovery Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor real-time reports, verify claims safely, and trigger AI comparisons on demand.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onCreateReport('lost')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-rose-500" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => onCreateReport('found')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Lost Reports */}
        <button
          onClick={() => setFilterTab('lost')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-600 transition-colors">
              Active Lost Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {lostCount}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Awaiting campus matches</span>
          </p>
        </button>

        {/* Card 2: Found Reports */}
        <button
          onClick={() => setFilterTab('found')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
              Active Found Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {foundCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Safely logged &amp; custody-verified
          </p>
        </button>

        {/* Card 3: Potential Matches */}
        <button
          onClick={() => setFilterTab('matches')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-violet-300 hover:shadow-sm transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-violet-600 transition-colors">
              Possible Matches
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {potentialMatchesCount}
          </p>
          <p className="text-xs text-violet-600 mt-1 font-medium">
            AI similarity correlation available
          </p>
        </button>

        {/* Card 4: Resolved / Reunited */}
        <button
          onClick={() => setFilterTab('resolved')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors">
              Resolved &amp; Reunited
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-3">
            {resolvedCount}
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-medium">
            Items returned to verified owners
          </p>
        </button>

      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => setFilterTab('lost')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Items ({lostCount})
            </button>
            <button
              onClick={() => setFilterTab('found')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'found'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Items ({foundCount})
            </button>
            <button
              onClick={() => setFilterTab('matches')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'matches'
                  ? 'bg-white text-violet-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Possible Matches ({potentialMatchesCount})
            </button>
            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'resolved'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reunited ({resolvedCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by keyword, color, place..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

        </div>

        {/* REPORTS LISTING */}
        <div className="space-y-3 pt-2">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const isLost = report.type === 'lost';
              const isResolved = report.status === 'resolved';

              return (
                <div
                  key={report.id}
                  className={`p-5 rounded-2xl border transition-all hover:shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isResolved
                      ? 'bg-slate-50/60 border-slate-200 opacity-80'
                      : isLost
                      ? 'bg-white border-slate-200/90 hover:border-rose-300'
                      : 'bg-white border-slate-200/90 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200/60">
                      {getCategoryIcon(report.category)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isLost
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {isResolved ? 'Reunited & Resolved' : isLost ? 'Lost Item' : 'Found Item'}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {report.category}
                        </span>
                        {report.isDemo && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/50">
                            Demo Record
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {report.itemName}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 max-w-2xl line-clamp-1">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {report.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {report.date} ({report.time})
                        </span>
                        {report.custodyLocation && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">
                              Custody: {report.custodyLocation}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {!isResolved && (
                      <>
                        <button
                          onClick={() => onSelectReportToMatch(report)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Find Matches</span>
                        </button>

                        <button
                          onClick={() => onMarkReunited(report.id)}
                          title="Mark this item as recovered"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resolved</span>
                        </button>
                      </>
                    )}

                    {isResolved && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>Recovered</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No reports match your current filter or search criteria.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
