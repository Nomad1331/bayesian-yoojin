import { Evidence, Suspect, DiagnosticStrength, EvidenceType, BeliefSnapshot, SuspectProbability } from '@/types';

// Fixed diagnostic multipliers - these are NOT exposed to users
const STRENGTH_MULTIPLIERS: Record<DiagnosticStrength, number> = {
  strong: 3.0,
  moderate: 2.0,
  weak: 1.3,
  neutral: 1.0,
  weakly_contradictory: 0.7,
  moderately_contradictory: 0.4,
  strongly_contradictory: 0.2,
};

// Non-diagnostic evidence is capped at "weak" level
const NON_DIAGNOSTIC_CAP = 1.3;

// Maximum belief shift for non-decisive evidence (~40%)
const MAX_BELIEF_SHIFT = 0.4;

// "Other/Unknown" suspect ID constant
export const OTHER_UNKNOWN_ID = 'other_unknown';

export function getMultiplier(type: EvidenceType, strength: DiagnosticStrength): number {
  let multiplier = STRENGTH_MULTIPLIERS[strength];
  
  // Enforce non-diagnostic cap
  if (type === 'non_diagnostic') {
    if (multiplier > NON_DIAGNOSTIC_CAP) multiplier = NON_DIAGNOSTIC_CAP;
    if (multiplier < 1 / NON_DIAGNOSTIC_CAP) multiplier = 1 / NON_DIAGNOSTIC_CAP;
  }
  
  return multiplier;
}

export function calculateInitialPriors(suspects: Suspect[]): Record<string, number> {
  const priors: Record<string, number> = {};
  const totalSuspects = suspects.length + 1; // +1 for "Other/Unknown"
  
  // Base equal prior
  const basePrior = 1 / totalSuspects;
  
  // Small adjustments for access/motive (not exposed as numbers)
  const accessBonus = 0.02;
  const motiveBonus = 0.02;
  
  let totalAdjustment = 0;
  
  suspects.forEach(suspect => {
    let prior = basePrior;
    if (suspect.hasAccess) {
      prior += accessBonus;
      totalAdjustment += accessBonus;
    }
    if (suspect.hasMotive) {
      prior += motiveBonus;
      totalAdjustment += motiveBonus;
    }
    priors[suspect.id] = prior;
  });
  
  // "Other/Unknown" gets the base prior minus redistributed adjustments
  priors[OTHER_UNKNOWN_ID] = Math.max(0.01, basePrior - (totalAdjustment / 2));
  
  // Normalize to 100%
  return normalizeProbabilities(priors);
}

export function normalizeProbabilities(probs: Record<string, number>): Record<string, number> {
  const total = Object.values(probs).reduce((sum, p) => sum + p, 0);
  const normalized: Record<string, number> = {};
  
  for (const [id, prob] of Object.entries(probs)) {
    normalized[id] = prob / total;
  }
  
  return normalized;
}

export function applyEvidence(
  currentProbs: Record<string, number>,
  evidence: Evidence,
  allSuspectIds: string[]
): Record<string, number> {
  if (!evidence.isEnabled) {
    return currentProbs;
  }
  
  const multiplier = getMultiplier(evidence.type, evidence.strength);
  const newProbs = { ...currentProbs };
  
  // Apply multiplier to affected suspects
  for (const suspectId of allSuspectIds) {
    const isAffected = evidence.affectedSuspectIds.includes(suspectId);
    
    if (isAffected) {
      newProbs[suspectId] = currentProbs[suspectId] * multiplier;
    }
    // Non-affected suspects keep their current probability
    // (they'll be adjusted via normalization)
  }
  
  // Normalize
  const normalized = normalizeProbabilities(newProbs);
  
  // Enforce max shift cap unless decisive
  if (!evidence.isDecisive) {
    const cappedProbs: Record<string, number> = {};
    
    for (const [id, newProb] of Object.entries(normalized)) {
      const oldProb = currentProbs[id] || 0;
      const shift = newProb - oldProb;
      
      if (Math.abs(shift) > MAX_BELIEF_SHIFT) {
        cappedProbs[id] = oldProb + (shift > 0 ? MAX_BELIEF_SHIFT : -MAX_BELIEF_SHIFT);
      } else {
        cappedProbs[id] = newProb;
      }
    }
    
    return normalizeProbabilities(cappedProbs);
  }
  
  return normalized;
}

