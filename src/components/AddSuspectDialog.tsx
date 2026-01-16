import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPlus } from 'lucide-react';
import { Suspect } from '@/types';
import { saveSuspect, generateId } from '@/lib/storage';

interface AddSuspectDialogProps {
  caseId: string;
  onSuspectAdded: (suspect: Suspect) => void;
}

export function AddSuspectDialog({ caseId, onSuspectAdded }: AddSuspectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [hasMotive, setHasMotive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const newSuspect: Suspect = {
      id: generateId(),
      caseId,
      name: name.trim(),
      notes: notes.trim(),
      hasAccess,
      hasMotive,
    };

    saveSuspect(newSuspect);
    onSuspectAdded(newSuspect);
    setName('');
    setNotes('');
    setHasAccess(false);
    setHasMotive(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Suspect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Suspect</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suspect-name">Name</Label>
            <Input
              id="suspect-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Suspect name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suspect-notes">Notes</Label>
            <Textarea
              id="suspect-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant background information..."
              rows={2}
            />
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Initial Factors (optional adjustments to base probability)
            </p>
            <div className="flex items-center justify-between">
              <Label htmlFor="has-access" className="cursor-pointer">
                Has opportunity/access
              </Label>
              <Switch
                id="has-access"
                checked={hasAccess}
                onCheckedChange={setHasAccess}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="has-motive" className="cursor-pointer">
                Has apparent motive
              </Label>
              <Switch
                id="has-motive"
                checked={hasMotive}
                onCheckedChange={setHasMotive}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Suspect
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
