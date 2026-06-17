import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'tz-num flex h-10 w-full rounded-md border border-line bg-washi/40 px-3 py-2 text-center font-mono text-sm text-sumi tabular-nums transition-colors placeholder:text-sumi-faint hover:border-sumi-faint focus-visible:outline-none focus-visible:border-shu focus-visible:bg-paper focus-visible:ring-2 focus-visible:ring-shu/25 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
