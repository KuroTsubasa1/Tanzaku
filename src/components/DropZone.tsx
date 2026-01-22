import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './ui/Card';

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
    <Card
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center p-12 text-center h-[300px]',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-300 hover:border-blue-400 hover:bg-zinc-50',
        isDragReject && 'border-red-500 bg-red-50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={cn('p-4 rounded-full', isDragActive ? 'bg-blue-100' : 'bg-zinc-100')}>
          {isDragActive ? (
            <Upload className="h-8 w-8 text-blue-500" />
          ) : (
            <FileImage className="h-8 w-8 text-zinc-500" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-zinc-900">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-sm text-zinc-500">or click to select a file</p>
        </div>
        <p className="text-xs text-zinc-400">Supports JPG, PNG, GIF, WebP up to 50MB</p>
      </div>
    </Card>
  );
};
