import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, ...props }, ref) => {
    return (
      <div className="w-full">
        {(label || valueDisplay) && (
          <div className="flex justify-between mb-2">
            {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
            {valueDisplay && <span className="text-sm text-zinc-500">{valueDisplay}</span>}
          </div>
        )}
        <input
          type="range"
          className={cn(
            'w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-500',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
