import React from 'react';
import { ScoreMetric } from '../types';

interface ScoringPanelProps {
  metrics: ScoreMetric[];
  totalScore: number;
}

const ScoringPanel: React.FC<ScoringPanelProps> = ({ metrics, totalScore }) => {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBarColor = (score: number, max: number) => {
    const pct = score / max;
    if (pct >= 0.9) return 'bg-emerald-500';
    if (pct >= 0.7) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">AI Compliance Scoring Model</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-center mb-8 relative">
           {/* Ring Chart Simulation */}
           <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
               <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeDasharray={`${totalScore * 2.89} 289`}
                    className={`${totalScore >= 90 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                 />
               </svg>
               <div className="text-center">
                   <div className={`text-4xl font-bold font-mono ${getScoreColor(totalScore)}`}>{totalScore}%</div>
                   <div className="text-xs text-slate-500 font-semibold mt-1">TOTAL SCORE</div>
               </div>
           </div>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{metric.category}</span>
                <span className="text-slate-400 font-mono">{metric.score}/{metric.maxScore}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(metric.score, metric.maxScore)}`} 
                    style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoringPanel;
