export interface Case {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Suspect {
  id: string;
  caseId: string;
  name: string;
  notes: string;
  hasAccess: boolean;
  hasMotive: boolean;
}

export type EvidenceType = 'directly_discriminative' | 'indirectly_discriminative' | 'non_diagnostic';

export type DiagnosticStrength = 
  | 'strong'
  | 'moderate'
  | 'weak'
  | 'neutral'
  | 'weakly_contradictory'
  | 'moderately_contradictory'
  | 'strongly_contradictory';

export interface Evidence {
  id: string;
  caseId: string;
  description: string;
  type: EvidenceType;
  strength: DiagnosticStrength;
  affectedSuspectIds: string[];
  isDecisive: boolean;
  isEnabled: boolean;
  createdAt: string;
}

export interface BeliefSnapshot {
  id: string;
  caseId: string;
  timestamp: string;
  probabilities: Record<string, number>; // suspectId -> probability (0-1)
  evidenceId: string | null; // which evidence triggered this snapshot
  changeDescription: string;
}

export interface SuspectProbability {
  suspectId: string;
  name: string;
  probability: number;
  previousProbability: number;
  change: number;
}
