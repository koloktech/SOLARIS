import React from 'react';
import { Agent, AgentStatus } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.WORKING: return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-slate-800';
      case AgentStatus.COMPLETED: return 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] bg-slate-800/50';
      case AgentStatus.THINKING: return 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-slate-800';
      case AgentStatus.ERROR: return 'border-red-500 bg-red-900/20';
      default: return 'border-slate-700 opacity-70 bg-slate-900';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    if (status === AgentStatus.WORKING || status === AgentStatus.THINKING) return <span className="animate-spin">⚙️</span>;
    if (status === AgentStatus.COMPLETED) return '✅';
    if (status === AgentStatus.ERROR) return '❌';
    return '💤';
  };

  return (
    <div className={`relative p-3 rounded-lg border transition-all duration-300 ${getStatusColor(agent.status)}`}>
      {(agent.status === AgentStatus.WORKING || agent.status === AgentStatus.THINKING) && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
      )}
      
      <div className="flex items-start space-x-3">
        <div className="text-3xl bg-slate-950 p-2 rounded-md border border-slate-700">
            {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-slate-100 truncate">{agent.name}</h3>
                <span className="text-xs">{getStatusIcon(agent.status)}</span>
            </div>
            <p className="text-xs text-slate-400 truncate">{agent.description}</p>
            
            {agent.currentTask && (agent.status === AgentStatus.WORKING || agent.status === AgentStatus.THINKING) && (
                <div className="mt-2 text-xs font-mono text-cyan-400 animate-pulse">
                   &gt; {agent.currentTask}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
