import { AgentRole, ApplicationData } from "../types";

// MOCK SERVICE - No API calls to Google Gemini
// This simulates the AI generation for the demo.

const MOCK_THOUGHTS: Record<string, string[]> = {
  INTAKE: [
    "Validating form structure...",
    "Sanitizing input fields...",
    "Checking district metadata...",
    "Assigning case ID..."
  ],
  DOC_CHECK: [
    "Scanning manifesto...",
    " verifying file signatures...",
    "Cross-referencing requirements...",
    "Detecting missing pages..."
  ],
  OCR: [
    "Binarizing image data...",
    "Extracting text layer...",
    "Matching regex patterns...",
    "Validating MyKad format..."
  ],
  OWNERSHIP: [
    "Querying Land Registry...",
    "Verifying tenancy dates...",
    "Checking owner consent...",
    "Validating stamp duty..."
  ],
  SAFETY: [
    "Analyzing premise layout...",
    "Checking Bomba reference...",
    "Verifying exits...",
    "Assessing fire load..."
  ],
  VILLAGE: [
    "Checking zoning code...",
    "Verifying village head...",
    "Reviewing support letter...",
    "Validating district rules..."
  ],
  BUSINESS: [
    "Querying SSM database...",
    "Checking insolvency status...",
    "Verifying business nature...",
    "Matching entity ID..."
  ],
  SCORING: [
    "Aggregating sub-scores...",
    "Applying weightage logic...",
    "calculating compliance %...",
    "Normalizing metrics..."
  ],
  DECISION: [
    "Evaluating risk matrix...",
    "Checking blacklist...",
    "Finalizing decision tree...",
    "Preparing approval..."
  ],
  AUDIT: [
    "Hashing decision log...",
    "Writing to ledger...",
    "Generating proof...",
    "Finalizing report..."
  ]
};

export const generateAgentThought = async (
  agentRole: AgentRole,
  action: string,
appData: ApplicationData
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Get random realistic thought or fallback to action
  const thoughts = MOCK_THOUGHTS[agentRole] || [];
  const randomThought = thoughts.length > 0 
    ? thoughts[Math.floor(Math.random() * thoughts.length)] 
    : `Processing ${action}...`;

  return `[SYS] ${randomThought}`;
};

export const generateFinalJustification = async (appData: ApplicationData, score: number): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const uploadedCount = appData.documents.filter(d => d.fileName).length;
  const totalCount = appData.documents.length;

  if (score === 100) {
      return `Application APPROVED. Algorithmic verification confirmed all mandatory documents (${uploadedCount}/${totalCount}) and compliance requirements. Risk Profile: LOW. Compliance Score: 100%.`;
  } else if (score >= 80) {
      return `Application CONDITIONALLY APPROVED. Verification mostly complete (${uploadedCount}/${totalCount} documents). Missing documentation detected but core compliance met. Risk Profile: MEDIUM-LOW. Score: ${score}%. Subject to physical inspection.`;
  } else {
      return `Application FLAGGED FOR REVIEW. Incomplete documentation (${uploadedCount}/${totalCount} provided). Critical compliance checks could not be verified. Risk Profile: MEDIUM-HIGH. Score: ${score}%. Manual officer intervention required.`;
  }
};