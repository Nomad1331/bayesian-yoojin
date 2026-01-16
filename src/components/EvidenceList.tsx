import { Evidence, Suspect } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTypeLabel, getStrengthLabel } from '@/lib/bayesian';
import { FileText, AlertTriangle, Clock, Trash2 } from 'lucide-react';

interface EvidenceListProps {
  evidence: Evidence[];
  suspects: Suspect[];
  onToggleEvidence: (evidenceId: string, enabled: boolean) => void;
  onDeleteEvidence?: (evidenceId: string) => void;
}

export function EvidenceList({ evidence, suspects, onToggleEvidence, onDeleteEvidence }: EvidenceListProps) {
  const getSuspectNames = (ids: string[]) => {
    return ids.map(id => {
      const suspect = suspects.find(s => s.id === id);
      return suspect?.name || 'Unknown';
    }).join(', ');
  };

  const getStrengthVariant = (strength: string): "default" | "secondary" | "destructive" | "outline" => {
    if (strength.includes('contradictory')) return 'destructive';
    if (strength === 'strong' || strength === 'moderate') return 'default';
    return 'secondary';
  };

  if (evidence.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No evidence added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item) => (
        <div 
          key={item.id} 
          className={`panel transition-opacity ${!item.isEnabled ? 'opacity-50' : ''}`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="font-medium text-sm line-clamp-2">{item.description}</p>
                  {item.isDecisive && (
                    <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(item.type)}
                  </Badge>
                  <Badge variant={getStrengthVariant(item.strength)} className="text-xs">
                    {getStrengthLabel(item.strength)}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Affects: {getSuspectNames(item.affectedSuspectIds)}
                </p>
                
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">
                  {item.isEnabled ? 'Active' : 'Disabled'}
                </span>
                <Switch
                  checked={item.isEnabled}
                  onCheckedChange={(enabled) => onToggleEvidence(item.id, enabled)}
                />
                {onDeleteEvidence && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteEvidence(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
