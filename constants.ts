import { Agent, AgentRole, AgentStatus, DocumentItem } from './types';

export const AGENTS: Agent[] = [
  { id: 'INTAKE', name: 'Intake Agent', description: 'Orchestrates data collection', status: AgentStatus.IDLE, icon: '📥' },
  { id: 'DOC_CHECK', name: 'Checklist Agent', description: 'Verifies mandatory docs', status: AgentStatus.IDLE, icon: '📋' },
  { id: 'OCR', name: 'OCR & Evidence', description: 'Extracts data from images', status: AgentStatus.IDLE, icon: '🔍' },
  { id: 'OWNERSHIP', name: 'Ownership Agent', description: 'Verifies tenancy/land', status: AgentStatus.IDLE, icon: '🏠' },
  { id: 'SAFETY', name: 'Safety Agent', description: 'Checks Bomba/Premise', status: AgentStatus.IDLE, icon: '🚒' },
  { id: 'VILLAGE', name: 'Village Agent', description: 'District office rules', status: AgentStatus.IDLE, icon: '🏘️' },
  { id: 'BUSINESS', name: 'Registration Agent', description: 'Checks SSM/Form 9', status: AgentStatus.IDLE, icon: '💼' },
  { id: 'SCORING', name: 'Scoring Agent', description: 'Calculates compliance', status: AgentStatus.IDLE, icon: '⚖️' },
  { id: 'DECISION', name: 'Decision Agent', description: 'Final approval logic', status: AgentStatus.IDLE, icon: '🧑‍⚖️' },
  { id: 'AUDIT', name: 'Audit Agent', description: 'Generates explainability', status: AgentStatus.IDLE, icon: '📝' },
];

// --- DOCUMENT DEFINITIONS ---

export const DOCS_COMMON: DocumentItem[] = [
  { id: 'c1', name: 'Application Form (Complete)', status: 'pending', confidence: 0, notes: '' },
  { id: 'c2', name: '2 Passport Sized Photos', status: 'pending', confidence: 0, notes: '' },
  { id: 'c3', name: 'Copy of Identity Card (MyKad)', status: 'pending', confidence: 0, notes: '' },
  { id: 'c4', name: 'Location Plan', status: 'pending', confidence: 0, notes: '' },
  { id: 'c5', name: 'Sketch Plan (Layout & Floor)', status: 'pending', confidence: 0, notes: '' },
  { id: 'c6', name: 'Occupational Permit (OP) / Approval Letter', status: 'pending', confidence: 0, notes: '' },
  { id: 'c7', name: 'Proof of Ownership / Tenancy Agreement', status: 'pending', confidence: 0, notes: '' },
  { id: 'c8', name: 'Premise Photos (Inside/Outside 3R)', status: 'pending', confidence: 0, notes: '' },
  { id: 'c9', name: 'Signboard Installation Permit', status: 'pending', confidence: 0, notes: '' },
  { id: 'c10', name: 'Bomba Confirmation Letter (Gas Users)', status: 'pending', confidence: 0, notes: '' },
];

export const DOCS_VILLAGE: DocumentItem[] = [
  { id: 'v1', name: 'Support Letter (Kuching District Office)', status: 'pending', confidence: 0, notes: '' },
  { id: 'v2', name: 'Latest Assessment Bill', status: 'pending', confidence: 0, notes: '' },
  { id: 'v3', name: 'Consent Letter (Village Head)', status: 'pending', confidence: 0, notes: '' },
  { id: 'v4', name: 'Consent Letter (Land Owner)', status: 'pending', confidence: 0, notes: '' },
  { id: 'v5', name: 'Birth/Marriage Cert (Family Land Owner)', status: 'pending', confidence: 0, notes: '' },
];

export const DOCS_COMPANY: DocumentItem[] = [
  { id: 'co1', name: 'Business Name Registration Confirmation', status: 'pending', confidence: 0, notes: '' },
  { id: 'co2', name: 'Business Name Ordinance (Chap. 64)', status: 'pending', confidence: 0, notes: '' },
  { id: 'co3', name: 'Form: Business Ordinance & Trade Licensing', status: 'pending', confidence: 0, notes: '' },
  { id: 'co4', name: 'Form 49 (Sdn Bhd Only)', status: 'pending', confidence: 0, notes: '' },
  { id: 'co5', name: 'Form 9 (Companies Act 1965)', status: 'pending', confidence: 0, notes: '' },
  { id: 'co6', name: 'Inland Revenue Company Registration', status: 'pending', confidence: 0, notes: '' },
];

export const DEFAULT_MOCK_APP = {
  businessName: "",
  applicantName: "",
  icNumber: "",
  address: "",
  type: 'Individual' as const,
  isVillageShop: false,
};

// Simulation script sequence
// NOTE: ControlRoom will filter/modify these steps based on application type
export const SIMULATION_STEPS = [
  { agent: 'INTAKE', action: 'Initializing workflow...', duration: 1500, log: 'Received new application from portal.' },
  { agent: 'INTAKE', action: 'Parsing metadata...', duration: 1000, log: 'Metadata extracted: Kuching District.' },
  { agent: 'DOC_CHECK', action: 'Verifying manifest...', duration: 2000, log: 'Checking against Sarawak Trade License Ordinance requirements.' },
  { agent: 'OCR', action: 'Reading MyKad...', duration: 2500, log: 'Extracted IC: 850212-13-5678. Name matches applicant.' },
  { agent: 'OCR', action: 'Analyzing Sketch Plan...', duration: 2000, log: 'Detected counters, walkway width > 1.2m. Compliant.' },
  { agent: 'OWNERSHIP', action: 'Verifying Tenancy...', duration: 1500, log: 'Tenancy Agreement stamped by LHDN. Valid period.' },
  { agent: 'SAFETY', action: 'Checking Bomba Status...', duration: 2000, log: 'Bomba Support Letter Ref: JBPM/SWK/2024/05 detected.' },
  
  // These steps are conditional in ControlRoom.tsx
  { agent: 'VILLAGE', action: 'Checking Village Rules...', duration: 2000, log: 'Verifying Village Head Consent and District Office support.' },
  { agent: 'BUSINESS', action: 'Checking Business Names...', duration: 1500, log: 'Cross-referencing Name Registry. No conflicts found.' },
  
  { agent: 'SCORING', action: 'Calculating Weights...', duration: 2000, log: 'Aggregating verification scores...' },
  { agent: 'DECISION', action: 'Evaluating Risk...', duration: 2000, log: 'Risk Profile: LOW. Proceeding to Auto-Approval.' },
  { agent: 'AUDIT', action: 'Finalizing Report...', duration: 3000, log: 'Generating immutable audit trail on ledger.' },
];