export enum AgentStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
  WAITING = 'WAITING',
  ERROR = 'ERROR'
}

export type AgentRole = 
  | 'INTAKE' 
  | 'DOC_CHECK' 
  | 'OCR' 
  | 'OWNERSHIP' 
  | 'SAFETY' 
  | 'VILLAGE' 
  | 'BUSINESS' 
  | 'SCORING' 
  | 'DECISION' 
  | 'AUDIT';

export interface Agent {
  id: AgentRole;
  name: string;
  description: string;
  status: AgentStatus;
  currentTask?: string;
  icon: string; // Emoji or icon class
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: AgentRole;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'thinking';
}

export interface DocumentItem {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  confidence: number;
  notes: string;
  fileName?: string;
}

export interface ScoreMetric {
  category: string;
  score: number;
  maxScore: number;
  weight: number; // Percentage (0-100)
}

export interface ApplicationData {
  businessName: string;
  applicantName: string;
  icNumber: string;
  address: string;
  type: 'Individual' | 'Company';
  isVillageShop: boolean;
  documents: DocumentItem[];
}

export interface AgentSimulationStep {
  agentId: AgentRole;
  action: string;
  duration: number; // ms
  logs: string[];
  output?: any;
}

export interface SimulationResult {
  score: number;
  justification: string;
  status: 'APPROVED' | 'FLAGGED';
}