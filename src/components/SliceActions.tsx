import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Scissors, Ban } from 'lucide-react';
import { processImageSlices, OperationLog } from '../utils/imageProcessor';

interface SliceActionsProps {
  imageFile: File | null;
  sliceWidth: number;
  cornerRadius?: number;
  disabled?: boolean;
  
  // New props
  isDualMode: boolean;
  sliceHeight?: number;
  onLogGenerated: (log: OperationLog) => void;
}

export const SliceActions: React.FC<SliceActionsProps> = ({
  imageFile,
  sliceWidth,
  cornerRadius = 0,
  disabled,
  isDualMode,
  sliceHeight,
  onLogGenerated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStartOperation = async () => {
    if (!imageFile) return;



    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing...');
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const { blob: zipBlob, log } = await processImageSlices(imageFile, sliceWidth, {
        cornerRadius,
        isDualMode,
        sliceHeight,
        signal: controller.signal,
        onProgress: (pct, text) => {
          setProgress(pct);
          setStatusText(text);
        }
      });
      
      onLogGenerated(log);

      // Download
      const fileName = imageFile.name.split('.')[0] + (isDualMode ? '_grid_slices.zip' : '_slices.zip');
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setStatusText('Operation Emergency Stopped');
      } else {
        console.error('Failed to slice image:', error);
        alert('Failed to slice image. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleEmergencyStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {isProcessing && (
        <div className="space-y-2 p-4 bg-zinc-50 rounded-lg border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
           <div className="flex justify-between text-sm font-medium text-zinc-700">
             <span>{statusText}</span>
             <span>{progress}%</span>
           </div>
           <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
             />
           </div>
        </div>
      )}
      
      <div className="flex gap-4 justify-end">
        {isProcessing ? (
           <Button
            size="lg"
            variant="destructive"
            onClick={handleEmergencyStop}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 animate-pulse"
          >
            <Ban className="mr-2 h-5 w-5" />
            EMERGENCY STOP
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleStartOperation}
            disabled={disabled || !imageFile}
            className="w-full sm:w-auto"
          >
            <Scissors className="mr-2 h-5 w-5" />
            {isDualMode ? 'Start Dual Slicing Operation' : 'Slice Image'}
          </Button>
        )}
      </div>
    </div>
  );
};
