import React from 'react';
import { ShieldCheck, GraduationCap, BarChart3, Code2, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: 'student' | 'admin' | 'django-code';
  setActiveTab: (tab: 'student' | 'admin' | 'django-code') => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
}) => {
  return (
    <header className="bg-[#002244] text-white border-b-4 border-[#FF9933] shadow-md sticky top-0 z-40">
      {/* Top micro-bar */}
      <div className="bg-[#001730] px-4 py-1 text-[11px] text-slate-300 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-400">
              {lang === 'en' ? 'Smart India Hackathon 2026' : 'स्मार्ट इंडिया हैकाथॉन २०२६'}
            </span>
            <span>·</span>
            <span className="font-mono text-slate-300">Problem ID: SIH26239</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-400">
              {lang === 'en' ? 'Screen Reader Accessible' : 'स्क्रीन रीडर सुलभ'}
            </span>
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              title="Toggle English / Hindi"
            >
              <Globe className="w-3 h-3 text-[#FF9933]" />
              <span className="font-semibold">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Gov Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Emblem & Ministry identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0 relative overflow-hidden group">
              {/* Ashoka Chakra simulation symbol */}
              <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] flex items-center justify-center text-[10px] font-bold text-[#FF9933]">
                🇮🇳
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                <span>{lang === 'en' ? 'Government of India' : 'भारत सरकार'}</span>
                <span>·</span>
                <span className="text-[#FF9933]">{lang === 'en' ? 'Ministry of Tribal Affairs' : 'जनजातीय कार्य मंत्रालय'}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>TribalEdu AI</span>
                <span className="text-xs font-normal text-slate-300 hidden sm:inline">
                  {lang === 'en'
                    ? '— Scholarship & Fellowship Management System'
                    : '— अनुसूचित जनजाति छात्रवृत्ति एवं अध्येतावृत्ति प्रबंधन प्रणाली'}
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0" aria-label="Portal Navigation">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'student'
                  ? 'bg-white text-[#002244] shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#FF9933]" />
              <span>{lang === 'en' ? 'Student Portal & Matchmaker' : 'छात्र पोर्टल एवं मैचमेकर'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-white text-[#002244] shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#138808]" />
              <span>{lang === 'en' ? 'Officer Analytics (Chart.js)' : 'अधिकारी डैशबोर्ड'}</span>
            </button>

            <button
              onClick={() => setActiveTab('django-code')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'django-code'
                  ? 'bg-amber-400 text-[#001730] shadow-sm font-bold'
                  : 'text-amber-300 hover:bg-amber-400/20'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Django Codebase (SIH)' : 'जांगो कोड फाइल्स'}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">5 Files</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
