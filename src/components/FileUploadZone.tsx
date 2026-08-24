import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import FilePermissionHelperModal from './FilePermissionHelperModal';

export interface UploadedAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 data URL
  isImage: boolean;
  isPdf: boolean;
}

interface FileUploadZoneProps {
  onFileSelect: (attachment: UploadedAttachment | null) => void;
  currentAttachment?: UploadedAttachment | null;
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
  compact?: boolean;
}

export default function FileUploadZone({
  onFileSelect,
  currentAttachment,
  accept = 'image/*, application/pdf',
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  label = 'Upload Diagram, Question Photo, or PDF Notes',
  compact = false
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File size is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setErrorMessage('Please upload a valid Image (JPG, PNG, WEBP) or PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onFileSelect({
        name: file.name,
        size: file.size,
        type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        dataUrl,
        isImage,
        isPdf
      });
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read selected file. Please verify file permissions.');
      setShowPermissionModal(true);
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setErrorMessage(null);
  };

  if (compact) {
    return (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />

        {currentAttachment ? (
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-200">
            {currentAttachment.isImage ? (
              <img
                src={currentAttachment.dataUrl}
                alt="Preview"
                className="w-6 h-6 rounded object-cover border border-blue-300"
              />
            ) : (
              <FileText className="w-5 h-5 text-rose-500" />
            )}
            <span className="font-semibold truncate max-w-[200px]">{currentAttachment.name}</span>
            <span className="text-[10px] text-blue-500 font-mono">
              ({(currentAttachment.size / 1024).toFixed(0)} KB)
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-auto p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 font-bold"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-500 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Attach diagram or PDF"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Attach Diagram / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPermissionModal(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="File & Gallery Permissions Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FilePermissionHelperModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          type="upload"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {currentAttachment ? (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {currentAttachment.isImage ? (
              <img
                src={currentAttachment.dataUrl}
                alt="Uploaded Preview"
                className="w-12 h-12 rounded-xl object-cover border border-blue-300 shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{currentAttachment.name}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {(currentAttachment.size / (1024 * 1024)).toFixed(2)} MB • {currentAttachment.type}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-200 transition font-bold text-xs flex items-center gap-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <UploadCloud className="w-6 h-6" />
            <Camera className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Click to select from <strong>Camera / Gallery</strong> or Drag & Drop file here
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG, PNG, WEBP</span>
            <span>•</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF Documents</span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowPermissionModal(true)}
            className="text-[11px] underline font-bold"
          >
            Need Help?
          </button>
        </div>
      )}

      <FilePermissionHelperModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        type="upload"
      />
    </div>
  );
}
