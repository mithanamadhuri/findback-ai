import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Laptop, 
  CheckCircle 
} from 'lucide-react';

export const TechnologySection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Under the Hood</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Powered by AI
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered with modern web standards and grounded machine learning models for ethical, privacy-preserving campus recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Google Gemini
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Utilizes Google Gemini (<code className="text-indigo-600 font-mono text-[11px]">gemini-3.8-flash</code>) for deep semantic comprehension, location relationship parsing, and structured matching evaluations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              AI-Powered Semantic Matching
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Looks beyond simple keyword equality by evaluating synonym matches, spatial proximity clusters, and chronological feasibility windows.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Zero PII Exposure Guard
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed from day one for public deployments: no phone numbers, email addresses, or government IDs are shown publicly or required for reports.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Modern Web &amp; Responsive
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built on React 19, Vite, and Tailwind CSS. Fully optimized for high-speed responsiveness on mobile phones, tablets, laptops, and desktop kiosks.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
