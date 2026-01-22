import JSZip from 'jszip';

export interface ProcessOptions {
  cornerRadius?: number;
  sliceHeight?: number;
  isDualMode?: boolean;
  signal?: AbortSignal;
  onProgress?: (progress: number, details: string) => void;
}

export interface OperationLog {
  timestamp: string;
  imageName: string;
  originalSize: { width: number; height: number };
  mode: 'vertical_strips' | 'grid';
  params: {
    sliceWidth: number;
    sliceHeight?: number;
    cornerRadius: number;
  };
  totalSlices: number;
  durationMs: number;
  status: 'completed' | 'aborted' | 'failed';
}

export const processImageSlices = async (
  imageFile: File,
  sliceWidth: number,
  options: ProcessOptions = {}
): Promise<{ blob: Blob; log: OperationLog }> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const { 
      cornerRadius = 0, 
      sliceHeight, 
      isDualMode = false, 
      signal, 
      onProgress 
    } = options;

    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = async () => {
      try {
        const { naturalWidth, naturalHeight } = img;
        
        const cols = Math.ceil(naturalWidth / sliceWidth);
        const actualSliceHeight = (isDualMode && sliceHeight) ? sliceHeight : naturalHeight;
        const rows = (isDualMode && sliceHeight) ? Math.ceil(naturalHeight / sliceHeight) : 1;
        const totalSlices = cols * rows;

        const zip = new JSZip();
        const folder = zip.folder('slices');

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        let processedCount = 0;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
             // Check for cancellation
             if (signal?.aborted) {
               throw new DOMException('Operation aborted', 'AbortError');
             }



             const x = col * sliceWidth;
             const y = row * actualSliceHeight;
             
             const availableWidth = Math.max(0, Math.min(sliceWidth, naturalWidth - x));
             const availableHeight = Math.max(0, Math.min(actualSliceHeight, naturalHeight - y));

             if (availableWidth > 0 && availableHeight > 0) {
                canvas.width = sliceWidth;
                canvas.height = actualSliceHeight;
                ctx.clearRect(0, 0, sliceWidth, actualSliceHeight);

                if (cornerRadius > 0) {
                  ctx.beginPath();
                  ctx.roundRect(0, 0, availableWidth, availableHeight, cornerRadius);
                  ctx.clip();
                }

                ctx.drawImage(
                  img,
                  x, y, availableWidth, availableHeight,
                  0, 0, availableWidth, availableHeight
                );

                const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png'));
                if (blob) {
                  let fileName;
                  if (isDualMode) {
                     const rStr = (row + 1).toString().padStart(Math.max(2, rows.toString().length), '0');
                     const cStr = (col + 1).toString().padStart(Math.max(2, cols.toString().length), '0');
                     fileName = `slice_r${rStr}_c${cStr}.png`;
                  } else {
                     const idx = (col + 1).toString().padStart(Math.max(2, cols.toString().length), '0');
                     fileName = `slice_${idx}.png`;
                  }
                  
                  folder?.file(fileName, blob);
                }
             }
             
             processedCount++;
             if (onProgress) {
               const pct = Math.round((processedCount / totalSlices) * 100);
               onProgress(pct, `Processing slice ${processedCount}/${totalSlices}`);
             }
          }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        
        const log: OperationLog = {
          timestamp: new Date().toISOString(),
          imageName: imageFile.name,
          originalSize: { width: naturalWidth, height: naturalHeight },
          mode: isDualMode ? 'grid' : 'vertical_strips',
          params: { sliceWidth, sliceHeight: isDualMode ? sliceHeight : undefined, cornerRadius },
          totalSlices: processedCount,
          durationMs: Date.now() - startTime,
          status: 'completed'
        };

        resolve({ blob: content, log });
        
      } catch (error: any) {
        reject(error);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};
