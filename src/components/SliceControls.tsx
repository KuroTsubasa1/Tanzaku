import React from 'react';
import { Slider } from './ui/Slider';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { Ruler, AlignJustify, Grid2x2, CornerDownRight } from 'lucide-react';

interface SliceControlsProps {
  mode: 'width' | 'count';
  onModeChange: (mode: 'width' | 'count') => void;
  sliceWidth: number;
  onSliceWidthChange: (width: number) => void;
  sliceCount: number;
  onSliceCountChange: (count: number) => void;
  cornerRadius: number;
  onCornerRadiusChange: (radius: number) => void;
  imageWidth: number;
  imageHeight: number;

  isDualMode: boolean;
  onDualModeChange: (enabled: boolean) => void;
  sliceHeight: number;
  onSliceHeightChange: (height: number) => void;
  verticalSliceCount: number;
  onVerticalSliceCountChange: (count: number) => void;
}

const AxisLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="h-px w-4 bg-shu" />
    <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sumi-soft">
      {children}
    </h4>
  </div>
);

export const SliceControls: React.FC<SliceControlsProps> = ({
  mode,
  onModeChange,
  sliceWidth,
  onSliceWidthChange,
  sliceCount,
  onSliceCountChange,
  cornerRadius,
  onCornerRadiusChange,
  imageWidth,
  imageHeight,
  isDualMode,
  onDualModeChange,
  sliceHeight,
  onSliceHeightChange,
  verticalSliceCount,
  onVerticalSliceCountChange,
}) => {
  // Logic for Width Mode (Horizontal)
  const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      onSliceWidthChange(Math.max(1, Math.min(val, imageWidth)));
    }
  };

  const handleWidthSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliceWidthChange(parseInt(e.target.value));
  };

  // Logic for Count Mode (Horizontal)
  const handleCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      onSliceCountChange(Math.max(1, Math.min(val, imageWidth)));
    }
  };

  const handleCountSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliceCountChange(parseInt(e.target.value));
  };

  // Logic for Height Mode (Vertical)
  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      onSliceHeightChange(Math.max(1, Math.min(val, imageHeight)));
    }
  };

  const handleHeightSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliceHeightChange(parseInt(e.target.value));
  };

  // Logic for Count Mode (Vertical)
  const handleVerticalCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      onVerticalSliceCountChange(Math.max(1, Math.min(val, imageHeight)));
    }
  };

  const handleVerticalCountSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVerticalSliceCountChange(parseInt(e.target.value));
  };

  // Live swatch: a 40px sample tile whose rounding mirrors radius ÷ slice width.
  const swatchSize = 40;
  const swatchRadius =
    sliceWidth > 0 ? Math.min((cornerRadius * swatchSize) / sliceWidth, swatchSize / 2) : 0;

  const tabClass = (active: boolean) =>
    `flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
      active
        ? 'bg-paper text-shu shadow-paper-sm'
        : 'text-sumi-soft hover:text-sumi'
    }`;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <Grid2x2 className="h-4 w-4 text-shu" />
            <h3 className="font-display text-lg font-semibold text-sumi">Slice Settings</h3>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 rounded-lg bg-washi/70 p-1 ring-1 ring-line-soft">
            <button onClick={() => onModeChange('width')} className={tabClass(mode === 'width')}>
              <Ruler className="h-4 w-4" />
              By Size
            </button>
            <button onClick={() => onModeChange('count')} className={tabClass(mode === 'count')}>
              <AlignJustify className="h-4 w-4" />
              By Count
            </button>
          </div>

          {/* Horizontal Slicing Controls */}
          <div>
            <AxisLabel>Horizontal · Width</AxisLabel>
            {mode === 'width' ? (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Slider
                    label="Slice Width"
                    value={sliceWidth}
                    min={10}
                    max={Math.min(500, imageWidth)}
                    step={1}
                    onChange={handleWidthSliderChange}
                    valueDisplay={`${sliceWidth}px`}
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    value={sliceWidth}
                    onChange={handleWidthInputChange}
                    min={1}
                    max={imageWidth}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Slider
                    label="Number of Slices"
                    value={sliceCount}
                    min={1}
                    max={Math.min(20, Math.floor(imageWidth / 10))}
                    step={1}
                    onChange={handleCountSliderChange}
                    valueDisplay={`${sliceCount}`}
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    value={sliceCount}
                    onChange={handleCountInputChange}
                    min={1}
                    max={imageWidth}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dual Mode Toggle */}
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-line-soft bg-washi/40 px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <Grid2x2 className={`h-4 w-4 ${isDualMode ? 'text-shu' : 'text-sumi-faint'}`} />
              <div>
                <span className="block text-sm font-medium text-sumi">Dual slicing</span>
                <span className="block text-xs text-sumi-soft">Cut a full grid</span>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isDualMode}
                onChange={(e) => onDualModeChange(e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-shu peer-focus-visible:ring-2 peer-focus-visible:ring-shu/40 after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-paper after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
            </div>
          </label>

          {/* Vertical Slicing Controls (Conditional) */}
          {isDualMode && (
            <div className="animate-rise-in">
              <AxisLabel>Vertical · Height</AxisLabel>
              {mode === 'width' ? (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Slider
                      label="Slice Height"
                      value={sliceHeight}
                      min={10}
                      max={Math.min(500, imageHeight)}
                      step={1}
                      onChange={handleHeightSliderChange}
                      valueDisplay={`${sliceHeight}px`}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={sliceHeight}
                      onChange={handleHeightInputChange}
                      min={1}
                      max={imageHeight}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Slider
                      label="Number of Rows"
                      value={verticalSliceCount}
                      min={1}
                      max={Math.min(20, Math.floor(imageHeight / 10))}
                      step={1}
                      onChange={handleVerticalCountSliderChange}
                      valueDisplay={`${verticalSliceCount}`}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={verticalSliceCount}
                      onChange={handleVerticalCountInputChange}
                      min={1}
                      max={imageHeight}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="h-px bg-line-soft" />

          {/* Corner Radius Controls */}
          <div>
            <AxisLabel>
              <span className="inline-flex items-center gap-1.5">
                <CornerDownRight className="h-3 w-3" /> Corner Radius
              </span>
            </AxisLabel>
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-line-soft bg-washi/50"
                title="Corner radius preview"
              >
                <div
                  className="h-10 w-10 border border-dashed border-shu/70 shadow-paper-sm"
                  style={{
                    borderRadius: `${swatchRadius}px`,
                    background: 'linear-gradient(135deg, #E7C7BE 0%, #F1EAD9 100%)',
                    transition: 'border-radius 0.12s ease-out',
                  }}
                />
              </div>
              <div className="flex flex-1 items-end gap-4">
                <div className="flex-1">
                  <Slider
                    label="Radius"
                    value={cornerRadius}
                    min={0}
                    max={Math.max(1, Math.floor(sliceWidth / 2))}
                    step={1}
                    onChange={(e) => onCornerRadiusChange(parseInt(e.target.value))}
                    valueDisplay={`${cornerRadius}px`}
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    value={cornerRadius}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        onCornerRadiusChange(Math.max(0, Math.min(val, Math.floor(sliceWidth / 2))));
                      }
                    }}
                    min={0}
                    max={Math.floor(sliceWidth / 2)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
