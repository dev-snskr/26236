/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { DjangoCodeViewer } from './components/DjangoCodeViewer';
import { TriBotAssistant } from './components/TriBotAssistant';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'django-code'>('student');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#FF9933]/20 selection:text-[#002244]">
      {/* Top Gov Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Official Government Notice Strip */}
      <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002244] uppercase tracking-wide text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded">
              SIH26239 Live
            </span>
            <span>
              {lang === 'en'
                ? 'Ministry of Tribal Affairs: AI-Enabled Scholarship & Fellowship Management System (ST & PVTG).'
                : 'जनजातीय कार्य मंत्रालय: अनुसूचित जनजाति एवं पीवीटीजी हेतु एआई-सक्षम छात्रवृत्ति प्रबंधन प्रणाली।'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-amber-800">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
              <span>DigiLocker & PFMS Integrated</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'student' && <StudentPortal lang={lang} />}
        {activeTab === 'admin' && <AdminDashboard lang={lang} />}
        {activeTab === 'django-code' && <DjangoCodeViewer lang={lang} />}
      </main>

      {/* Floating TriBot AI Assistant */}
      <TriBotAssistant lang={lang} />

      {/* Official Government Footer */}
      <footer className="bg-[#001730] text-slate-300 text-xs border-t-4 border-[#138808] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇮🇳</span>
                <span className="font-bold text-white text-sm">
                  {lang === 'en'
                    ? 'Ministry of Tribal Affairs, Government of India'
                    : 'जनजातीय कार्य मंत्रालय, भारत सरकार'}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                {lang === 'en'
                  ? 'Designed for Smart India Hackathon 2026 (SIH26239). Empowering tribal scholars through AI Scheme Matching, Real-Time OCR Certificate Verification, and Predictive Dropout Analytics.'
                  : 'स्मार्ट इंडिया हैकाथॉन २०२६ (SIH26239) हेतु विकसित। एआई योजना मैचमेकिंग, रियल-टाइम ओसीआर सत्यापन और ड्रॉप-आउट रोकथाम द्वारा जनजातीय विद्यार्थियों का सशक्तीकरण।'}
              </p>
            </div>

            <div>
              <span className="font-bold text-white block mb-2">Priority Portals</span>
              <ul className="space-y-1.5 text-slate-400">
                <li>National Fellowship for ST (NFST)</li>
                <li>National Overseas Scholarship (NOS)</li>
                <li>Top Class Education Scheme (TCES)</li>
                <li>PM-JANMAN Mission (PVTG)</li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-white block mb-2">Technical Standards</span>
              <ul className="space-y-1.5 text-slate-400">
                <li>National Scholarship Portal (NSP 2.0)</li>
                <li>DigiLocker Cryptographic DSC</li>
                <li>Public Financial Mgmt System (PFMS)</li>
                <li>GIGW 3.0 Accessibility Compliant</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>
              © 2026 Ministry of Tribal Affairs (MoTA) · Smart India Hackathon Prototype (SIH26239).
            </p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>Hyperlinking Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
