import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, value, min = 0, max = 100, style, ...props }, ref) => {
    const v = Number(value);
    const lo = Number(min);
    const hi = Number(max);
    const pct = hi > lo ? Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100)) : 0;

    return (
      <div className="w-full">
        {(label || valueDisplay) && (
          <div className="flex items-baseline justify-between mb-2.5">
            {label && (
              <label className="text-[0.7rem] uppercase tracking-[0.16em] font-medium text-sumi-soft">
                {label}
              </label>
            )}
            {valueDisplay && (
              <span className="font-mono text-sm font-medium text-sumi tabular-nums">
                {valueDisplay}
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          className={cn('tz-range', className)}
          style={{
            ['--tz-fill' as string]: `linear-gradient(90deg, #C0392B ${pct}%, #DDD2BC ${pct}%)`,
            ...style,
          }}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
