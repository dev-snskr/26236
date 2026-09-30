import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Building, 
  Download, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

interface AdminDashboardProps {
  lang: 'en' | 'hi';
}

interface ApplicationRow {
  id: string;
  name: string;
  tribe: string;
  category: 'ST' | 'PVTG';
  scheme: string;
  ocrConfidence: number;
  aiStatus: 'Approved' | 'Flagged' | 'Expedited';
  dropRisk: number; // 0-100%
  state: string;
  disbursal: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'ST' | 'PVTG'>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRow | null>(null);

  // Applications table data
  const sampleApplications: ApplicationRow[] = [
    {
      id: 'MOTA-2026-1049',
      name: 'Kavita Gond',
      tribe: 'Gond',
      category: 'ST',
      scheme: 'NFST (National Fellowship)',
      ocrConfidence: 98.4,
      aiStatus: 'Approved',
      dropRisk: 4.2,
      state: 'Madhya Pradesh',
      disbursal: '₹37,000 / mo (Ready)',
    },
    {
      id: 'MOTA-2026-1048',
      name: 'Birsa Soren',
      tribe: 'Santhal',
      category: 'ST',
      scheme: 'NOS (National Overseas)',
      ocrConfidence: 96.8,
      aiStatus: 'Approved',
      dropRisk: 6.5,
      state: 'Jharkhand',
      disbursal: 'Full Tuition + $15.4k',
    },
    {
      id: 'MOTA-2026-1047',
      name: 'Mangal Baiga',
      tribe: 'Baiga',
      category: 'PVTG',
      scheme: 'PM-JANMAN PVTG Grant',
      ocrConfidence: 99.1,
      aiStatus: 'Expedited',
      dropRisk: 3.1,
      state: 'Chhattisgarh',
      disbursal: '₹40,000 / mo (Sanctioned)',
    },
    {
      id: 'MOTA-2026-1046',
      name: 'Lalitha Chenchu',
      tribe: 'Chenchu',
      category: 'PVTG',
      scheme: 'Top Class Education (IIT Bombay)',
      ocrConfidence: 97.5,
      aiStatus: 'Expedited',
      dropRisk: 5.0,
      state: 'Andhra Pradesh',
      disbursal: '100% Fee + Laptop Grant',
    },
    {
      id: 'MOTA-2026-1045',
      name: 'Somu Rathwa',
      tribe: 'Rathwa',
      category: 'ST',
      scheme: 'Post-Matric ST Scheme',
      ocrConfidence: 89.2,
      aiStatus: 'Flagged',
      dropRisk: 42.8,
      state: 'Gujarat',
      disbursal: 'Awaiting Income Re-sync',
    },
  ];

  const filteredApps = sampleApplications.filter(app => {
    if (filterCategory === 'ALL') return true;
    return app.category === filterCategory;
  });

