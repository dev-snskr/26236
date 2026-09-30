import React, { useState } from 'react';
import { DJANGO_FILES, DjangoFile } from '../data/djangoCode';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ExternalLink,
  FolderTree,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface DjangoCodeViewerProps {
  lang: 'en' | 'hi';
}

export const DjangoCodeViewer: React.FC<DjangoCodeViewerProps> = ({ lang }) => {
  const [selectedFile, setSelectedFile] = useState<DjangoFile>(DJANGO_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: DjangoFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* BANNER */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9933]">
            SIH26239 Official Submission Deliverables
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#002244] mt-0.5">
            Production-Ready Python Django Codebase
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete, self-contained, heavily commented Django files ready to copy or download and run directly with{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">
              python manage.py runserver
            </code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(selectedFile.code)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#002244] text-white rounded-lg text-xs font-semibold hover:bg-[#001730] transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied {selectedFile.filename}!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#FF9933]" />
                <span>Copy Current File</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDownloadFile(selectedFile)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* QUICK TERMINAL RUN COMMANDS */}
      <div className="bg-[#001730] text-slate-200 rounded-xl p-4 sm:p-5 border border-slate-800 font-mono text-xs shadow-inner space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700/60 pb-2">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#FF9933]" />
            Quick Setup & Execution in Terminal:
          </span>
          <span className="text-emerald-400">● Tested on Python 3.10+ / Django 5.x</span>
        </div>
        <div className="space-y-1 text-slate-300">
          <p><span className="text-emerald-400">$</span> mkdir sih26239_portal && cd sih26239_portal</p>
          <p><span className="text-emerald-400">$</span> pip install django</p>
          <p><span className="text-emerald-400">$</span> python manage.py makemigrations && python manage.py migrate</p>
          <p className="text-amber-300"><span className="text-emerald-400">$</span> python manage.py runserver <span className="text-slate-500"># Launches on http://127.0.0.1:8000</span></p>
        </div>
      </div>

      {/* MAIN CODE EXPLORER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FILE LIST SIDEBAR (3 COLS) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
            Project Files ({DJANGO_FILES.length})
          </span>
          {DJANGO_FILES.map((file) => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                onClick={() => {
                  setSelectedFile(file);
                  setCopied(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#002244] text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#FF9933]' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{file.filename}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* CODE VIEWER AREA (9 COLS) */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Header Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#002244]">
                  {selectedFile.path}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedFile.code)}
                className="text-xs px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code text content */}
          <div className="relative">
            <pre className="p-4 bg-[#0B1528] text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-[640px] overflow-y-auto selection:bg-amber-400 selection:text-slate-900">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
