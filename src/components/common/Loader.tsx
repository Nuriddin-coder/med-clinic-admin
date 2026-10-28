import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({
  text = 'Ma\'lumotlar yuklanmoqda...',
  className,
  size = 'md',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-slate-500 gap-3', className)}>
      <Loader2
        className={cn(
          'animate-spin text-emerald-600',
          size === 'sm' && 'w-5 h-5',
          size === 'md' && 'w-8 h-8',
          size === 'lg' && 'w-12 h-12'
        )}
      />
      {text && <p className="text-xs font-medium text-slate-500">{text}</p>}
    </div>
  );
};

