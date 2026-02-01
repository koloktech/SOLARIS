import React, { useState, useEffect, useRef } from 'react';
import { Agent, AgentRole, AgentStatus, ApplicationData, LogEntry, ScoreMetric, SimulationResult } from '../types';
import { AGENTS, SIMULATION_STEPS } from '../constants';
import AgentCard from './AgentCard';
import AgentLogFeed from './AgentLogFeed';
import ScoringPanel from './ScoringPanel';
import { generateAgentThought, generateFinalJustification } from '../services/geminiService';

interface Props {
  appData: ApplicationData;
  onComplete: (result: SimulationResult) => void;
}

const ControlRoom: React.FC<Props> = ({ appData, onComplete }) => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [scoreMetrics, setScoreMetrics] = useState<ScoreMetric[]>([
    { category: 'Identity & Applicant', score: 0, maxScore: 15, weight: 15 },
    { category: 'Document Completeness', score: 0, maxScore: 25, weight: 25 },
    { category: 'Premise Safety (Bomba)', score: 0, maxScore: 20, weight: 20 },
    { category: 'Ownership/Tenancy', score: 0, maxScore: 10, weight: 10 },
    { category: 'Business Reg.', score: 0, maxScore: 10, weight: 10 },
    { category: 'Risk Assessment', score: 0, maxScore: 20, weight: 20 },
  ]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalJustification, setFinalJustification] = useState<string>("");

  const totalScore = scoreMetrics.reduce((acc, curr) => acc + curr.score, 0);
  const hasStartedRef = useRef(false);

  // Helper to add log
  const addLog = (agentId: AgentRole, message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      agentId,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Helper to update specific agent
  const updateAgent = (id: AgentRole, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  // Update Score Helper
  const incrementScore = (categoryIndex: number, amount: number, limit?: number) => {
    setScoreMetrics(prev => {
        const next = [...prev];
        const current = next[categoryIndex];
        // If a limit is provided (e.g. actual calculated score), use it. Otherwise use maxScore.
        const targetLimit = limit !== undefined ? limit : current.maxScore;
        
        if (current.score < targetLimit) {
            current.score = Math.min(targetLimit, current.score + amount);
        }
        return next;
    });
  };

  // Simulation Loop
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Calculate Actual Document Completeness Score
    const totalDocs = appData.documents.length;
    const uploadedDocs = appData.documents.filter(d => d.fileName).length;
    // Calculate score out of 25. 
    // Example: 2/10 docs = 0.2 * 25 = 5 points.
    const calculatedDocScore = totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 25) : 25;

    // Filter and Modify Steps based on Application Data
    const customizedSteps = SIMULATION_STEPS.map(step => {
        let processedStep: typeof step & { isSkipped?: boolean } = { ...step };

        // --- DYNAMIC DATA INJECTION ---

        // 1. INTAKE AGENT: Show validation of Applicant Name, Business Name, and Address
        if (step.agent === 'INTAKE' && step.action === 'Parsing metadata...') {
            processedStep.action = 'Validating Entity Data...';
            processedStep.log = `Verified Applicant: ${appData.applicantName}. Validating Business Name: '${appData.businessName}'... Address: ${appData.address.substring(0, 30)}${appData.address.length > 30 ? '...' : ''}.`;
        }

        // 2. OCR AGENT: Show Extracted IC
        if (step.agent === 'OCR' && step.action === 'Reading MyKad...') {
            processedStep.log = `Extracted IC: ${appData.icNumber}. Biometric verification with applicant '${appData.applicantName}' - MATCH.`;
        }
        
        // 3. BUSINESS AGENT: Show detailed business name check (if it runs)
        if (step.agent === 'BUSINESS' && step.action === 'Checking Business Names...') {
             processedStep.log = `SSM Registry Query: '${appData.businessName}' - FOUND & COMPLIANT.`;
        }

        // --- SKIP LOGIC ---

        // Logic: If NOT Village Shop, modify Village Agent step to be "not used"
        if (processedStep.agent === 'VILLAGE' && !appData.isVillageShop) {
            processedStep = { 
                ...processedStep, 
                action: 'Not Village Shop - Skipped', 
                log: 'Village Agent check not required for standard commercial premise.', 
                duration: 500,
                isSkipped: true
            };
        }
        // Logic: If NOT Company (i.e. Individual), modify Business Agent step
        if (processedStep.agent === 'BUSINESS' && appData.type === 'Individual') {
             processedStep = { 
                ...processedStep, 
                action: 'Individual Applicant - Skipped', 
                log: 'Business Name Ordinance checks not required for Individual (Name verified in Intake).', 
                duration: 500,
                isSkipped: true
            };
        }
        return processedStep;
    });

    let currentStep = 0;

    const executeStep = async () => {
      if (currentStep >= customizedSteps.length) {
        setIsFinished(true);
        // Calculate the FINAL total score to pass to the generator
        // Base is 100. We deduct the missing document points.
        // Missing points = 25 - calculatedDocScore.
        const finalScore = 100 - (25 - calculatedDocScore);

        const justification = await generateFinalJustification(appData, finalScore);
        setFinalJustification(justification);
        
        const statusMsg = finalScore >= 80 ? 'License Generation Complete.' : 'Application Flagged for Review.';
        const statusType = finalScore >= 80 ? 'success' : 'warning';
        
        addLog('AUDIT', statusMsg, statusType);
        updateAgent('AUDIT', { status: AgentStatus.COMPLETED, currentTask: undefined });
        return;
      }

      const step = customizedSteps[currentStep];
      setStepIndex(currentStep);

      // Set Agent to Working (unless skipped)
      if (step.isSkipped) {
         updateAgent(step.agent as AgentRole, { status: AgentStatus.IDLE, currentTask: step.action });
         addLog(step.agent as AgentRole, step.action, 'warning');
         // Auto-give points for skipped categories to ensure high score
         if (step.agent === 'BUSINESS') incrementScore(4, 10); 
      } else {
         updateAgent(step.agent as AgentRole, { status: AgentStatus.WORKING, currentTask: step.action });
         
         // Generate dynamic thought (Parallel to UI update)
         const thoughtPromise = generateAgentThought(step.agent as AgentRole, step.action, appData);
         
         // Update Scores gradually based on agent type
         if (step.agent === 'INTAKE') incrementScore(0, 5);
         
         if (step.agent === 'DOC_CHECK') {
             // For document check, increment up to the calculated limit.
             // We give a chunk here, e.g., 10 points, but capped at calculatedDocScore.
             incrementScore(1, 10, calculatedDocScore);
         }

         if (step.agent === 'OCR') incrementScore(0, 10);
         if (step.agent === 'SAFETY') incrementScore(2, 20);
         if (step.agent === 'OWNERSHIP') incrementScore(3, 10);
         if (step.agent === 'BUSINESS') incrementScore(4, 10);
         
         if (step.agent === 'SCORING') {
            // Finalize Document Completeness score during aggregation
            // This adds the remaining points up to calculatedDocScore
            incrementScore(1, 15, calculatedDocScore);
         }
         
         if (step.agent === 'DECISION') incrementScore(5, 20);

         // Wait for duration or promise (whichever is longer, to keep pacing)
         const [thought] = await Promise.all([
            thoughtPromise,
            new Promise(resolve => setTimeout(resolve, step.duration))
         ]);

         addLog(step.agent as AgentRole, thought, 'thinking');
         addLog(step.agent as AgentRole, step.log, 'success');
      }

      // Set Agent to Idle/Completed
      updateAgent(step.agent as AgentRole, { status: AgentStatus.COMPLETED, currentTask: undefined });

      currentStep++;
      executeStep();
    };

    executeStep();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = () => {
    onComplete({
        score: totalScore,
        justification: finalJustification,
        status: totalScore >= 80 ? 'APPROVED' : 'FLAGGED'
    });
  };

  return (
    <div className="flex flex-col bg-slate-950 p-2 md:p-4 gap-4 lg:h-screen lg:overflow-hidden min-h-screen">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-4 rounded-xl border border-slate-800 gap-4 md:gap-0 shrink-0">
        <div>
           <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-500">⚛</span> Agentic Workflow Engine <span className="bg-cyan-900 text-cyan-200 text-xs px-2 py-0.5 rounded ml-2">LIVE DEMO</span>
           </h1>
           <p className="text-xs text-slate-400">Processing: {appData.businessName} (Ref: SWK-2024-8892)</p>
        </div>
        
        {isFinished ? (
           <button 
             onClick={handleFinish} 
             className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6 py-2 rounded-lg font-bold transition w-full md:w-auto animate-pulse flex items-center justify-center gap-2"
           >
             <span>{totalScore >= 80 ? 'View License' : 'View Audit Findings'}</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
           </button>
        ) : (
           <div className="flex items-center gap-3">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             <span className="text-emerald-500 font-mono text-sm animate-pulse">SYSTEM ACTIVE</span>
           </div>
        )}
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 lg:min-h-0">
        
        {/* Left: Agents Grid */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 order-2 lg:order-1 lg:h-full lg:overflow-hidden">
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 hidden lg:block">Active Agents</div>
           <div className="flex-1 space-y-3 pr-2 custom-scrollbar overflow-y-auto max-h-60 lg:max-h-none">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
           </div>
        </div>

        {/* Center: Activity & Timeline */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2 lg:h-full lg:overflow-hidden">
           {/* LogFeed - Flexible height */}
           <div className="flex-1 min-h-[16rem] lg:min-h-0 relative rounded-xl overflow-hidden">
             <AgentLogFeed logs={logs} />
           </div>
           
           {/* Active Thought / Current Action - Fixed Height */}
           <div className="h-28 lg:h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-center items-center text-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              {isFinished ? (
                 <div className="z-10 animate-fade-in-up">
                    <h2 className={`text-2xl font-bold mb-1 ${totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {totalScore >= 80 ? 'READY FOR SUBMISSION' : 'REVIEW REQUIRED'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {totalScore >= 80 ? 'All compliance checks passed. Verified.' : 'Documents missing or verification incomplete.'}
                    </p>
                 </div>
              ) : (
                <div className="z-10">
                   <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-2">Current System Focus</h3>
                   <p className="text-xl text-cyan-400 font-mono">
                      {agents.find(a => a.status === AgentStatus.WORKING)?.currentTask || "System Idle"}
                   </p>
                </div>
              )}
           </div>
        </div>

        {/* Right: Scoring & Justification */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 order-3 lg:h-full lg:overflow-hidden">
           <div className="flex-1 min-h-[16rem] lg:min-h-0 overflow-hidden">
             <ScoringPanel metrics={scoreMetrics} totalScore={totalScore} />
           </div>
           
           {/* Justification Box - Fixed/Shrinkable height */}
           <div className="h-auto min-h-[10rem] lg:h-1/3 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col shrink-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Audit Agent Justification</h3>
              <div className="flex-1 bg-slate-950 rounded p-3 text-sm text-slate-300 font-mono overflow-y-auto border border-slate-800 custom-scrollbar">
                 {isFinished ? (
                    <span className={`typing-effect ${totalScore >= 80 ? 'text-emerald-300' : 'text-amber-300'}`}>{finalJustification}</span>
                 ) : (
                    <span className="text-slate-600 italic">Analysis in progress...</span>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ControlRoom;