import { cn } from '@/lib/utils';

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-solar-tint text-amber-800 capitalize',
        className
      )}
    >
      {children}
    </span>
  );
}
