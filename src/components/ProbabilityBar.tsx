import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProbabilityBarProps {
  probability: number;
  change?: number;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProbabilityBar({ 
  probability, 
  change = 0, 
  showChange = true,
  size = 'md' 
}: ProbabilityBarProps) {
  const percentage = Math.round(probability * 100);
  const changePercent = Math.round(change * 100);
  
  const getChangeIndicator = () => {
    if (!showChange || Math.abs(changePercent) < 1) {
      return null;
    }
    
    if (changePercent > 0) {
      return (
        <span className="change-indicator change-indicator-positive">
          <TrendingUp className="h-3 w-3" />
          +{changePercent}%
        </span>
      );
    }
    
    return (
      <span className="change-indicator change-indicator-negative">
        <TrendingDown className="h-3 w-3" />
        {changePercent}%
      </span>
    );
  };
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex-1 probability-bar-track", heights[size])}>
        <div 
          className={cn("probability-bar", heights[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-2 min-w-[100px] justify-end">
        <span className="text-sm font-medium tabular-nums">
          {percentage}%
        </span>
        {getChangeIndicator()}
      </div>
    </div>
  );
}
