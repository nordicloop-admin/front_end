"use client";

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileText, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onImageSelected: (file: File) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  multiple?: boolean;
  language?: 'en' | 'sv';
  className?: string;
}

const translations = {
  en: {
    dragDrop: "Drag & drop files here, or click to select",
    selectFiles: "Select Files",
    selectImage: "Select Image", 
    maxSize: "Max file size",
    allowedTypes: "Allowed types",
    fileSelected: "file selected",
    filesSelected: "files selected",
    fileTooLarge: "File too large",
    invalidType: "Invalid file type",
    uploadError: "Upload error",
    removeFile: "Remove file"
  },
  sv: {
    dragDrop: "Dra & släpp filer här, eller klicka för att välja",
    selectFiles: "Välj Filer",
    selectImage: "Välj Bild",
    maxSize: "Max filstorlek",
    allowedTypes: "Tillåtna typer", 
    fileSelected: "fil vald",
    filesSelected: "filer valda",
    fileTooLarge: "Filen är för stor",
    invalidType: "Ogiltig filtyp",
    uploadError: "Uppladdningsfel",
    removeFile: "Ta bort fil"
  }
};

const defaultAllowedTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv'
];

export function FileUpload({
  onFilesSelected,
  onImageSelected,
  maxFileSize = 50, // 50MB default
  allowedTypes = defaultAllowedTypes,
  multiple = true,
  language = 'en',
  className
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[language];

  const validateFile = useCallback((file: File): string | null => {
    // Check file size (convert MB to bytes)
    if (file.size > maxFileSize * 1024 * 1024) {
      return `${t.fileTooLarge}: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB > ${maxFileSize}MB)`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `${t.invalidType}: ${file.name} (${file.type})`;
    }

    return null;
  }, [maxFileSize, allowedTypes, t]);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    
    if (validFiles.length > 0) {
      if (!multiple) {
        setSelectedFiles([validFiles[0]]);
      } else {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      }
    }
  }, [validateFile, multiple]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        setErrors([error]);
      } else {
        setErrors([]);
        onImageSelected(file);
      }
    }
    // Reset input value
    e.target.value = '';
  }, [validateFile, onImageSelected]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onFilesSelected(selectedFiles);
      setSelectedFiles([]);
      setErrors([]);
    } catch (error) {
      setErrors([`${t.uploadError}: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles, onFilesSelected, t]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-[#FF8A00] bg-orange-50"
            : "border-gray-300 hover:border-gray-400",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-full bg-gray-100">
            {isUploading ? (
              <Loader2 size={24} className="text-gray-400 animate-spin" />
            ) : (
              <Upload size={24} className="text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {t.dragDrop}
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>{t.maxSize}: {maxFileSize}MB</p>
              <p>{t.allowedTypes}: Images, PDF, DOC, XLS, TXT</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <FileText size={16} className="mr-2" />
              {t.selectFiles}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                imageInputRef.current?.click();
              }}
            >
              <ImageIcon size={16} className="mr-2" />
              {t.selectImage}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageInputChange}
        className="hidden"
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {selectedFiles.length} {selectedFiles.length === 1 ? t.fileSelected : t.filesSelected}
            </p>
            <Button
              onClick={handleSendFiles}
              disabled={isUploading}
              size="sm"
              className="bg-[#FF8A00] hover:bg-[#e67700]"
            >
              {isUploading ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Upload size={14} className="mr-2" />
              )}
              Upload
            </Button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex items-center space-x-2">
                  {isImageFile(file) ? (
                    <ImageIcon size={16} className="text-blue-500" />
                  ) : (
                    <FileText size={16} className="text-gray-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  variant="ghost"
                  size="sm"
                  title={t.removeFile}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}