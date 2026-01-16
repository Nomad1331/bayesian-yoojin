import { SuspectProbability } from '@/types';
import { ProbabilityBar } from './ProbabilityBar';
import { OTHER_UNKNOWN_ID } from '@/lib/bayesian';
import { User, HelpCircle } from 'lucide-react';

interface SuspectRankingProps {
  rankings: SuspectProbability[];
  latestChange?: string;
}

export function SuspectRanking({ rankings, latestChange }: SuspectRankingProps) {
  if (rankings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Add suspects to begin probability ranking
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {latestChange && (
        <div className="disclaimer-banner">
          <span className="font-medium">Latest update:</span> {latestChange}
        </div>
      )}
      
      <div className="space-y-3">
        {rankings.map((item, index) => (
          <div 
            key={item.suspectId}
            className="panel"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2 flex-1">
                  {item.suspectId === OTHER_UNKNOWN_ID ? (
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
              </div>
              <ProbabilityBar 
                probability={item.probability}
                change={item.change}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