  // 1. Chart.js Donut Data: Fund Utilization by Scheme
  const donutData = {
    labels: [
      'National Fellowship (NFST)',
      'National Overseas (NOS)',
      'Top Class Education Scheme',
      'Post-Matric ST Scheme',
      'PM-JANMAN PVTG Special Fund',
    ],
    datasets: [
      {
        data: [142.5, 68.0, 94.2, 310.8, 45.0],
        backgroundColor: [
          '#002244', // Gov Navy
          '#FF9933', // Saffron
          '#138808', // Earthy Green
          '#0284C7', // Sky Blue
          '#7C3AED', // Purple (PVTG)
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 14,
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ₹${context.raw} Crores utilized`,
        },
      },
    },
    cutout: '68%',
  };

  // 2. Chart.js Line Data: AI Predicted Application Drop-offs
  const lineData = {
    labels: [
      '1. Registration',
      '2. Document Upload',
      '3. AI OCR Scan',
      '4. Nodal Verify',
      '5. Sanction',
      '6. Disbursal',
    ],
    datasets: [
      {
        label: 'Historical Baseline (Before AI)',
        data: [100000, 81000, 68000, 52000, 48000, 47200],
        borderColor: '#94A3B8',
        backgroundColor: 'rgba(148, 163, 184, 0.12)',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
      },
      {
        label: 'AI-Enabled Proactive Intervention',
        data: [100000, 94000, 91500, 88200, 86000, 85400],
        borderColor: '#138808',
        backgroundColor: 'rgba(19, 136, 8, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: '#138808',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} students`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Active Retained Applications',
          font: { size: 10, weight: 'bold' as const },
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* SECTION BANNER */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#002244]">
            {lang === 'en' ? 'Ministry of Tribal Affairs · National Portal' : 'जनजातीय कार्य मंत्रालय · राष्ट्रीय पोर्टल'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#002244] mt-0.5">
            {lang === 'en' ? 'AI Predictive Analytics & Command Dashboard' : 'एआई पूर्वानुमानात्मक विश्लेषण एवं कमान डैशबोर्ड'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'en'
              ? 'Real-time telemetry on ST student enrollment, AI document auto-verification confidence, and drop-off mitigations.'
              : 'एसटी छात्र नामांकन, एआई दस्तावेज़ सत्यापन विश्वसनीयता एवं ड्रॉप-ऑफ रोकथाम की निगरानी।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {lang === 'en' ? 'Live Telemetry Stream Active' : 'लाइव टेलीमेट्री सक्रिय'}
          </span>
        </div>
      </div>

      {/* TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {lang === 'en' ? 'Total ST Applicants' : 'कुल एसटी आवेदक'}
          </span>
          <p className="text-2xl font-bold text-[#002244] mt-1 tabular-nums">124,850</p>
          <div className="flex items-center gap-1 text-xs text-[#138808] font-medium mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% YoY under PM-JANMAN</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {lang === 'en' ? 'AI Auto-Verified Rate' : 'एआई ऑटो-सत्यापन दर'}
          </span>
          <p className="text-2xl font-bold text-[#138808] mt-1 tabular-nums">94.2%</p>
          <p className="text-xs text-slate-500 mt-1">
            Avg speed: <strong className="text-slate-700">2.1s</strong> per certificate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {lang === 'en' ? 'DBT Disbursed (FY 2025-26)' : 'डीबीटी संवितरित (FY 2025-26)'}
          </span>
          <p className="text-2xl font-bold text-[#002244] mt-1 tabular-nums">₹660.5 Cr</p>
          <p className="text-xs text-slate-500 mt-1">
            Aadhaar direct bank accounts
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {lang === 'en' ? 'AI Prevented Drop-offs' : 'एआई द्वारा रोके गए ड्रॉप-ऑफ'}
          </span>
          <p className="text-2xl font-bold text-[#FF9933] mt-1 tabular-nums">38,200</p>
          <p className="text-xs text-slate-500 mt-1">
            Proactive WhatsApp & CSC nudges
          </p>
        </div>
      </div>

      {/* CHARTS ROW: DONUT & LINE CHARTS (SIH REQUIREMENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DONUT CHART: FUND UTILIZATION BY SCHEME (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002244]">
              {lang === 'en' ? 'Budget Outlay' : 'बजट व्यय'}
            </span>
            <h3 className="text-base font-bold text-[#002244]">
              {lang === 'en' ? 'Fund Utilization by Scheme' : 'योजनावार फंड उपयोग'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'en'
                ? 'Total ₹660.5 Crores allocated across 5 priority tribal schemes.'
                : 'पांच प्रमुख योजनाओं में ₹660.5 करोड़ का आबंटन।'}
            </p>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-2 min-h-[300px]">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>

        {/* LINE CHART: AI PREDICTED APPLICATION DROP-OFFS (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9933]">
                {lang === 'en' ? 'Predictive Funnel Retention' : 'पूर्वानुमानात्मक प्रतिधारण'}
              </span>
              <h3 className="text-base font-bold text-[#002244]">
                {lang === 'en' ? 'AI Predicted Application Drop-offs' : 'एआई अनुमानित आवेदन ड्रॉप-ऑफ तुलना'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en'
                  ? 'Historical baseline drop-off vs. proactive AI automated intervention.'
                  : 'ऐतिहासिक ड्रॉप-ऑफ दर बनाम एआई हस्तक्षेप के बाद प्रतिधारण।'}
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded font-mono">
              Model AUC: 0.93
            </span>
          </div>

          <div className="relative flex-1 p-2 min-h-[300px]">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* AI BOTTLENECK DETECTIONS & MITIGATION NUDGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-950">
              {lang === 'en'
                ? 'Predictive Alert: Mayurbhanj District, Odisha (Santhal ST Cluster)'
                : 'पूर्वानुमान चेतावनी: मयूरभंज जिला, ओडिशा'}
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              {lang === 'en'
                ? 'AI detected a 14% document upload drop-off due to regional broadband intermittency. Automated SMS-based document upload link dispatched to 1,240 applicants.'
                : 'इंटरनेट की कमी के कारण 14% ड्रॉप-ऑफ का अनुमान। 1,240 आवेदकों को वैकल्पिक एसएमएस लिंक प्रेषित।'}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-[#138808] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-950">
              {lang === 'en'
                ? 'PM-JANMAN Accelerated Lane: Baiga & Birhor PVTG Group'
                : 'पीएम-जनमन त्वरित लेन: बैगा एवं बिरहोर पीवीटीजी'}
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {lang === 'en'
                ? 'Single-window Aadhaar biometric bypass auto-verified 580 PVTG candidates in Bastar & Dindori with zero paper rejections.'
                : 'बस्तर एवं डिंडोरी में 580 पीवीटीजी उम्मीदवारों का बिना किसी कागजी अड़चन के एकल-खिड़की सत्यापन।'}
            </p>
          </div>
        </div>
      </div>

      {/* REAL-TIME APPLICATIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#002244]">
              {lang === 'en' ? 'Live Application Stream & AI Audit Trail' : 'लाइव आवेदन एवं एआई ऑडिट ट्रेल'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en'
                ? 'Instant visibility into neural OCR confidence, tamper detection, and PFMS disbursal.'
                : 'न्यूरल ओसीआर विश्वास स्कोर, छेड़छाड़ परीक्षण एवं पीएफएमएस संवितरण का विवरण।'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterCategory('ALL')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All (5)
              </button>
              <button
                onClick={() => setFilterCategory('ST')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'ST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                ST Only
              </button>
              <button
                onClick={() => setFilterCategory('PVTG')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'PVTG' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                PVTG Priority
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Candidate & Tribe</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">OCR Confidence</th>
                <th className="py-3 px-4">AI Verification</th>
                <th className="py-3 px-4">Drop-off Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#002244]">
                    {app.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{app.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {app.tribe} · {app.state}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {app.scheme}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#138808]">
                    {app.ocrConfidence}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        app.aiStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.aiStatus === 'Expedited'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.aiStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono">
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            app.dropRisk > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, app.dropRisk * 2)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] text-slate-600">{app.dropRisk}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-xs text-[#002244] font-semibold hover:underline"
                    >
                      Audit Details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION AUDIT DETAIL MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedApplication.id}
                </span>
                <h3 className="text-base font-bold text-[#002244]">
                  {selectedApplication.name} ({selectedApplication.tribe})
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">AI OCR Verification Telemetry:</span>
                <p className="mt-1">
                  Confidence Score: <strong className="font-mono">{selectedApplication.ocrConfidence}%</strong>.
                  Ashoka emblem seal matched. Tehsildar DSC cryptographic signature validated against State Gazette.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sub-Category:</span>
                  <span className="font-semibold text-slate-800">{selectedApplication.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applied Scheme:</span>
                  <span className="font-semibold text-slate-800">{selectedApplication.scheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State of Domicile:</span>
                  <span className="text-slate-800">{selectedApplication.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DBT Sanction:</span>
                  <span className="font-semibold text-[#138808]">{selectedApplication.disbursal}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-full py-2 bg-[#002244] text-white text-xs font-semibold rounded-lg hover:bg-[#001730]"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
