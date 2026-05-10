'use client';

import React, { useState, useCallback, useRef } from 'react';

export interface DropzoneProps {
  /** 文件选择回调 */
  onFileSelect: (file: File) => void;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 上传提示文本 */
  prompt?: string;
  /** 最大文件大小（MB） */
  maxSizeMB?: number;
  /** 允许的文件类型 */
  accept?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  onError,
  prompt = '拖拽图片或 Ctrl+V 粘贴',
  maxSizeMB = 10,
  accept = 'image/*',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        onError?.('请选择图片文件');
        return false;
      }

      // 检查文件大小
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        onError?.(`图片大小不能超过 ${maxSizeMB}MB`);
        return false;
      }

      return true;
    },
    [onError, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget === e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) {
        onError?.('剪贴板中没有图片');
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            return;
          }
        }
      }

      onError?.('剪贴板中没有图片');
    },
    [handleFile, onError]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Paste will be handled by onPaste
      }
      if (e.key === 'Enter' || e.key === ' ') {
        fileInputRef.current?.click();
      }
    },
    []
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
        // Reset input value to allow re-selecting same file
        e.target.value = '';
      }
    },
    [handleFile]
  );

  return (
    <div className="relative w-full">
      {/* 隐藏的 file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="上传图片区域"
        aria-describedby="dropzone-help"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          relative flex flex-col items-center justify-center
          min-h-[220px] px-6 py-10
          border-2 border-dashed rounded-2xl
          transition-all duration-300 ease-out
          cursor-pointer
          group
          ${isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 scale-[1.02]'
            : isFocused
              ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-400/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }
        `}
      >
        {/* 拖拽图标 - 带浮动动画 */}
        <div
          className={`
            mb-4 transition-all duration-300
            ${isDragging ? 'scale-110 animate-float' : 'group-hover:scale-105'}
          `}
        >
          <svg
            className={`
              w-14 h-14 transition-colors duration-300
              ${isDragging
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500'
              }
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        {/* 主提示文本 */}
        <p className="text-center">
          <span
            className={`
              font-semibold text-lg transition-colors duration-300
              ${isDragging
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-zinc-700 dark:text-zinc-200'
              }
            `}
          >
            {isDragging ? '松开以上传' : prompt}
          </span>
        </p>

        {/* 支持格式提示 */}
        <p
          id="dropzone-help"
          className="mt-3 text-sm text-zinc-500 dark:text-zinc-400"
        >
          支持 JPG、PNG、WebP，最大 {maxSizeMB}MB
        </p>

        {/* 拖拽时的视觉反馈 */}
        {isDragging && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in"
          >
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-elevated">
              ✨ 松开以上传
            </div>
          </div>
        )}

        {/* 焦点环 */}
        {isFocused && !isDragging && (
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default Dropzone;
