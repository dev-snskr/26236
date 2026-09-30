import React, { useState, useRef } from 'react';
import { 
  SCHEMES, 
  matchSchemes, 
  Scheme, 
  StudentMatchCriteria 
} from '../data/schemes';
import { 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  SlidersHorizontal,
  FileCheck2,
  RefreshCw,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentPortalProps {
  lang: 'en' | 'hi';
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ lang }) => {
  // Matchmaker State
  const [criteria, setCriteria] = useState<StudentMatchCriteria>({
    educationLevel: 'Ph.D.',
    annualIncome: 250000,
    subCategory: 'ST',
    fieldOfStudy: 'Computer Science & AI',
    percentageScore: 74.5,
  });

  const [activeTab, setActiveTab] = useState<'matchmaker' | 'verification'>('matchmaker');

  // OCR Verification State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>({
    name: 'Kavita_Gond_ST_Certificate_MP.pdf',
    size: '1.4 MB',
    type: 'application/pdf',
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'flagged';
    confidence: number;
    message: string;
    extractedData?: {
      name: string;
      father: string;
      tribe: string;
      district: string;
      authority: string;
      certNo: string;
      issueDate: string;
      signatureValid: boolean;
    };
  }>({
    status: 'idle',
    confidence: 0,
    message: '',
  });

  // Application Modal state
  const [appliedScheme, setAppliedScheme] = useState<Scheme | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute matches
  const matches = matchSchemes(criteria);

  // Trigger OCR Mock Simulation (2-second sleep as required by prompt)
  const handleStartOCRScan = (fileToScan = selectedFile) => {
    if (!fileToScan) return;
    setIsScanning(true);
    setVerificationResult({ status: 'idle', confidence: 0, message: '' });

    setScanStep(lang === 'en' ? 'Phase 1: Initializing Neural Vision OCR pipeline...' : 'चरण १: न्यूरल विज़न ओसीआर प्रारंभ किया जा रहा है...');

    setTimeout(() => {
      setScanStep(lang === 'en' ? 'Phase 2: Localizing Ashoka Lion emblem & Tehsildar DSC stamp...' : 'चरण २: राष्ट्रीय प्रतीक एवं डिजिटल मुहर का सत्यापन...');
    }, 700);

    setTimeout(() => {
      setScanStep(lang === 'en' ? 'Phase 3: Cross-referencing Madhya Pradesh ST Gazette registry...' : 'चरण ३: राज्य एसटी गजट डेटाबेस से सत्यापन...');
    }, 1400);

    // Prompt specifies a 2-second sleep simulation
    setTimeout(() => {
      setIsScanning(false);
      setVerificationResult({
        status: 'success',
        confidence: 98,
        message: 'AI Confidence Score: 98% - Verified and Approved.',
        extractedData: {
          name: 'Kavita Gond',
          father: 'Shri Rameshwar Gond',
          tribe: criteria.subCategory === 'PVTG' ? 'Baiga (Particularly Vulnerable Tribal Group)' : 'Gond (Scheduled Tribe - S.No 12)',
          district: 'Dindori, Madhya Pradesh',
          authority: 'Office of the Sub-Divisional Magistrate (SDM), Dindori',
          certNo: 'MP/ST/2024/914829',
          issueDate: '14 August 2024',
          signatureValid: true,
        },
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#002244', '#FF9933', '#138808'],
      });
    }, 2000);
  };

  const handleApplyClick = (scheme: Scheme) => {
    setAppliedScheme(scheme);
    setShowApplyModal(true);
    setApplicationSuccess(false);
  };

  const handleConfirmApplication = () => {
    setApplicationSuccess(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplicationSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* CANDIDATE HEADER PROFILE CARD */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#138808] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'en' ? 'Aadhaar Seeded ST Profile · DigiLocker Connected' : 'आधार प्रमाणित एसटी प्रोफाइल · डिजिलॉकर सम्बद्ध'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#002244] tracking-tight">
            {lang === 'en' ? 'Kavita Gond' : 'कविता गोंड'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
            <span>
              {lang === 'en' ? 'Tribe: ' : 'जनजाति: '}
              <strong className="text-slate-800 font-semibold">Gond (Scheduled Tribe)</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              {lang === 'en' ? 'Domicile: ' : 'मूल निवास: '}
              <strong className="text-slate-800 font-semibold">Madhya Pradesh (Dindori)</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              {lang === 'en' ? 'Academic ID: ' : 'अकादमिक आईडी: '}
              <span className="font-mono text-slate-700">APAAR-9812-4011</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-right">
            <span className="text-[11px] text-slate-500 block">
              {lang === 'en' ? 'Direct Benefit Transfer (DBT)' : 'प्रत्यक्ष लाभ अंतरण (DBT)'}
            </span>
            <span className="text-xs font-bold text-[#138808] flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"></span>
              Aadhaar Bank Linked
            </span>
          </div>
        </div>
      </section>

      {/* SUB-SECTION SELECTOR */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('matchmaker')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'matchmaker'
              ? 'border-[#002244] text-[#002244]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          <span>{lang === 'en' ? 'AI Scheme Matchmaker' : 'एआई योजना मैचमेकर'}</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'verification'
              ? 'border-[#002244] text-[#002244]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#138808]" />
          <span>{lang === 'en' ? 'AI Auto-Verification (Mock OCR)' : 'एआई दस्तावेज़ सत्यापन (ओसीआर)'}</span>
          {verificationResult.status === 'success' && (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
              98%
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT 1: AI SCHEME MATCHMAKER */}
      {activeTab === 'matchmaker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CRITERIA FORM (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9933]">
                  {lang === 'en' ? 'SIH26239 Core Module' : 'एसटी छात्रवृत्ति मॉड्यूल'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">Algorithmic Evaluator</span>
              </div>
              <h3 className="text-base font-bold text-[#002244] mt-0.5">
                {lang === 'en' ? 'Smart Matchmaker Criteria' : 'पात्रता मानदंड निर्धारण'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {lang === 'en'
                  ? 'Adjust your education degree, sub-caste category, and income to see algorithmic Ministry matches.'
                  : 'अपनी शिक्षा, उप-श्रेणी और वार्षिक आय दर्ज करें। प्रणाली तुरंत उपयुक्त योजनाओं का चयन करेगी।'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Education Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'en' ? 'Current Education Level' : 'वर्तमान शिक्षा स्तर'}
                </label>
                <select
                  value={criteria.educationLevel}
                  onChange={(e) => setCriteria({ ...criteria, educationLevel: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#002244] focus:outline-none"
                >
                  <option value="Ph.D.">Doctor of Philosophy (Ph.D. / Research)</option>
                  <option value="M.Phil">Master of Philosophy (M.Phil)</option>
                  <option value="Post Graduate">Post Graduate (M.Tech / M.Sc / M.A / MBA)</option>
                  <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / MBBS / B.A)</option>
                  <option value="Higher Secondary">Higher Secondary (Class XI & XII)</option>
                </select>
              </div>

              {/* Sub-Category (ST vs PVTG) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'en' ? 'Tribal Sub-Category' : 'जनजातीय उप-श्रेणी'}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {criteria.subCategory === 'PVTG' ? 'PM-JANMAN Priority' : 'Standard ST'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCriteria({ ...criteria, subCategory: 'ST' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition-colors ${
                      criteria.subCategory === 'ST'
                        ? 'border-[#002244] bg-[#002244] text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Scheduled Tribe (ST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCriteria({ ...criteria, subCategory: 'PVTG' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition-colors ${
                      criteria.subCategory === 'PVTG'
                        ? 'border-[#138808] bg-[#138808] text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    PVTG (75 Tribes)
                  </button>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {lang === 'en' ? 'Annual Family Income' : 'वार्षिक पारिवारिक आय'}
                  </label>
                  <span className="text-xs font-mono font-bold text-[#002244]">
                    ₹{criteria.annualIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={criteria.annualIncome}
                  onChange={(e) => setCriteria({ ...criteria, annualIncome: Number(e.target.value) })}
                  className="w-full accent-[#002244] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹50,000</span>
                  <span className="text-amber-700">₹2.5L (Post-Matric)</span>
                  <span className="text-emerald-700">₹6.0L (NFST/NOS)</span>
                  <span>₹10,00,000</span>
                </div>
              </div>

              {/* Qualifying Academic Score */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {lang === 'en' ? 'Academic Percentage / Score' : 'अकादमिक प्राप्तांक प्रतिशत'}
                  </label>
                  <span className="text-xs font-mono font-bold text-[#138808]">
                    {criteria.percentageScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="98"
                  step="0.5"
                  value={criteria.percentageScore}
                  onChange={(e) => setCriteria({ ...criteria, percentageScore: Number(e.target.value) })}
                  className="w-full accent-[#138808] cursor-pointer"
                />
              </div>

              {/* Field of Study */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'en' ? 'Discipline / Field of Study' : 'अध्ययन का क्षेत्र'}
                </label>
                <select
                  value={criteria.fieldOfStudy}
                  onChange={(e) => setCriteria({ ...criteria, fieldOfStudy: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#002244] focus:outline-none"
                >
                  <option value="Computer Science & AI">Computer Science, AI & IT</option>
                  <option value="Tribal Culture & Linguistics">Tribal Culture, Heritage & Indigenous Linguistics</option>
                  <option value="Bio-Sciences & Forest Ecology">Bio-Sciences, Ethno-botany & Forest Ecology</option>
                  <option value="Engineering & Technology">Engineering & Technology (IIT/NIT)</option>
                  <option value="Medicine & Public Health">Medicine & Public Health (AIIMS)</option>
                </select>
              </div>

              {/* Reset to Default */}
              <button
                type="button"
                onClick={() => setCriteria({
                  educationLevel: 'Ph.D.',
                  annualIncome: 250000,
                  subCategory: 'ST',
                  fieldOfStudy: 'Computer Science & AI',
                  percentageScore: 74.5,
                })}
                className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'en' ? 'Reset to Default Sample Profile' : 'डिफ़ॉल्ट प्रोफाइल पर रीसेट करें'}</span>
              </button>
            </div>
          </div>

          {/* MATCHED SCHEMES OUTPUT (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-[#002244]">
                  {lang === 'en' ? 'Matched Fellowship & Scholarship Schemes' : 'सुझाई गई अध्येतावृत्ति एवं छात्रवृत्ति योजनाएं'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'en'
                    ? `AI engine dynamically evaluated ${matches.length} central tribal schemes.`
                    : `प्रणाली ने ${matches.length} केंद्रीय योजनाओं का मूल्यांकन किया है।`}
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono">
                {matches.filter(m => m.matchScore >= 70).length} {lang === 'en' ? 'High Fits' : 'सटीक मेल'}
              </span>
            </div>

            <div className="space-y-4">
              {matches.map(({ scheme, matchScore, reasons }) => {
                const isHighMatch = matchScore >= 70;
                return (
                  <div
                    key={scheme.id}
                    className={`rounded-xl border transition-all p-5 ${
                      isHighMatch
                        ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                        : 'bg-white/70 border-slate-200 opacity-90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              isHighMatch
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {matchScore}% Match
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{scheme.code}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500">{scheme.ministryWing}</span>
                        </div>

                        <h4 className="text-base font-bold text-[#002244] leading-snug">
                          {lang === 'en' ? scheme.name : scheme.nameHi}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'en' ? scheme.shortDesc : scheme.shortDescHi}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplyClick(scheme)}
                        className={`shrink-0 text-xs px-4 py-2 rounded-lg font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5 ${
                          isHighMatch
                            ? 'bg-[#138808] text-white hover:bg-emerald-700'
                            : 'bg-[#002244] text-white hover:bg-[#001730]'
                        }`}
                      >
                        <span>{lang === 'en' ? 'Apply Now' : 'आवेदन करें'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Financial details row */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">
                          {lang === 'en' ? 'Monthly Stipend / Allowance:' : 'मासिक मानदेय:'}
                        </span>
                        <span className="font-semibold text-slate-800">{scheme.benefits.amount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">
                          {lang === 'en' ? 'Contingency & Equipment:' : 'आकस्मिक अनुसंधान अनुदान:'}
                        </span>
                        <span className="font-semibold text-slate-800">{scheme.benefits.contingency}</span>
                      </div>
                    </div>

                    {/* Algorithmic reasons */}
                    <div className="mt-3 bg-slate-50 rounded-lg p-2.5 text-[11px] text-slate-600 space-y-1">
                      <span className="font-semibold text-slate-700 block">
                        {lang === 'en' ? 'Match Reason Breakdown:' : 'पात्रता विश्लेषण:'}
                      </span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: AI AUTO-VERIFICATION (MOCK OCR) */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* UPLOAD & SCAN ZONE (6 COLS) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#138808]">
                {lang === 'en' ? 'Deep Learning OCR Pipeline' : 'न्यूरल ओसीआर इंजन'}
              </span>
              <h3 className="text-base font-bold text-[#002244] mt-0.5">
                {lang === 'en' ? 'Caste & Income Certificate AI Auto-Verification' : 'जाति एवं आय प्रमाण पत्र एआई ऑटो-सत्यापन'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {lang === 'en'
                  ? 'Simulates automatic extraction and cryptographic seal verification for Scheduled Tribe and PVTG certificates.'
                  : 'अनुसूचित जनजाति प्रमाण पत्रों की डिजिटल मुहर एवं विवरण का स्वचालित सत्यापन।'}
              </p>
            </div>

            {/* DRAG AND DROP ZONE */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  setSelectedFile({
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                    type: file.type,
                  });
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
                isDragging
                  ? 'border-[#002244] bg-blue-50/50'
                  : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSelectedFile({
                      name: file.name,
                      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                      type: file.type,
                    });
                  }
                }}
              />

              <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#002244]">
                <UploadCloud className="w-6 h-6 text-[#002244]" />
              </div>

              <p className="text-sm font-semibold text-slate-800">
                {lang === 'en' ? 'Drop ST Certificate or click to browse' : 'एसटी प्रमाण पत्र यहां खींचें अथवा चुनें'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'en' ? 'Supports PDF, PNG, JPG (e-District / CSC Issued)' : 'पीडीएफ अथवा जेपीजी प्रारूप (अधिकतम ५ एमबी)'}
              </p>

              {/* Sample files quick chips */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap justify-center gap-2">
                <span className="text-[11px] text-slate-500 self-center">
                  {lang === 'en' ? 'Or use sample:' : 'अथवा नमूना चुनें:'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile({
                      name: 'Kavita_Gond_ST_Certificate_MP.pdf',
                      size: '1.4 MB',
                      type: 'application/pdf',
                    });
                  }}
                  className="text-[11px] bg-white border border-slate-200 hover:border-slate-300 px-2 py-1 rounded text-slate-700"
                >
                  ST Gond Certificate.pdf
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile({
                      name: 'Baiga_PVTG_Special_Certificate.pdf',
                      size: '980 KB',
                      type: 'application/pdf',
                    });
                  }}
                  className="text-[11px] bg-white border border-slate-200 hover:border-slate-300 px-2 py-1 rounded text-slate-700"
                >
                  PVTG Baiga Certificate.pdf
                </button>
              </div>
            </div>

            {/* SELECTED FILE BANNER */}
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-4 h-4 text-[#002244] shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">{selectedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={() => handleStartOCRScan(selectedFile)}
                  className="shrink-0 px-4 py-2 bg-[#002244] text-white font-semibold rounded-lg hover:bg-[#001730] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === 'en' ? 'Scanning...' : 'स्कैन जारी...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                      <span>{lang === 'en' ? 'Run AI OCR Scan (2s)' : 'एआई ओसीआर चलाएं (२ सेकंड)'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SCANNING PROGRESS ANIMATION */}
            {isScanning && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#002244] shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#002244]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#002244]">
                      {lang === 'en' ? 'Simulating Neural Vision Inference (2s sleep)' : 'न्यूरल विजन ओसीआर सत्यापन जारी'}
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">{scanStep}</p>
                  </div>
                </div>

                {/* Laser animation bar */}
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#002244] h-full w-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* VERIFICATION RESULT CARD & OCR PREVIEW (6 COLS) */}
          <div className="lg:col-span-6 space-y-5">
            {verificationResult.status === 'success' && verificationResult.extractedData ? (
              <div className="bg-white rounded-xl border border-emerald-300 p-5 sm:p-6 shadow-xs space-y-5">
                {/* Confidence Badge Header (Exact prompt string: "AI Confidence Score: 98% - Verified and Approved.") */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-[#138808] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                      AI Confidence Score: 98% - Verified and Approved.
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      {lang === 'en'
                        ? 'Government seal, Ashoka emblem, and Sub-Divisional Magistrate cryptographic DSC verified with zero tamper anomalies.'
                        : 'सरकारी मुहर, राष्ट्रीय प्रतीक तथा अनुविभागीय अधिकारी के डिजिटल हस्ताक्षर सफलतापूर्वक सत्यापित।'}
                    </p>
                  </div>
                </div>

                {/* EXTRACTED FIELDS TABLE */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'AI Extracted Certificate Metadata' : 'एआई द्वारा निष्कर्षित प्रमाण पत्र डेटा'}
                  </h5>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="grid grid-cols-2 p-2.5 bg-slate-50 border-b border-slate-200">
                      <span className="text-slate-500">Applicant Name</span>
                      <span className="font-semibold text-slate-800">{verificationResult.extractedData.name}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-white border-b border-slate-200">
                      <span className="text-slate-500">Father's Name</span>
                      <span className="text-slate-800">{verificationResult.extractedData.father}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-slate-50 border-b border-slate-200">
                      <span className="text-slate-500">Tribe / Sub-Category</span>
                      <span className="font-semibold text-[#138808]">{verificationResult.extractedData.tribe}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-white border-b border-slate-200">
                      <span className="text-slate-500">Issuing Authority</span>
                      <span className="text-slate-800">{verificationResult.extractedData.authority}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-slate-50 border-b border-slate-200">
                      <span className="text-slate-500">Certificate Number</span>
                      <span className="font-mono text-slate-800">{verificationResult.extractedData.certNo}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-white">
                      <span className="text-slate-500">Issue Date</span>
                      <span className="text-slate-800">{verificationResult.extractedData.issueDate}</span>
                    </div>
                  </div>
                </div>

                {/* NEXT ACTION BUTTON */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    {lang === 'en' ? 'Status: Direct DBT Sanction Ready' : 'स्थिति: डीबीटी स्वीकृति हेतु तैयार'}
                  </span>
                  <button
                    onClick={() => setActiveTab('matchmaker')}
                    className="text-xs font-semibold px-4 py-2 bg-[#002244] text-white rounded-lg hover:bg-[#001730] transition-colors"
                  >
                    {lang === 'en' ? 'Proceed to Scheme Application &rarr;' : 'योजना आवेदन पर जाएं &rarr;'}
                  </button>
                </div>
              </div>
            ) : (
              /* IDLE STATE EXPLANATION CARD */
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {lang === 'en' ? 'Awaiting AI Document OCR Scan' : 'दस्तावेज़ ओसीआर स्कैन प्रतीक्षित'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {lang === 'en'
                    ? 'Click "Run AI OCR Scan" to simulate the 2-second deep learning extraction and view the 98% confidence certificate approval.'
                    : 'प्रमाण पत्र सत्यापन हेतु "एआई ओसीआर चलाएं" पर क्लिक करें।'}
                </p>
                <button
                  type="button"
                  onClick={() => handleStartOCRScan()}
                  className="text-xs font-semibold px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {lang === 'en' ? '⚡ Click to Run 2-Second Demo Scan' : '⚡ डेमो स्कैन तुरंत चलाएं'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPLICATION MODAL */}
      {showApplyModal && appliedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9933]">
                  {appliedScheme.code}
                </span>
                <h3 className="text-base font-bold text-[#002244] mt-0.5">
                  {appliedScheme.name}
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {applicationSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-[#138808] text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-emerald-950">
                  {lang === 'en' ? 'Application Successfully Submitted!' : 'आवेदन सफलतापूर्वक जमा हुआ!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  Application ID: <strong className="font-mono">MOTA-2026-1051</strong> · Aadhaar DBT linked.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <strong className="text-slate-800">Kavita Gond</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Education Degree:</span>
                    <strong className="text-slate-800">{criteria.educationLevel}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Verified ST Certificate:</span>
                    <span className="text-emerald-700 font-semibold">Verified (98% Score)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Stipend:</span>
                    <strong className="text-slate-800">{appliedScheme.benefits.amount}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="w-1/2 py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmApplication}
                    className="w-1/2 py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#002244] text-white hover:bg-[#001730] shadow-xs"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
