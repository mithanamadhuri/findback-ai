import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNav: (tab: 'home' | 'report-lost' | 'report-found' | 'dashboard' | 'workflow') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNav }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                FindBack<span className="text-indigo-400">.ai</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              FindBack AI is an intelligent lost &amp; found recovery assistant for colleges, universities, and public institutions. Helping students and staff recover items safely.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe student technology showcase • Public Privacy Standards</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNav('home')} className="hover:text-white transition-colors">
                  Overview &amp; Home
                </button>
              </li>
              <li>
                <button onClick={() => onNav('report-lost')} className="hover:text-white transition-colors">
                  Report Lost Item
                </button>
              </li>
              <li>
                <button onClick={() => onNav('report-found')} className="hover:text-white transition-colors">
                  Report Found Item
                </button>
              </li>
              <li>
                <button onClick={() => onNav('dashboard')} className="hover:text-white transition-colors">
                  Live Reports &amp; Matches
                </button>
              </li>
              <li>
                <button onClick={() => onNav('workflow')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Campus Security &amp; Desks
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-2">
              For official custody handoffs, visit:
            </p>
            <div className="space-y-1 text-[11px] text-slate-400">
              <p>• Main Library 1st Floor Circulation Desk</p>
              <p>• Student Union Information Desk (Level 1)</p>
              <p>• Campus Safety &amp; Police Substation</p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FindBack AI. An intelligent lost &amp; found assistant for safer, faster item recovery.</p>
          <p className="flex items-center gap-1">
            Built with modern AI technology for campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
