import React, { useState } from 'react';
import { DropZone } from '../components/DropZone';
import { SliceControls } from '../components/SliceControls';
import { ImagePreview } from '../components/ImagePreview';
import { SliceActions } from '../components/SliceActions';
import { Button } from '../components/ui/Button';
import { Scissors, RefreshCw, FileText } from 'lucide-react';
import { OperationLog } from '../utils/imageProcessor';

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sliceMode, setSliceMode] = useState<'width' | 'count'>('width');
  const [sliceWidth, setSliceWidth] = useState(100);
  const [sliceCount, setSliceCount] = useState(10);
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
      setSliceCount(4);
      setVerticalSliceCount(4);
    }
    setCornerRadius(0);
    setImageDimensions(null);
  };

  const handleReset = () => {
    setImageFile(null);
    setSliceWidth(100);
    setSliceCount(4);
    setSliceHeight(100);
    setVerticalSliceCount(4);
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
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <Scissors className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Tanzaku
            </h1>
          </div>
          {imageFile && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-500 hover:text-red-500">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!imageFile ? (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Slice images instantly</h2>
              <p className="text-lg text-zinc-600">
                Drag and drop your image to slice it into equal width strips. 
                Perfect for Instagram carousels, web sprites, and more.
              </p>
            </div>
            <DropZone onImageDrop={handleImageDrop} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Controls (Desktop) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
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
                <div className="hidden lg:block bg-white rounded-lg border border-zinc-200 p-4 mt-6">
                   <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-700">
                     <FileText className="h-4 w-4" />
                     Operation Logs
                   </div>
                   <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                     {logs.map((log, i) => (
                       <div key={i} className="p-2 bg-zinc-50 rounded border border-zinc-100">
                         <div className="flex justify-between font-medium">
                           <span className={log.status === 'completed' ? 'text-green-600' : 'text-red-600'}>
                             {log.status.toUpperCase()}
                           </span>
                           <span className="text-zinc-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                         </div>
                         <div className="mt-1 text-zinc-600">
                           {log.mode === 'grid' ? 'Dual Axis' : 'Single Axis'} | {log.totalSlices} slices
                         </div>
                         <div className="text-zinc-500">
                           {log.durationMs}ms duration
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
      <footer className="py-8 text-center text-zinc-400 text-sm mt-auto border-t border-zinc-200">
        <p>© {new Date().getFullYear()} Tanzaku. Client-side processing only.</p>
      </footer>
    </div>
  );
}
