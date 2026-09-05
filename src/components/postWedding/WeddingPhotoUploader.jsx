"use client";

import { useDropzone } from 'react-dropzone';
import { Photo, Upload } from '@/components/Icons';

const acceptedImageTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export default function WeddingPhotoUploader({ disabled, onFilesAccepted, onFilesRejected }) {
  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    accept: acceptedImageTypes,
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) onFilesAccepted(acceptedFiles);
      if (fileRejections.length) onFilesRejected(fileRejections);
    },
  });

  return (
    <div {...getRootProps({ className: `border-2 border-dashed p-6 text-center transition-colors sm:p-8 ${isDragActive ? 'border-wine-500 bg-wine-50' : 'border-gold-300 bg-gold-100/25'} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-copy hover:border-wine-400 hover:bg-wine-50/60'}` })}>
      <input {...getInputProps()} disabled={disabled} />
      <Photo className="mx-auto h-9 w-9 text-wine-600" />
      <p className="mt-3 text-sm font-semibold text-wine-700">{isDragActive ? 'Drop your photos here' : 'Drag & drop your photos here'}</p>
      <p className="mt-1 text-xs text-ink-soft">JPG, JPEG, PNG, or WEBP up to 10 MB each</p>
      <p className="my-3 text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">or</p>
      <button type="button" onClick={open} disabled={disabled} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-wine-300 bg-white px-4 text-sm font-semibold text-wine-700 transition-colors hover:bg-wine-50 disabled:cursor-not-allowed">
        <Upload className="h-4 w-4" />
        Browse Photos
      </button>
    </div>
  );
}