export function calculateCurrentProbabilities(
  suspects: Suspect[],
  evidenceList: Evidence[]
): Record<string, number> {
  const allSuspectIds = [...suspects.map(s => s.id), OTHER_UNKNOWN_ID];
  
  // Start with initial priors
  let probs = calculateInitialPriors(suspects);
  
  // Apply each enabled evidence in order
  for (const evidence of evidenceList.filter(e => e.isEnabled)) {
    probs = applyEvidence(probs, evidence, allSuspectIds);
  }
  
  return probs;
}

export function getSuspectProbabilities(
  suspects: Suspect[],
  evidenceList: Evidence[],
  previousProbs?: Record<string, number>
): SuspectProbability[] {
  const currentProbs = calculateCurrentProbabilities(suspects, evidenceList);
  const prev = previousProbs || calculateInitialPriors(suspects);
  
  const results: SuspectProbability[] = suspects.map(suspect => ({
    suspectId: suspect.id,
    name: suspect.name,
    probability: currentProbs[suspect.id] || 0,
    previousProbability: prev[suspect.id] || 0,
    change: (currentProbs[suspect.id] || 0) - (prev[suspect.id] || 0),
  }));
  
  // Add "Other/Unknown"
  results.push({
    suspectId: OTHER_UNKNOWN_ID,
    name: 'Other / Unknown',
    probability: currentProbs[OTHER_UNKNOWN_ID] || 0,
    previousProbability: prev[OTHER_UNKNOWN_ID] || 0,
    change: (currentProbs[OTHER_UNKNOWN_ID] || 0) - (prev[OTHER_UNKNOWN_ID] || 0),
  });
  
  // Sort by probability descending
  return results.sort((a, b) => b.probability - a.probability);
}

export function generateChangeDescription(
  evidence: Evidence,
  beforeProbs: Record<string, number>,
  afterProbs: Record<string, number>,
  suspects: Suspect[]
): string {
  const allNames = [...suspects.map(s => ({ id: s.id, name: s.name })), { id: OTHER_UNKNOWN_ID, name: 'Other/Unknown' }];
  
  const changes: string[] = [];
  
  for (const { id, name } of allNames) {
    const before = (beforeProbs[id] || 0) * 100;
    const after = (afterProbs[id] || 0) * 100;
    const diff = after - before;
    
    if (Math.abs(diff) >= 0.5) {
      const direction = diff > 0 ? 'increased' : 'decreased';
      changes.push(`${name} ${direction} by ${Math.abs(diff).toFixed(1)}%`);
    }
  }
  
  if (changes.length === 0) {
    return 'No significant probability changes.';
  }
  
  return changes.join('; ');
}

export function getStrengthLabel(strength: DiagnosticStrength): string {
  const labels: Record<DiagnosticStrength, string> = {
    strong: 'Strong',
    moderate: 'Moderate',
    weak: 'Weak',
    neutral: 'Neutral',
    weakly_contradictory: 'Weakly Contradictory',
    moderately_contradictory: 'Moderately Contradictory',
    strongly_contradictory: 'Strongly Contradictory',
  };
  return labels[strength];
}

export function getTypeLabel(type: EvidenceType): string {
  const labels: Record<EvidenceType, string> = {
    directly_discriminative: 'Directly Discriminative',
    indirectly_discriminative: 'Indirectly Discriminative',
    non_diagnostic: 'Non-Diagnostic',
  };
  return labels[type];
}
