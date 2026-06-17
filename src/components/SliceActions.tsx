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
    <div className="mt-2 flex flex-col gap-4">
      {isProcessing && (
        <div className="animate-rise-in space-y-2.5 rounded-lg border border-line bg-paper p-4 shadow-paper-sm">
          <div className="flex justify-between font-mono text-xs uppercase tracking-[0.12em] text-sumi-soft">
            <span>{statusText}</span>
            <span className="text-shu">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-shu transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {isProcessing ? (
          <Button
            size="lg"
            variant="destructive"
            onClick={handleEmergencyStop}
            className="w-full animate-pulse uppercase tracking-[0.15em]"
          >
            <Ban className="mr-2 h-5 w-5" />
            Emergency Stop
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleStartOperation}
            disabled={disabled || !imageFile}
            className="w-full"
          >
            <Scissors className="mr-2 h-5 w-5" />
            {isDualMode ? 'Slice into Grid' : 'Slice Image'}
          </Button>
        )}
      </div>
    </div>
  );
};
