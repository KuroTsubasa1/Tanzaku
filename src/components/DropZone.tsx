import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Scissors } from 'lucide-react';
import { cn } from '../lib/utils';

interface DropZoneProps {
  onImageDrop: (file: File) => void;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onImageDrop, className }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageDrop(acceptedFiles[0]);
      }
    },
    [onImageDrop]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed bg-paper/70 p-14 text-center shadow-paper transition-all duration-200',
        isDragActive
          ? 'border-shu bg-shu-soft/40 scale-[1.01]'
          : 'border-line hover:border-shu/60 hover:bg-paper',
        isDragReject && 'border-shu-deep bg-shu-soft/60',
        className
      )}
    >
      <input {...getInputProps()} />

      {/* faint vertical strip motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #211C16 0 1px, transparent 1px 64px)',
        }}
      />

      <div className="relative flex flex-col items-center gap-5">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200',
            isDragActive
              ? 'bg-shu text-paper rotate-3 shadow-seal'
              : 'bg-washi text-shu group-hover:rotate-3 group-hover:scale-105'
          )}
        >
          {isDragActive ? <Upload className="h-7 w-7" /> : <Scissors className="h-7 w-7" />}
        </div>

        <div className="space-y-1.5">
          <p className="font-display text-xl font-semibold text-sumi">
            {isDragActive ? 'Release to begin' : 'Drop an image to slice'}
          </p>
          <p className="text-sm text-sumi-soft">
            or <span className="font-medium text-shu underline-offset-4 group-hover:underline">browse</span> your files
          </p>
        </div>

        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-sumi-faint">
          JPG · PNG · GIF · WEBP — up to 50MB
        </p>
      </div>
    </div>
  );
};
