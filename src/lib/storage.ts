import { Case, Suspect, Evidence, BeliefSnapshot } from '@/types';

const CASES_KEY = 'ebsrs_cases';
const SUSPECTS_KEY = 'ebsrs_suspects';
const EVIDENCE_KEY = 'ebsrs_evidence';
const SNAPSHOTS_KEY = 'ebsrs_snapshots';

function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Cases
export function getCases(): Case[] {
  return getFromStorage<Case>(CASES_KEY);
}

export function getCase(id: string): Case | undefined {
  return getCases().find(c => c.id === id);
}

export function saveCase(caseData: Case): void {
  const cases = getCases();
  const index = cases.findIndex(c => c.id === caseData.id);
  if (index >= 0) {
    cases[index] = caseData;
  } else {
    cases.push(caseData);
  }
  saveToStorage(CASES_KEY, cases);
}

export function deleteCase(id: string): void {
  const cases = getCases().filter(c => c.id !== id);
  saveToStorage(CASES_KEY, cases);
  
  // Also delete related data
  const suspects = getSuspects().filter(s => s.caseId !== id);
  saveToStorage(SUSPECTS_KEY, suspects);
  
  const evidence = getEvidence().filter(e => e.caseId !== id);
  saveToStorage(EVIDENCE_KEY, evidence);
  
  const snapshots = getSnapshots().filter(s => s.caseId !== id);
  saveToStorage(SNAPSHOTS_KEY, snapshots);
}

// Suspects
export function getSuspects(): Suspect[] {
  return getFromStorage<Suspect>(SUSPECTS_KEY);
}

export function getSuspectsForCase(caseId: string): Suspect[] {
  return getSuspects().filter(s => s.caseId === caseId);
}

export function saveSuspect(suspect: Suspect): void {
  const suspects = getSuspects();
  const index = suspects.findIndex(s => s.id === suspect.id);
  if (index >= 0) {
    suspects[index] = suspect;
  } else {
    suspects.push(suspect);
  }
  saveToStorage(SUSPECTS_KEY, suspects);
}

export function deleteSuspect(id: string): void {
  const suspects = getSuspects().filter(s => s.id !== id);
  saveToStorage(SUSPECTS_KEY, suspects);
}

// Evidence
export function getEvidence(): Evidence[] {
  return getFromStorage<Evidence>(EVIDENCE_KEY);
}

export function getEvidenceForCase(caseId: string): Evidence[] {
  return getEvidence().filter(e => e.caseId === caseId);
}

export function saveEvidence(evidence: Evidence): void {
  const allEvidence = getEvidence();
  const index = allEvidence.findIndex(e => e.id === evidence.id);
  if (index >= 0) {
    allEvidence[index] = evidence;
  } else {
    allEvidence.push(evidence);
  }
  saveToStorage(EVIDENCE_KEY, allEvidence);
}

export function deleteEvidence(id: string): void {
  const evidence = getEvidence().filter(e => e.id !== id);
  saveToStorage(EVIDENCE_KEY, evidence);
}

// Snapshots
export function getSnapshots(): BeliefSnapshot[] {
  return getFromStorage<BeliefSnapshot>(SNAPSHOTS_KEY);
}

export function getSnapshotsForCase(caseId: string): BeliefSnapshot[] {
  return getSnapshots().filter(s => s.caseId === caseId);
}

export function saveSnapshot(snapshot: BeliefSnapshot): void {
  const snapshots = getSnapshots();
  snapshots.push(snapshot);
  saveToStorage(SNAPSHOTS_KEY, snapshots);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
