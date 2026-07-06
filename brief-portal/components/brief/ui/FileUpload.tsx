"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileArrowUp, FilePdf, X } from "@phosphor-icons/react";
import type { UploadedFile } from "@/lib/types";

interface FileUploadProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  files: UploadedFile[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
}

export function FileUpload({
  label,
  required,
  hint,
  error,
  accept,
  multiple = false,
  maxFiles = 1,
  files,
  onFilesSelected,
  onRemove,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canAddMore = files.length < maxFiles;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const remaining = maxFiles - files.length;
    const incoming = Array.from(fileList).slice(0, Math.max(remaining, 0));
    if (incoming.length > 0) onFilesSelected(incoming);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!canAddMore) return;
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-[11px] font-bold text-ink-soft">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </span>
        {hint && (
          <span className="label-mono text-[10px] text-ink-soft/70">{hint}</span>
        )}
      </div>

      {canAddMore && (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-150 ${
            isDragging
              ? "border-accent bg-accent-soft"
              : error
                ? "border-danger"
                : "border-border bg-surface-2 hover:border-accent/60"
          }`}
        >
          <FileArrowUp weight="bold" size={22} className="text-ink-soft" />
          <span className="text-sm text-ink-soft">
            <span className="font-medium text-accent">Cliquez</span> ou glissez un
            fichier ici
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
            className="sr-only"
            aria-invalid={Boolean(error)}
            aria-required={required}
          />
        </label>
      )}

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          <AnimatePresence initial={false}>
            {files.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-surface-2"
              >
                {item.file.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={`Aperçu de ${item.file.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1">
                    <FilePdf weight="bold" size={22} className="text-ink-soft" />
                    <span className="line-clamp-2 text-center text-[9px] text-ink-soft/80">
                      {item.file.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Retirer ${item.file.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <X weight="bold" size={12} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
