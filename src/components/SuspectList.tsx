import { Suspect } from '@/types';
import { User, Key, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuspectListProps {
  suspects: Suspect[];
  onDeleteSuspect: (suspectId: string) => void;
}

export function SuspectList({ suspects, onDeleteSuspect }: SuspectListProps) {
  if (suspects.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No suspects added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suspects.map((suspect) => (
        <div key={suspect.id} className="flex items-center gap-3 p-3 border rounded-md bg-card">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{suspect.name}</p>
            {suspect.notes && (
              <p className="text-xs text-muted-foreground truncate">{suspect.notes}</p>
            )}
            <div className="flex gap-2 mt-1">
              {suspect.hasAccess && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Key className="h-3 w-3" /> Access
                </span>
              )}
              {suspect.hasMotive && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" /> Motive
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteSuspect(suspect.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
