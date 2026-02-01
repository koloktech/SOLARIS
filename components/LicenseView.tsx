import React from 'react';
import { ApplicationData, SimulationResult } from '../types';

interface Props {
  appData: ApplicationData;
  result: SimulationResult;
  onReset: () => void;
  onRetry: () => void;
}

const LicenseView: React.FC<Props> = ({ appData, result, onReset, onRetry }) => {
  const missingDocs = appData.documents.filter(d => !d.fileName);

  if (result.status === 'FLAGGED') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950">
           <div className="bg-slate-900 border-2 border-amber-600 w-full max-w-3xl p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                    <div className="bg-amber-900/30 p-3 rounded-full border border-amber-600/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-amber-500 uppercase tracking-wide">Notice of Non-Compliance</h1>
                        <p className="text-slate-400 text-sm">Application Ref: SWK-2024-8892</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Audit Report */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700 pb-2">AI Audit Findings</h3>
                        <div className="bg-black/30 p-4 rounded-lg border border-slate-800 font-mono text-sm text-amber-200/90 leading-relaxed">
                            {result.justification}
                        </div>
                        
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-sm">Compliance Score</span>
                                <span className="text-amber-500 font-bold text-xl">{result.score}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2.5">
                                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${result.score}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Items */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700 pb-2">Action Required</h3>
                        
                        {missingDocs.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 mb-2">Please upload the following missing documents to proceed:</p>
                                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                    {missingDocs.map(doc => (
                                        <li key={doc.id} className="flex items-start gap-2 text-sm text-red-300 bg-red-900/10 p-2 rounded border border-red-900/30">
                                            <span className="mt-0.5 text-red-500">⚠</span>
                                            {doc.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-sm italic">
                                Verification failed due to data inconsistencies. Please review your applicant details.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end border-t border-slate-800 pt-6">
                    <button 
                        onClick={onReset}
                        className="px-6 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        Cancel Application
                    </button>
                    <button 
                        onClick={onRetry}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modify & Resubmit
                    </button>
                </div>
           </div>
        </div>
      );
  }

  // HAPPY PATH (LICENSE)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950">
      <div className="bg-white text-slate-900 w-full max-w-2xl p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
           <span className="text-7xl md:text-9xl font-bold rotate-45">VALID</span>
        </div>

        <div className="border-4 border-slate-900 p-4 md:p-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-slate-900 pb-4 mb-6 gap-4 md:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">Trade License</h1>
                    <p className="text-xs md:text-sm font-serif italic">The Local Authority Ordinance, Sarawak</p>
                </div>
                <div className="self-end md:self-auto text-right">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-white flex items-center justify-center rounded-full font-bold text-lg md:text-2xl">
                        PBT
                    </div>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4 font-mono text-xs md:text-sm">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="text-slate-500">License No:</span>
                    <span className="font-bold">L/2024/{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="text-slate-500">Business Name:</span>
                    <span className="font-bold uppercase break-words">{appData.businessName}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="text-slate-500">Licensee:</span>
                    <span className="font-bold uppercase">{appData.applicantName}</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="text-slate-500">IC No:</span>
                    <span className="font-bold">{appData.icNumber}</span>
                </div>
                 <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="text-slate-500 shrink-0">Premise:</span>
                    <span className="font-bold md:text-right md:w-1/2 break-words">{appData.address}</span>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end">
                <div>
                     <p className="text-[10px] md:text-xs text-slate-500 mb-1">Issued Date: {new Date().toLocaleDateString()}</p>
                     <p className="text-[10px] md:text-xs text-slate-500">Expiry Date: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                    <div className="bg-slate-900 p-2 mb-1">
                        {/* Mock QR */}
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white grid grid-cols-4 grid-rows-4 gap-0.5">
                            {Array.from({length: 16}).map((_,i) => (
                                <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                            ))}
                        </div>
                    </div>
                    <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Digital Valid</span>
                </div>
            </div>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 flex items-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Main Page
      </button>
    </div>
  );
};

export default LicenseView;