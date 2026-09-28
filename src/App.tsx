/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ItemReport, MatchResult, ReportType, IndicatorStatus } from './types';
import { INITIAL_DEMO_REPORTS, DEMO_PRESETS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ReportForm } from './components/ReportForm';
import { AiAnalysisScreen } from './components/AiAnalysisScreen';
import { MatchResultsView } from './components/MatchResultsView';
import { SafeVerificationModal } from './components/SafeVerificationModal';
import { DashboardView } from './components/DashboardView';
import { WorkflowSection } from './components/WorkflowSection';
import { TechnologySection } from './components/TechnologySection';
import { Footer } from './components/Footer';

const LOCAL_STORAGE_KEY = 'findback_ai_reports_v1';

export default function App() {
  const [reports, setReports] = useState<ItemReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
    return INITIAL_DEMO_REPORTS;
  });

  const [currentTab, setCurrentTab] = useState<
    'home' | 'report-lost' | 'report-found' | 'dashboard' | 'workflow' | 'analyzing' | 'match-results'
  >('home');

  const [activeTargetReport, setActiveTargetReport] = useState<ItemReport | null>(null);
  const [activeMatches, setActiveMatches] = useState<MatchResult[]>([]);
  const [engineUsed, setEngineUsed] = useState<string>('gemini-3.8-flash');
  const [selectedPreset, setSelectedPreset] = useState<typeof DEMO_PRESETS[0] | null>(null);
  const [verificationCandidate, setVerificationCandidate] = useState<{
    match: MatchResult;
    candidate: ItemReport;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [reports]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleResetDemoData = () => {
    setReports(INITIAL_DEMO_REPORTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Reset to default fictional demo campus reports.');
  };

  // Trigger matching API
  const runAiMatching = async (target: ItemReport) => {
    setActiveTargetReport(target);
    setCurrentTab('analyzing');

    // Filter candidate pool: opposite type and not resolved
    const oppositeType = target.type === 'lost' ? 'found' : 'lost';
    const candidates = reports.filter((r) => r.type === oppositeType && r.status !== 'resolved');

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetReport: target,
          candidateReports: candidates,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveMatches(data.matches || []);
        if (data.engine) setEngineUsed(data.engine);
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      console.warn('Matching request failed or running in client-only mode, generating offline calculation:', err);
      // Fallback local match computation so it never fails even if backend is disconnected
      const fallbackMatches: MatchResult[] = candidates
        .map((cand) => {
          const sameCategory = target.category.toLowerCase() === cand.category.toLowerCase();
          const targetTitleWords = target.itemName.toLowerCase().split(/\s+/);
          const candTitleWords = cand.itemName.toLowerCase().split(/\s+/);
          const hasSharedTitleWords = targetTitleWords.some(w => w.length > 2 && candTitleWords.includes(w));

          let score = 0;
          if (sameCategory) score += 40;
          if (hasSharedTitleWords) score += 25;
          if (target.color && cand.color && (target.color.toLowerCase().includes(cand.color.toLowerCase()) || cand.color.toLowerCase().includes(target.color.toLowerCase()))) {
            score += 20;
          }
          if (target.location && cand.location && (target.location.toLowerCase().includes(cand.location.toLowerCase()) || cand.location.toLowerCase().includes(target.location.toLowerCase()))) {
            score += 15;
          }

          const confidence: 'High' | 'Moderate' | 'Low' = score >= 75 ? 'High' : score >= 55 ? 'Moderate' : 'Low';
          return {
            candidateId: cand.id,
            similarityScore: Math.min(94, score),
            confidence,
            explanation: `This candidate report may match because both describe ${target.category.toLowerCase()} items (${target.color}) around campus locations. Physical ownership details should be verified before handoff.`,
            indicators: {
              itemType: { 
                status: (sameCategory ? 'exact' : 'moderate') as IndicatorStatus, 
                label: sameCategory ? 'Exact category match' : 'Category variance' 
              },
              color: { status: 'high' as IndicatorStatus, label: 'Color similarity' },
              location: { status: 'nearby' as IndicatorStatus, label: 'Campus zone proximity' },
              time: { status: 'compatible' as IndicatorStatus, label: 'Compatible timeframe' },
              description: { status: 'high' as IndicatorStatus, label: 'Shared physical traits' },
            },
            matchingCharacteristics: [`Category: ${target.category}`, `Color: ${target.color}`],
            recommendedAction: cand.custodyLocation ? `Visit ${cand.custodyLocation}` : 'Initiate safe verification through FindBack',
            suggestedVerificationPrompt: 'Ask the claimant to specify a private marking, sticker, or distinctive detail not shown publicly.',
          };
        })
        .filter((m) => m.similarityScore >= 50)
        .sort((a, b) => b.similarityScore - a.similarityScore);

      setActiveMatches(fallbackMatches);
      setEngineUsed('semantic-heuristic');
    }
  };

  // Called when user submits report form
  const handleFormSubmit = (data: Omit<ItemReport, 'id' | 'status' | 'createdAt'>) => {
    const newReport: ItemReport = {
      ...data,
      id: `report-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    setReports((prev) => [newReport, ...prev]);
    showToast(`New ${newReport.type.toUpperCase()} report successfully submitted.`);
    runAiMatching(newReport);
  };

  // Count active potential matches across all active reports dynamically
  const potentialMatchesCount = reports
    .filter((r) => r.type === 'lost' && r.status === 'active')
    .reduce((count, lostItem) => {
      const hasCandidate = reports.some(
        (f) =>
          f.type === 'found' &&
          f.status === 'active' &&
          (f.category.toLowerCase() === lostItem.category.toLowerCase() ||
            (lostItem.color && f.color && lostItem.color.toLowerCase().includes(f.color.toLowerCase())))
      );
      return count + (hasCandidate ? 1 : 0);
    }, 0);

  const handleMarkReunited = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    showToast('Report marked as successfully reunited & resolved!');
  };

  const handleLoadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setSelectedPreset(preset);
    setCurrentTab('report-lost');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab === 'analyzing' || currentTab === 'match-results' ? 'home' : currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        demoMode={true}
        onResetDemoData={handleResetDemoData}
        reportCount={{
          lost: reports.filter((r) => r.type === 'lost' && r.status !== 'resolved').length,
          found: reports.filter((r) => r.type === 'found' && r.status !== 'resolved').length,
          matches: potentialMatchesCount,
        }}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* TAB: HOME */}
        {currentTab === 'home' && (
          <>
            <Hero
              onReportLost={() => {
                setSelectedPreset(null);
                setCurrentTab('report-lost');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReportFound={() => {
                setSelectedPreset(null);
                setCurrentTab('report-found');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreWorkflow={() => {
                setCurrentTab('workflow');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadPreset={handleLoadPreset}
            />

            {/* Quick Live Preview of Campus Reports on Home */}
            <section className="py-12 bg-white border-t border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Recent Activity
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                      Latest Campus Reports &amp; Verified Items
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Full Live Ledger →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all hover:bg-white hover:shadow-xs cursor-pointer flex flex-col justify-between"
                      onClick={() => runAiMatching(report)}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              report.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {report.type.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {report.date}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {report.itemName}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 truncate max-w-[170px]">
                          {report.location}
                        </span>
                        <span className="text-indigo-600 font-semibold flex items-center gap-1">
                          Test Match →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <WorkflowSection
              onStartReport={() => {
                setSelectedPreset(null);
                setCurrentTab('report-lost');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <TechnologySection />
          </>
        )}

        {/* TAB: REPORT LOST ITEM */}
        {currentTab === 'report-lost' && (
          <ReportForm
            type="lost"
            initialPreset={selectedPreset}
            onCancel={() => setCurrentTab('home')}
            onSubmit={handleFormSubmit}
          />
        )}

        {/* TAB: REPORT FOUND ITEM */}
        {currentTab === 'report-found' && (
          <ReportForm
            type="found"
            initialPreset={selectedPreset}
            onCancel={() => setCurrentTab('home')}
            onSubmit={handleFormSubmit}
          />
        )}

        {/* TAB: AI ANALYSIS IN PROGRESS */}
        {currentTab === 'analyzing' && activeTargetReport && (
          <AiAnalysisScreen
            targetReport={activeTargetReport}
            onAnalysisComplete={() => {
              setCurrentTab('match-results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB: MATCH RESULTS VIEW */}
        {currentTab === 'match-results' && activeTargetReport && (
          <MatchResultsView
            targetReport={activeTargetReport}
            matches={activeMatches}
            candidateReports={reports}
            engineUsed={engineUsed}
            onVerifyAndConnect={(match, candidate) => {
              setVerificationCandidate({ match, candidate });
            }}
            onDismissMatch={(candidateId) => {
              setActiveMatches((prev) => prev.filter((m) => m.candidateId !== candidateId));
              showToast('Candidate match dismissed.');
            }}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            onCreateNewReport={() => setCurrentTab('report-lost')}
          />
        )}

        {/* TAB: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <DashboardView
            reports={reports}
            potentialMatchesCount={potentialMatchesCount}
            onSelectReportToMatch={(report) => {
              runAiMatching(report);
            }}
            onMarkReunited={handleMarkReunited}
            onCreateReport={(type) => {
              setSelectedPreset(null);
              setCurrentTab(type === 'lost' ? 'report-lost' : 'report-found');
            }}
          />
        )}

        {/* TAB: WORKFLOW EXPLANATION */}
        {currentTab === 'workflow' && (
          <>
            <WorkflowSection
              onStartReport={() => {
                setSelectedPreset(null);
                setCurrentTab('report-lost');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <TechnologySection />
          </>
        )}

      </main>

      {/* Safe Verification Modal */}
      {verificationCandidate && activeTargetReport && (
        <SafeVerificationModal
          match={verificationCandidate.match}
          candidate={verificationCandidate.candidate}
          targetReport={activeTargetReport}
          onClose={() => setVerificationCandidate(null)}
          onResolveItem={(id) => handleMarkReunited(id)}
        />
      )}

      {/* Footer */}
      <Footer
        onNav={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
