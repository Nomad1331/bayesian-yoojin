import { BeliefSnapshot, Evidence, Suspect } from '@/types';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { OTHER_UNKNOWN_ID } from '@/lib/bayesian';

interface AuditLogProps {
  snapshots: BeliefSnapshot[];
  evidence: Evidence[];
  suspects: Suspect[];
}

export function AuditLog({ snapshots, evidence, suspects }: AuditLogProps) {
  const getEvidenceDescription = (evidenceId: string | null) => {
    if (!evidenceId) return 'Initial assessment';
    const ev = evidence.find(e => e.id === evidenceId);
    return ev?.description || 'Evidence updated';
  };

  const getSuspectName = (suspectId: string) => {
    if (suspectId === OTHER_UNKNOWN_ID) return 'Other/Unknown';
    const suspect = suspects.find(s => s.id === suspectId);
    return suspect?.name || 'Unknown';
  };

  if (snapshots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No audit history yet</p>
        <p className="text-xs mt-1">Add evidence to see probability changes over time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {snapshots.slice().reverse().map((snapshot, index) => (
        <div key={snapshot.id} className="panel">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">{snapshots.length - index}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{getEvidenceDescription(snapshot.evidenceId)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(snapshot.timestamp).toLocaleString()}
                </p>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {snapshot.changeDescription}
                </p>

                <div className="mt-3 space-y-1">
                  {Object.entries(snapshot.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([suspectId, prob]) => (
                      <div key={suspectId} className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-24 truncate">
                          {getSuspectName(suspectId)}
                        </span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="tabular-nums font-medium w-10 text-right">
                          {Math.round(prob * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
