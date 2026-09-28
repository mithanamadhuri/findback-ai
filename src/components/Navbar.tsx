import React, { useState } from 'react';
import { Sparkles, Shield, Compass, PlusCircle, CheckCircle, RefreshCw, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'report-lost' | 'report-found' | 'dashboard' | 'workflow';
  onSelectTab: (tab: 'home' | 'report-lost' | 'report-found' | 'dashboard' | 'workflow') => void;
  demoMode: boolean;
  onResetDemoData: () => void;
  reportCount: { lost: number; found: number; matches: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  demoMode,
  onResetDemoData,
  reportCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: 'home' | 'report-lost' | 'report-found' | 'dashboard' | 'workflow') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 animate-pulse text-indigo-200" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  FindBack<span className="text-indigo-600">.ai</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Campus Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Smart Lost &amp; Found Intelligence
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                currentTab === 'home'
                  ? 'bg-slate-100 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNav('workflow')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                currentTab === 'workflow'
                  ? 'bg-slate-100 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
              {reportCount.matches > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                  {reportCount.matches}
                </span>
              )}
            </button>
          </nav>

          {/* CTA & Demo Mode Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {demoMode && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Demo Mode
                </span>
                <button
                  onClick={onResetDemoData}
                  title="Reload default fictional demo records"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => handleNav('report-lost')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-rose-500" />
              I Lost Something
            </button>

            <button
              onClick={() => handleNav('report-found')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4 text-indigo-200" />
              I Found Something
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 space-y-3 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              Home Overview
            </button>
            <button
              onClick={() => handleNav('workflow')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Live Reports &amp; Matches</span>
              <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full font-bold">
                {reportCount.lost + reportCount.found} records
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('report-lost')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200"
            >
              <PlusCircle className="w-4 h-4 text-rose-500" />
              I Lost Item
            </button>
            <button
              onClick={() => handleNav('report-found')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              I Found Item
            </button>
          </div>

          {demoMode && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1.5 font-medium text-amber-700">
                <Shield className="w-3.5 h-3.5" /> Fictional Demo Mode Active
              </span>
              <button
                onClick={onResetDemoData}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                Reset Demo Data
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
