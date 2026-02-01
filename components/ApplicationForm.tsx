import React, { useState, useEffect, useRef } from 'react';
import { ApplicationData } from '../types';
import { DOCS_COMMON, DOCS_VILLAGE, DOCS_COMPANY, DEFAULT_MOCK_APP } from '../constants';

interface Props {
  onStart: (data: ApplicationData) => void;
  onBack: () => void;
}

const ApplicationForm: React.FC<Props> = ({ onStart, onBack }) => {
  const [formData, setFormData] = useState<ApplicationData>({
    ...DEFAULT_MOCK_APP,
    documents: [] // Initialized in useEffect
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  // Dynamic Document List Logic
  useEffect(() => {
    let docs = [...DOCS_COMMON];

    if (formData.isVillageShop) {
      docs = [...docs, ...DOCS_VILLAGE];
    }

    if (formData.type === 'Company') {
      docs = [...docs, ...DOCS_COMPANY];
    }

    // Preserve existing uploads if type switches
    setFormData(prev => {
        const newDocs = docs.map(d => {
            const existing = prev.documents.find(pd => pd.id === d.id);
            return existing ? existing : d;
        });
        return { ...prev, documents: newDocs };
    });
  }, [formData.type, formData.isVillageShop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
        onStart(formData);
    }, 1000);
  };

  const handleDownloadForms = () => {
    const DOWNLOAD_LINK = "https://dbku.sarawak.gov.my/page-0-290-354-License-Permit.html"; 
    window.open(DOWNLOAD_LINK, '_blank');
  };

  const handleDocClick = (id: string) => {
    setActiveDocId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeDocId) {
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.map(doc => 
          doc.id === activeDocId 
            ? { ...doc, fileName: file.name } 
            : doc
        )
      }));
    }
    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-2xl">
        <div className="mb-8 border-b border-slate-800 pb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">New Trade License Application</h2>
            <p className="text-slate-400 text-sm md:text-base">Sarawak Local Authority (PBT) - Digital Counter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Applicant Type Selection */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
               <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4">Application Category</h3>
               <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex items-center gap-4">
                       <label className="text-slate-300 text-sm font-medium">Type:</label>
                       <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-lg border border-slate-700">
                           <button
                             type="button"
                             onClick={() => setFormData({...formData, type: 'Individual'})}
                             className={`px-4 py-1.5 rounded-md text-sm transition-all ${formData.type === 'Individual' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                           >
                             Individual
                           </button>
                           <button
                             type="button"
                             onClick={() => setFormData({...formData, type: 'Company'})}
                             className={`px-4 py-1.5 rounded-md text-sm transition-all ${formData.type === 'Company' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                           >
                             Company
                           </button>
                       </div>
                   </div>

                   <div className="flex items-center gap-3">
                       <div className="flex items-center h-5">
                         <input
                           id="village_shop"
                           type="checkbox"
                           checked={formData.isVillageShop}
                           onChange={(e) => setFormData({...formData, isVillageShop: e.target.checked})}
                           className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                         />
                       </div>
                       <label htmlFor="village_shop" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                           Is this a <span className="text-emerald-400 font-bold">Village Shop</span> application?
                       </label>
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Business Name/Nama Premis <span className="text-red-500">*</span></label>
                    <input 
                        required
                        type="text" 
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                        placeholder="e.g. Kenyalang Cafe"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Applicant Name/Nama Pemohon <span className="text-red-500">*</span></label>
                    <input 
                        required
                        type="text" 
                        value={formData.applicantName}
                        onChange={e => setFormData({...formData, applicantName: e.target.value})}
                        placeholder="Full Name as per MyKad/Nama Penuh"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">IC Number (MyKad) <span className="text-red-500">*</span></label>
                    <input 
                        required
                        type="text" 
                        value={formData.icNumber}
                        onChange={e => setFormData({...formData, icNumber: e.target.value})}
                        placeholder="e.g. 850212-13-xxxx"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Premise Address/Alamat Premis <span className="text-red-500">*</span></label>
                    <input 
                        required
                        type="text" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="eg.No 8888,Jalan Banhock"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
                    />
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700/50 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 md:gap-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Required Documents</h3>
                        <span className="bg-cyan-900/50 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-800">
                           {formData.documents.length} Items
                        </span>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={handleDownloadForms}
                        className="flex items-center gap-2 text-xs md:text-sm text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/30 px-3 py-1.5 rounded-full border border-cyan-800 hover:border-cyan-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Forms & Templates
                    </button>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,application/pdf"
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.documents.map((doc) => (
                        <div 
                            key={doc.id} 
                            onClick={() => handleDocClick(doc.id)}
                            className={`relative group cursor-pointer border rounded-lg p-2 md:p-4 flex flex-col items-center justify-center transition-all h-28 md:h-32 text-center ${doc.fileName ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-dashed border-slate-600 hover:bg-slate-800'}`}
                        >
                            <span className={`text-xl md:text-2xl mb-2 transition-colors ${doc.fileName ? 'text-emerald-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                                {doc.fileName ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                )}
                            </span>
                            <span className={`text-[10px] md:text-xs leading-tight ${doc.fileName ? 'text-emerald-200' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                                {doc.fileName ? (
                                    <span className="break-all line-clamp-2">{doc.fileName}</span>
                                ) : (
                                    doc.name
                                )}
                            </span>
                            {!doc.fileName && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">* Click to upload files (Simulator does not store data)</p>
            </div>

            <div className="flex justify-end pt-6">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Initializing Agents...' : 'Submit Application'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;