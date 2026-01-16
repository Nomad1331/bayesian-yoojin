import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Users, FileText, BarChart2, History, Lightbulb, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TutorialDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Tutorial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-5 w-5 text-accent" />
            How to Use Bayesian Case Assistant
          </DialogTitle>
          <DialogDescription>
            A comprehensive guide to analyzing cases using Bayesian probability
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Overview */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This tool helps investigators and analysts organize evidence and calculate 
                probability rankings for suspects using Bayesian inference. It's a decision 
                support tool—not a guilt determinator.
              </p>
            </section>

            {/* Step 1: Create a Case */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                Create a Case
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start by creating a new case from the home screen. Give it a descriptive name 
                and optional description to help identify it later.
              </p>
            </section>

            {/* Step 2: Add Suspects */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                <Users className="h-4 w-4" />
                Add Suspects
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add suspects you want to analyze. For each suspect, you can specify:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Name:</strong> Identifier for the suspect</li>
                <li>• <strong>Has Access:</strong> Whether they had opportunity/access</li>
                <li>• <strong>Has Motive:</strong> Whether they had a reason to commit the act</li>
              </ul>
              <div className="bg-muted/50 rounded-md p-3 border">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> An "Other / Unknown" suspect is automatically created 
                    to account for possibilities not yet considered. This is essential for 
                    mathematically sound Bayesian analysis.
                  </span>
                </p>
              </div>
            </section>

            {/* Step 3: Enter Evidence */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                <FileText className="h-4 w-4" />
                Enter Evidence
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add evidence items and classify them:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Evidence Type:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <em>Physical:</em> DNA, fingerprints, weapons, etc.</li>
                    <li>• <em>Testimonial:</em> Witness statements, confessions</li>
                    <li>• <em>Documentary:</em> Records, emails, documents</li>
                    <li>• <em>Circumstantial:</em> Indirect evidence suggesting involvement</li>
                  </ul>
                </li>
                <li className="mt-2">
                  <strong>Diagnostic Strength:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <em>Strong:</em> Highly points toward the suspect (e.g., DNA match)</li>
                    <li>• <em>Moderate:</em> Suggests involvement but not definitive</li>
                    <li>• <em>Weak:</em> Minor indication, easily explained otherwise</li>
                    <li>• <em>Contradictory:</em> Evidence against this suspect</li>
                  </ul>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                You can toggle evidence on/off to see how it affects rankings, or delete 
                evidence entirely if entered incorrectly.
              </p>
            </section>

            {/* Step 4: Analyze Rankings */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                <BarChart2 className="h-4 w-4" />
                Analyze Probability Rankings
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The ranking view shows real-time probability calculations based on all 
                entered evidence. Higher probabilities indicate stronger cumulative evidence 
                pointing to that suspect.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Watch for probability changes as you add new evidence—the system shows 
                how each piece shifts the rankings.
              </p>
            </section>

            {/* Step 5: Review Audit Log */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
                <History className="h-4 w-4" />
                Review Audit Log
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The audit log provides a complete history of all changes to the case, 
                including when suspects were added, evidence entered, and how probabilities 
                changed over time. This is useful for documenting your analysis process.
              </p>
            </section>

            {/* Tips */}
            <section className="space-y-3 border-t pt-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Tips for Best Results
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Be objective:</strong> Enter all evidence, even if it contradicts your hypothesis</li>
                <li>• <strong>Be specific:</strong> Classify evidence strength accurately—don't overstate weak evidence</li>
                <li>• <strong>Consider alternatives:</strong> The "Other / Unknown" category helps account for suspects not yet identified</li>
                <li>• <strong>Iterate:</strong> As new evidence emerges, add it and observe how rankings shift</li>
                <li>• <strong>Document:</strong> Use the audit log to maintain a clear record of your analysis</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}