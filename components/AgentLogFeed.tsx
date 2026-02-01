import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface AgentLogFeedProps {
  logs: LogEntry[];
}

const AgentLogFeed: React.FC<AgentLogFeedProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'thinking': return 'text-cyan-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-full font-mono text-xs flex flex-col shadow-inner">
       <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
            <span className="text-slate-500 uppercase font-bold tracking-widest">System Event Stream</span>
            <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
       </div>
       
       <div className="flex-1 overflow-y-auto space-y-2 pr-2">
           {logs.length === 0 && (
               <div className="text-slate-600 italic text-center mt-10">Waiting for agent activity...</div>
           )}
           {logs.map((log) => (
               <div key={log.id} className="flex space-x-2 animate-fadeIn">
                   <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                   <span className="text-purple-400 font-bold shrink-0 w-24 truncate">@{log.agentId}</span>
                   <span className={`break-words ${getTypeColor(log.type)}`}>
                       {log.type === 'thinking' && <span className="animate-pulse">❯ </span>}
                       {log.message}
                   </span>
               </div>
           ))}
           <div ref={bottomRef} />
       </div>
    </div>
  );
};

export default AgentLogFeed;
