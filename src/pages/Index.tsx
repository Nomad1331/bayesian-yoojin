import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCaseDialog } from '@/components/CreateCaseDialog';
import { Button } from '@/components/ui/button';
import { Case } from '@/types';
import { getCases, deleteCase } from '@/lib/storage';
import { Scale, FolderOpen, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCases(getCases());
  }, []);

  const handleCaseCreated = (newCase: Case) => {
    setCases(prev => [...prev, newCase]);
    navigate(`/case/${newCase.id}`);
  };

  const handleDeleteCase = (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    if (confirm('Delete this case and all associated data?')) {
      deleteCase(caseId);
      setCases(prev => prev.filter(c => c.id !== caseId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Evidence-Based Suspect Ranking</h1>
                <p className="text-sm text-muted-foreground">Bayesian Case Assistant</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Disclaimer */}
        <div className="disclaimer-banner mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground mb-1">Decision Support Tool</p>
            <p className="text-sm">
              This application assists in organizing and weighing evidence using structured rules. 
              It does not use AI, make guilt determinations, or replace professional investigation. 
              All probability calculations use fixed, auditable diagnostic weights.
            </p>
          </div>
        </div>

        {/* Cases Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your Cases</h2>
          <CreateCaseDialog onCaseCreated={handleCaseCreated} />
        </div>

        {cases.length === 0 ? (
          <div className="panel">
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No cases yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first case to start ranking suspects based on evidence.
              </p>
              <CreateCaseDialog onCaseCreated={handleCaseCreated} />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map(caseItem => (
              <div 
                key={caseItem.id} 
                className="panel cursor-pointer hover:border-accent transition-colors group"
                onClick={() => navigate(`/case/${caseItem.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-1">
                      {caseItem.name}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDeleteCase(e, caseItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {caseItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {caseItem.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How It Works Section */}
        <section className="mt-12">
          <h2 className="section-header">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="panel p-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-3">
                <span className="font-medium text-sm">1</span>
              </div>
              <h3 className="font-medium mb-1">Create Case & Add Suspects</h3>
              <p className="text-sm text-muted-foreground">
                Start with equal probability for all suspects. Optional flags for access and motive provide small adjustments.
              </p>
            </div>
            <div className="panel p-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-3">
                <span className="font-medium text-sm">2</span>
              </div>
              <h3 className="font-medium mb-1">Enter Structured Evidence</h3>
              <p className="text-sm text-muted-foreground">
                Classify each piece of evidence by type and diagnostic strength. Link to affected suspects.
              </p>
            </div>
            <div className="panel p-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-3">
                <span className="font-medium text-sm">3</span>
              </div>
              <h3 className="font-medium mb-1">View Rankings & Audit Trail</h3>
              <p className="text-sm text-muted-foreground">
                See probability rankings update. Toggle evidence on/off to test impact. Review complete audit history.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-auto">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          Evidence-Based Suspect Ranking System • Decision Support Tool Only
        </div>
      </footer>
    </div>
  );
};

export default Index;
