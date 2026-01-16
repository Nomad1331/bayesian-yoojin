import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, AlertTriangle } from 'lucide-react';
import { Evidence, EvidenceType, DiagnosticStrength, Suspect } from '@/types';
import { saveEvidence, generateId } from '@/lib/storage';
import { getTypeLabel, getStrengthLabel } from '@/lib/bayesian';

interface AddEvidenceDialogProps {
  caseId: string;
  suspects: Suspect[];
  onEvidenceAdded: (evidence: Evidence) => void;
}

const evidenceTypes: EvidenceType[] = ['directly_discriminative', 'indirectly_discriminative', 'non_diagnostic'];
const diagnosticStrengths: DiagnosticStrength[] = [
  'strong',
  'moderate', 
  'weak',
  'neutral',
  'weakly_contradictory',
  'moderately_contradictory',
  'strongly_contradictory',
];

export function AddEvidenceDialog({ caseId, suspects, onEvidenceAdded }: AddEvidenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EvidenceType>('indirectly_discriminative');
  const [strength, setStrength] = useState<DiagnosticStrength>('moderate');
  const [selectedSuspects, setSelectedSuspects] = useState<string[]>([]);
  const [isDecisive, setIsDecisive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || selectedSuspects.length === 0) return;

    const newEvidence: Evidence = {
      id: generateId(),
      caseId,
      description: description.trim(),
      type,
      strength,
      affectedSuspectIds: selectedSuspects,
      isDecisive,
      isEnabled: true,
      createdAt: new Date().toISOString(),
    };

    saveEvidence(newEvidence);
    onEvidenceAdded(newEvidence);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setDescription('');
    setType('indirectly_discriminative');
    setStrength('moderate');
    setSelectedSuspects([]);
    setIsDecisive(false);
  };

  const toggleSuspect = (suspectId: string) => {
    setSelectedSuspects(prev => 
      prev.includes(suspectId) 
        ? prev.filter(id => id !== suspectId)
        : [...prev, suspectId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Add Evidence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Evidence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="evidence-description">Description</Label>
            <Textarea
              id="evidence-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the evidence..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Evidence Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as EvidenceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {evidenceTypes.map(t => (
                    <SelectItem key={t} value={t}>
                      {getTypeLabel(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Diagnostic Strength</Label>
              <Select value={strength} onValueChange={(v) => setStrength(v as DiagnosticStrength)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diagnosticStrengths.map(s => (
                    <SelectItem key={s} value={s}>
                      {getStrengthLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Affected Suspect(s)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Select which suspect(s) this evidence points toward or away from
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {suspects.map(suspect => (
                <div key={suspect.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`suspect-${suspect.id}`}
                    checked={selectedSuspects.includes(suspect.id)}
                    onCheckedChange={() => toggleSuspect(suspect.id)}
                  />
                  <label 
                    htmlFor={`suspect-${suspect.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {suspect.name}
                  </label>
                </div>
              ))}
              {suspects.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  Add suspects first
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="decisive" className="cursor-pointer text-sm">
                  Mark as Decisive Evidence
                </Label>
                <Switch
                  id="decisive"
                  checked={isDecisive}
                  onCheckedChange={setIsDecisive}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Decisive evidence can cause larger probability shifts. Use sparingly.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!description.trim() || selectedSuspects.length === 0}>
              Add Evidence
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
