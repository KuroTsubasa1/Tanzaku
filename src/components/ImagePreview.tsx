import React, { useEffect, useState, useRef } from 'react';
import { Card } from './ui/Card';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from './ui/Button';

interface ImagePreviewProps {
  imageFile: File | null;
  sliceWidth: number;
  isDualMode?: boolean;
  sliceHeight?: number;
  onImageLoad: (width: number, height: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  sliceWidth,
  isDualMode = false,
  sliceHeight,
  onImageLoad,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
      setNaturalSize(null);
      setZoom(1);
    }
  }, [imageFile]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    onImageLoad(naturalWidth, naturalHeight);
  };

  if (!imageUrl) return null;

  const renderSliceLines = () => {
    if (!naturalSize || sliceWidth <= 0) return null;
    const { width, height } = naturalSize;
    const lines = [];
    
    // Vertical lines (Horizontal cuts along X axis)
    // Vertical lines separate horizontal segments.
    for (let x = sliceWidth; x < width; x += sliceWidth) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(59, 130, 246, 0.8)" 
          strokeWidth="2"
          strokeDasharray="4 2"
          className="pointer-events-auto hover:stroke-blue-600 hover:stroke-[3px] transition-all cursor-crosshair opacity-70 hover:opacity-100"
        />
      );
    }

    // Horizontal lines (Vertical cuts along Y axis)
    if (isDualMode && sliceHeight && sliceHeight > 0) {
      for (let y = sliceHeight; y < height; y += sliceHeight) {
        lines.push(
          <line
            key={`h-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="rgba(59, 130, 246, 0.8)" // Match vertical indicator color
            strokeWidth="2"
            strokeDasharray="4 2"
            className="pointer-events-auto hover:stroke-blue-600 hover:stroke-[3px] transition-all cursor-crosshair opacity-70 hover:opacity-100"
          />
        );
      }
    }

    return (
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Preview of ${lines.length} slice indicators`}
      >
        {lines}
      </svg>
    );
  };

  return (
    <Card className="overflow-hidden bg-zinc-50 border-zinc-200">
      <div className="p-2 border-b border-zinc-200 flex justify-between items-center bg-white">
        <span className="text-sm font-medium text-zinc-600">Preview</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs flex items-center min-w-[3rem] justify-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(1)}
            title="Reset Zoom"
            className="ml-1"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative overflow-auto flex justify-center items-start p-4 min-h-[300px] max-h-[600px]"
      >
        <div 
          className="relative shadow-md shrink-0"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out' 
          }}
        >
          <img
            src={imageUrl}
            alt="Preview"
            onLoad={handleImageLoad}
            className="max-w-none block"
            style={{ maxHeight: 'none' }} 
          />
          {renderSliceLines()}
        </div>
      </div>
    </Card>
  );
};
