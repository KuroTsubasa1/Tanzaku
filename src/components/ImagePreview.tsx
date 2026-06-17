import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { ZoomIn, ZoomOut, Maximize, Scissors } from 'lucide-react';
import { Button } from './ui/Button';

interface ImagePreviewProps {
  imageFile: File | null;
  sliceWidth: number;
  isDualMode?: boolean;
  sliceHeight?: number;
  cornerRadius?: number;
  onImageLoad: (width: number, height: number) => void;
}

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  sliceWidth,
  isDualMode = false,
  sliceHeight,
  cornerRadius = 0,
  onImageLoad,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      setZoom(1);
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

  // Build each slice as a rectangle in the image's own coordinate space. An SVG
  // viewBox of the natural size means every rect — and its corner radius — scales
  // exactly like the real exported slice, at any fit/zoom level.
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  let cols = 1;
  let rows = 1;

  if (naturalSize) {
    const { width, height } = naturalSize;
    const sw = sliceWidth > 0 ? sliceWidth : width;
    const sh = isDualMode && sliceHeight && sliceHeight > 0 ? sliceHeight : height;
    cols = Math.ceil(width / sw);
    rows = isDualMode && sliceHeight && sliceHeight > 0 ? Math.ceil(height / sh) : 1;

    for (let y = 0; y < height; y += sh) {
      for (let x = 0; x < width; x += sw) {
        cells.push({ x, y, w: Math.min(sw, width - x), h: Math.min(sh, height - y) });
      }
    }
  }

  const totalSlices = isDualMode ? cols * rows : cols;

  return (
    <Card className="overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-line bg-paper-soft/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-sumi-soft">
            Preview
          </span>
          {naturalSize && (
            <span className="hidden font-mono text-[0.7rem] text-sumi-faint sm:inline">
              {naturalSize.width}×{naturalSize.height}px
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-shu-soft/50 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-shu-deep">
            <Scissors className="h-3 w-3" />
            {totalSlices} {isDualMode ? 'tiles' : 'strips'}
          </span>

          <div className="flex items-center rounded-md border border-line bg-washi/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - 0.25).toFixed(2)))}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-[3.2rem] text-center font-mono text-xs tabular-nums text-sumi-soft">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + 0.25).toFixed(2)))}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none border-l border-line"
              onClick={() => setZoom(1)}
              title="Fit to view"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="tz-scroll relative flex max-h-[68vh] min-h-[320px] items-center justify-center overflow-auto p-6"
        style={{
          backgroundColor: '#EFE7D4',
          backgroundImage:
            'linear-gradient(45deg, rgba(33,28,22,0.04) 25%, transparent 25%, transparent 75%, rgba(33,28,22,0.04) 75%), linear-gradient(45deg, rgba(33,28,22,0.04) 25%, transparent 25%, transparent 75%, rgba(33,28,22,0.04) 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      >
        <div
          className="relative shrink-0 shadow-[0_10px_40px_-12px_rgba(33,28,22,0.55)]"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.18s ease-out',
          }}
        >
          <img
            src={imageUrl}
            alt="Preview"
            onLoad={handleImageLoad}
            className="block h-auto w-auto max-h-[60vh] max-w-full select-none"
            draggable={false}
          />

          {/* Cut guides — each slice drawn as a rounded tile so the corner
              radius is previewed exactly as it will be exported */}
          {naturalSize && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${naturalSize.width} ${naturalSize.height}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`${totalSlices} slice guides, ${cornerRadius}px corner radius`}
            >
              {cells.map((c, i) => (
                <rect
                  key={i}
                  x={c.x}
                  y={c.y}
                  width={c.w}
                  height={c.h}
                  rx={Math.min(cornerRadius, c.w / 2, c.h / 2)}
                  fill="none"
                  stroke="#C0392B"
                  strokeOpacity={0.85}
                  strokeWidth={1.25}
                  strokeDasharray="5 3"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
};
