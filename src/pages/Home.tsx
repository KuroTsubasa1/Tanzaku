import React, { useState } from 'react';
import { DropZone } from '../components/DropZone';
import { SliceControls } from '../components/SliceControls';
import { ImagePreview } from '../components/ImagePreview';
import { SliceActions } from '../components/SliceActions';
import { Button } from '../components/ui/Button';
import { RefreshCw, ScrollText } from 'lucide-react';
import { OperationLog } from '../utils/imageProcessor';

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sliceMode, setSliceMode] = useState<'width' | 'count'>('count');
  const [sliceWidth, setSliceWidth] = useState(100);
  const [sliceCount, setSliceCount] = useState(5);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // New State for Dual Mode & Industrial Features
  const [isDualMode, setIsDualMode] = useState(false);
  const [sliceHeight, setSliceHeight] = useState(100);
  const [verticalSliceCount, setVerticalSliceCount] = useState(4);
  const [logs, setLogs] = useState<OperationLog[]>([]);

  const handleImageDrop = (file: File) => {
    setImageFile(file);
    if (sliceMode === 'width') {
      setSliceWidth(100);
      setSliceHeight(100);
    } else {
      setSliceCount(5);
      setVerticalSliceCount(5);
    }
    setCornerRadius(0);
    setImageDimensions(null);
  };

  const handleReset = () => {
    setImageFile(null);
    setSliceWidth(100);
    setSliceCount(5);
    setSliceHeight(100);
    setVerticalSliceCount(5);
    setCornerRadius(0);
    setImageDimensions(null);
    setLogs([]);
  };

  const handleImageLoad = (width: number, height: number) => {
    setImageDimensions({ width, height });
    
    // Horizontal
    if (sliceMode === 'width') {
      let newWidth = sliceWidth;
      if (sliceWidth > width) {
        newWidth = Math.floor(width / 2);
        setSliceWidth(newWidth);
      }
      setSliceCount(Math.ceil(width / newWidth));
    } else {
      const count = sliceCount || 4;
      const newWidth = Math.ceil(width / count);
      setSliceWidth(Math.max(1, newWidth));
    }

    // Vertical
    if (sliceMode === 'width') {
      let newHeight = sliceHeight;
      if (sliceHeight > height) {
        newHeight = Math.floor(height / 2);
        setSliceHeight(newHeight);
      }
      setVerticalSliceCount(Math.ceil(height / newHeight));
    } else {
      const count = verticalSliceCount || 4;
      const newHeight = Math.ceil(height / count);
      setSliceHeight(Math.max(1, newHeight));
    }
  };

  const handleWidthChange = (width: number) => {
    setSliceWidth(width);
    if (imageDimensions) {
      setSliceCount(Math.ceil(imageDimensions.width / width));
    }
  };

  const handleCountChange = (count: number) => {
    setSliceCount(count);
    if (imageDimensions) {
      const newWidth = Math.ceil(imageDimensions.width / count);
      setSliceWidth(Math.max(1, newWidth));
    }
  };

  const handleHeightChange = (height: number) => {
    setSliceHeight(height);
    if (imageDimensions) {
      setVerticalSliceCount(Math.ceil(imageDimensions.height / height));
    }
  };

  const handleVerticalCountChange = (count: number) => {
    setVerticalSliceCount(count);
    if (imageDimensions) {
      const newHeight = Math.ceil(imageDimensions.height / count);
      setSliceHeight(Math.max(1, newHeight));
    }
  };

  const handleModeChange = (mode: 'width' | 'count') => {
    setSliceMode(mode);
    if (imageDimensions) {
      if (mode === 'width') {
        setSliceCount(Math.ceil(imageDimensions.width / sliceWidth));
        setVerticalSliceCount(Math.ceil(imageDimensions.height / sliceHeight));
      } else {
        setSliceCount(Math.ceil(imageDimensions.width / sliceWidth));
        setVerticalSliceCount(Math.ceil(imageDimensions.height / sliceHeight));
      }
    }
  };
  
  const handleLogGenerated = (log: OperationLog) => {
    setLogs(prev => [log, ...prev]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-washi/85 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 animate-seal-in items-center justify-center rounded-lg bg-shu text-paper shadow-seal">
              <span className="font-display text-lg font-bold leading-none">短</span>
            </div>
            <div className="leading-none">
              <h1 className="font-display text-xl font-bold tracking-tight text-sumi">
                Tanzaku
              </h1>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-sumi-faint">
                Image Slicer
              </span>
            </div>
          </div>
          {imageFile && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 py-10">
        {!imageFile ? (
          <div className="mx-auto mt-10 max-w-2xl animate-rise-in">
            <div className="mb-9 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-shu">
                短冊 · paper strips
              </p>
              <h2 className="mb-4 font-display text-4xl font-bold leading-tight text-sumi sm:text-5xl">
                Slice images into
                <br />
                clean strips.
              </h2>
              <p className="mx-auto max-w-md text-base text-sumi-soft">
                Drop an image to cut it into equal strips or a full grid — for carousels,
                sprite sheets, and prints. Everything stays in your browser.
              </p>
            </div>
            <DropZone onImageDrop={handleImageDrop} />
          </div>
        ) : (
          <div className="grid animate-rise-in items-start gap-8 lg:grid-cols-12">
            {/* Sidebar Controls (Desktop) */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
              <SliceControls
                mode={sliceMode}
                onModeChange={handleModeChange}
                sliceWidth={sliceWidth}
                onSliceWidthChange={handleWidthChange}
                sliceCount={sliceCount}
                onSliceCountChange={handleCountChange}
                cornerRadius={cornerRadius}
                onCornerRadiusChange={setCornerRadius}
                imageWidth={imageDimensions?.width || 1000}
                imageHeight={imageDimensions?.height || 1000}
                
                isDualMode={isDualMode}
                onDualModeChange={setIsDualMode}
                sliceHeight={sliceHeight}
                onSliceHeightChange={handleHeightChange}
                verticalSliceCount={verticalSliceCount}
                onVerticalSliceCountChange={handleVerticalCountChange}
              />
              
              <div className="hidden lg:block">
                 <SliceActions
                  imageFile={imageFile}
                  sliceWidth={sliceWidth}
                  cornerRadius={cornerRadius}
                  disabled={!imageDimensions}
                  isDualMode={isDualMode}
                  sliceHeight={sliceHeight}
                  onLogGenerated={handleLogGenerated}
                />
              </div>

              {/* Logs Section */}
              {logs.length > 0 && (
                <div className="mt-6 hidden rounded-xl border border-line bg-paper p-4 shadow-paper-sm lg:block">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-sumi-soft">
                    <ScrollText className="h-3.5 w-3.5 text-shu" />
                    Operation Log
                  </div>
                  <div className="tz-scroll max-h-60 space-y-2 overflow-y-auto pr-1 text-xs">
                    {logs.map((log, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-line-soft bg-washi/50 p-2.5"
                      >
                        <div className="flex justify-between font-medium">
                          <span
                            className={`font-mono uppercase tracking-wide ${
                              log.status === 'completed' ? 'text-matcha' : 'text-shu-deep'
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="font-mono text-sumi-faint">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="mt-1 text-sumi-soft">
                          {log.mode === 'grid' ? 'Dual axis' : 'Single axis'} ·{' '}
                          <span className="font-mono">{log.totalSlices}</span> slices ·{' '}
                          <span className="font-mono">{log.durationMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8 space-y-6">
              <ImagePreview
                imageFile={imageFile}
                sliceWidth={sliceWidth}
                isDualMode={isDualMode}
                sliceHeight={sliceHeight}
                cornerRadius={cornerRadius}
                onImageLoad={handleImageLoad}
              />
              
              {/* Mobile Actions */}
              <div className="lg:hidden">
                <SliceActions
                  imageFile={imageFile}
                  sliceWidth={sliceWidth}
                  cornerRadius={cornerRadius}
                  disabled={!imageDimensions}
                  isDualMode={isDualMode}
                  sliceHeight={sliceHeight}
                  onLogGenerated={handleLogGenerated}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-line py-8">
        <div className="container mx-auto flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sumi-faint">
            短冊 — client-side only · nothing leaves your device
          </p>
          <p className="text-xs text-sumi-soft">© {new Date().getFullYear()} Tanzaku</p>
        </div>
      </footer>
    </div>
  );
}
