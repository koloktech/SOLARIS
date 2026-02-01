import React, { useState } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ControlRoom from './components/ControlRoom';
import LicenseView from './components/LicenseView';
import { ApplicationData, SimulationResult } from './types';

enum AppStep {
  LANDING = 0,
  FORM = 1,
  SIMULATION = 2,
  RESULT = 3
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [appData, setAppData] = useState<ApplicationData | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const startDemo = () => setStep(AppStep.FORM);
  
  const handleFormSubmit = (data: ApplicationData) => {
    setAppData(data);
    setStep(AppStep.SIMULATION);
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    setSimResult(result);
    setStep(AppStep.RESULT);
  };

  const handleRetry = () => {
    // Go back to form, keeping data
    setStep(AppStep.FORM);
  };

  const handleReset = () => {
    setStep(AppStep.LANDING);
    setAppData(null);
    setSimResult(null);
  };
  
  // Render Landing Page inline for simplicity
  if (step === AppStep.LANDING) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-100 bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="z-10 max-w-5xl space-y-8 animate-fade-in-up">
            <div className="inline-block px-3 py-1 bg-cyan-900/50 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono mb-4">
                SARAWAK DIGITAL GOV INITIATIVE
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
                <span className="animate-solar-shine inline-block py-2">S.O.L.A.R.I.S.</span>
                <span className="text-xl md:text-3xl text-slate-300 block mt-6 font-light tracking-wide max-w-4xl mx-auto leading-tight">
                    Sarawak Online Licensing Agentic Regulatory Integration System
                </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed pt-4">
                The official next-generation digital gateway for Sarawak business licensing. 
                Experience seamless, automated trade license processing powered by state-of-the-art autonomous AI agents.
            </p>
            
            <div className="pt-10">
                <button 
                    onClick={startDemo}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-cyan-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:bg-cyan-500 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                    Start New Application
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    <div className="absolute -inset-3 rounded-xl bg-cyan-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                </button>
            </div>
        </div>

        <footer className="absolute bottom-6 flex flex-col items-center gap-2 z-10">
            <div className="text-slate-500 text-xs tracking-widest uppercase font-semibold">
                Powered by Sains • Lead The Change
            </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative">
      {step === AppStep.FORM && <ApplicationForm onStart={handleFormSubmit} onBack={handleReset} />}
      {step === AppStep.SIMULATION && appData && <ControlRoom appData={appData} onComplete={handleSimulationComplete} />}
      {step === AppStep.RESULT && appData && simResult && <LicenseView result={simResult} appData={appData} onRetry={handleRetry} onReset={handleReset} />}
    </div>
  );
};

export default App;