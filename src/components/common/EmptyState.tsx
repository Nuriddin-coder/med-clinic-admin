import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Ma\'lumot topilmadi',
  description = 'Hozircha hech qanday yozuv kiritilmagan yoki qidiruv bo\'yicha natija yo\'q.',
  action,
  icon,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-dashed border-slate-200', className)}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

