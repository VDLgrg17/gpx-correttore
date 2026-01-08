import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ onFilesSelected, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        file => file.name.endsWith('.docx') || file.name.endsWith('.txt')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
        isDragging 
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
          : "border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".docx,.txt"
        className="hidden"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isDragging ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
        )}>
          <UploadCloud size={24} />
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Clicca o trascina qui i tuoi file
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supporta .docx e .txt (anche multipli)
          </p>
        </div>
      </div>
    </div>
  );
}

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
        File Selezionati ({files.length})
      </p>
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`}
            className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm group"
          >
            <div className="flex items-center gap-2 truncate">
              <FileIcon size={14} className="text-blue-500 flex-shrink-0" />
              <span className="truncate text-slate-700 dark:text-slate-300">{file.name}</span>
              <span className="text-xs text-slate-400 flex-shrink-0">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
