import React from 'react';
import { Slider } from './ui/Slider';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { Layers, Ruler, AlignJustify, Grid } from 'lucide-react';

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

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-zinc-900">Slice Settings</h3>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 bg-zinc-100 rounded-lg">
            <button
              onClick={() => onModeChange('width')}
              className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                mode === 'width'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Ruler className="w-4 h-4" />
              By Size
            </button>
            <button
              onClick={() => onModeChange('count')}
              className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                mode === 'count'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <AlignJustify className="w-4 h-4" />
              By Count
            </button>
          </div>

          {/* Horizontal Slicing Controls */}
          <div>
            <h4 className="text-sm font-medium text-zinc-700 mb-2">Horizontal Axis (Width)</h4>
            {mode === 'width' ? (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Slider
                    label="Slice Width (px)"
                    value={sliceWidth}
                    min={10}
                    max={Math.min(500, imageWidth)}
                    step={1}
                    onChange={handleWidthSliderChange}
                    valueDisplay={`${sliceWidth}px`}
                  />
                </div>
                <div className="w-24">
                   <label className="text-xs text-zinc-500 mb-1 block">Precise</label>
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
                <div className="w-24">
                   <label className="text-xs text-zinc-500 mb-1 block">Precise</label>
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
          <div className="flex items-center justify-between py-2 border-t border-b border-zinc-100">
             <div className="flex items-center gap-2">
               <Grid className={`h-4 w-4 ${isDualMode ? 'text-blue-500' : 'text-zinc-400'}`} />
               <span className="text-sm font-medium text-zinc-900">Dual Slicing Mode</span>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDualMode}
                  onChange={(e) => onDualModeChange(e.target.checked)}
               />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
          </div>

          {/* Vertical Slicing Controls (Conditional) */}
          {isDualMode && (
            <div className="animate-in slide-in-from-top-2 duration-200">
               <h4 className="text-sm font-medium text-zinc-700 mb-2">Vertical Axis (Height)</h4>
               {mode === 'width' ? (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Slider
                      label="Slice Height (px)"
                      value={sliceHeight}
                      min={10}
                      max={Math.min(500, imageHeight)}
                      step={1}
                      onChange={handleHeightSliderChange}
                      valueDisplay={`${sliceHeight}px`}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-zinc-500 mb-1 block">Precise</label>
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
                  <div className="w-24">
                     <label className="text-xs text-zinc-500 mb-1 block">Precise</label>
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

          <div className="h-px bg-zinc-100 my-2" />

          {/* Corner Radius Controls */}
          <div>
             <h4 className="text-sm font-medium text-zinc-700 mb-4">Corner Radius</h4>
             <div className="flex items-end gap-4">
              <div className="flex-1">
                <Slider
                  label="Radius (px)"
                  value={cornerRadius}
                  min={1}
                  max={Math.floor(sliceWidth / 2)}
                  step={1}
                  onChange={(e) => onCornerRadiusChange(parseInt(e.target.value))}
                  valueDisplay={`${cornerRadius}px`}
                />
              </div>
              <div className="w-24">
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
      </CardContent>
    </Card>
  );
};
