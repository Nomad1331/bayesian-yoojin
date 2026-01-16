import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, FileText, History, Users } from 'lucide-react';
import { Case, Suspect, Evidence, BeliefSnapshot } from '@/types';
import { 
  getCase, 
  getSuspectsForCase, 
  getEvidenceForCase, 
  getSnapshotsForCase,
  saveEvidence,
  deleteEvidence as deleteEvidenceFromStorage,
  deleteSuspect,
  saveSnapshot,
  generateId,
} from '@/lib/storage';
import { 
  getSuspectProbabilities, 
  calculateCurrentProbabilities,
  generateChangeDescription,
} from '@/lib/bayesian';
import { AddSuspectDialog } from '@/components/AddSuspectDialog';
import { AddEvidenceDialog } from '@/components/AddEvidenceDialog';
import { SuspectRanking } from '@/components/SuspectRanking';
import { SuspectList } from '@/components/SuspectList';
import { EvidenceList } from '@/components/EvidenceList';
import { AuditLog } from '@/components/AuditLog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TutorialDialog } from '@/components/TutorialDialog';

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [snapshots, setSnapshots] = useState<BeliefSnapshot[]>([]);
  const [latestChange, setLatestChange] = useState<string>('');

  const loadData = useCallback(() => {
    if (!id) return;
    
    const loadedCase = getCase(id);
    if (!loadedCase) {
      navigate('/');
      return;
    }
    
    setCaseData(loadedCase);
    setSuspects(getSuspectsForCase(id));
    setEvidence(getEvidenceForCase(id));
    setSnapshots(getSnapshotsForCase(id));
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSuspectAdded = (suspect: Suspect) => {
    setSuspects(prev => [...prev, suspect]);
    
    // Create initial snapshot
    const allSuspects = [...suspects, suspect];
    const probs = calculateCurrentProbabilities(allSuspects, evidence);
    
    const snapshot: BeliefSnapshot = {
      id: generateId(),
      caseId: id!,
      timestamp: new Date().toISOString(),
      probabilities: probs,
      evidenceId: null,
      changeDescription: `Added suspect: ${suspect.name}`,
    };
    
    saveSnapshot(snapshot);
    setSnapshots(prev => [...prev, snapshot]);
    setLatestChange(`Added suspect: ${suspect.name}`);
  };

  const handleDeleteSuspect = (suspectId: string) => {
    deleteSuspect(suspectId);
    const updated = suspects.filter(s => s.id !== suspectId);
    setSuspects(updated);
    
    const suspectName = suspects.find(s => s.id === suspectId)?.name || 'Unknown';
    setLatestChange(`Removed suspect: ${suspectName}`);
  };

  const handleEvidenceAdded = (newEvidence: Evidence) => {
    const beforeProbs = calculateCurrentProbabilities(suspects, evidence);
    const updatedEvidence = [...evidence, newEvidence];
    const afterProbs = calculateCurrentProbabilities(suspects, updatedEvidence);
    
    const changeDesc = generateChangeDescription(newEvidence, beforeProbs, afterProbs, suspects);
    
    const snapshot: BeliefSnapshot = {
      id: generateId(),
      caseId: id!,
      timestamp: new Date().toISOString(),
      probabilities: afterProbs,
      evidenceId: newEvidence.id,
      changeDescription: changeDesc,
    };
    
    saveSnapshot(snapshot);
    setEvidence(updatedEvidence);
    setSnapshots(prev => [...prev, snapshot]);
    setLatestChange(changeDesc);
  };

  const handleToggleEvidence = (evidenceId: string, enabled: boolean) => {
    const updated = evidence.map(e => 
      e.id === evidenceId ? { ...e, isEnabled: enabled } : e
    );
    
    const changedEvidence = evidence.find(e => e.id === evidenceId);
    if (changedEvidence) {
      saveEvidence({ ...changedEvidence, isEnabled: enabled });
    }
    
    setEvidence(updated);
    
    const action = enabled ? 'Enabled' : 'Disabled';
    setLatestChange(`${action}: ${changedEvidence?.description.substring(0, 50)}...`);
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    const deletedEvidence = evidence.find(e => e.id === evidenceId);
    deleteEvidenceFromStorage(evidenceId);
    const updated = evidence.filter(e => e.id !== evidenceId);
    setEvidence(updated);
    
    if (deletedEvidence) {
      setLatestChange(`Deleted evidence: ${deletedEvidence.description.substring(0, 50)}...`);
    }
  };

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading case...</p>
      </div>
    );
  }

  const rankings = getSuspectProbabilities(suspects, evidence);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{caseData.name}</h1>
                {caseData.description && (
                  <p className="text-sm text-muted-foreground">{caseData.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TutorialDialog />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Suspects & Evidence */}
          <div className="lg:col-span-1 space-y-6">
            <div className="panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Suspects
                </h2>
                <AddSuspectDialog caseId={id!} onSuspectAdded={handleSuspectAdded} />
              </div>
              <div className="panel-content">
                <SuspectList suspects={suspects} onDeleteSuspect={handleDeleteSuspect} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Evidence
                </h2>
                <AddEvidenceDialog 
                  caseId={id!} 
                  suspects={suspects} 
                  onEvidenceAdded={handleEvidenceAdded} 
                />
              </div>
              <div className="panel-content max-h-96 overflow-y-auto">
                <EvidenceList 
                  evidence={evidence} 
                  suspects={suspects}
                  onToggleEvidence={handleToggleEvidence}
                  onDeleteEvidence={handleDeleteEvidence}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Results & Audit */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="ranking" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="ranking" className="gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Probability Ranking
                </TabsTrigger>
                <TabsTrigger value="audit" className="gap-2">
                  <History className="h-4 w-4" />
                  Audit Log
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ranking" className="mt-4">
                <div className="disclaimer-banner mb-4">
                  <strong>Decision Support Tool.</strong> Rankings are based on structured evidence input 
                  and fixed diagnostic rules. This tool does not determine guilt—it assists in 
                  organizing and weighing evidence.
                </div>
                <SuspectRanking rankings={rankings} latestChange={latestChange} />
              </TabsContent>
              
              <TabsContent value="audit" className="mt-4">
                <AuditLog 
                  snapshots={snapshots} 
                  evidence={evidence}
                  suspects={suspects}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
