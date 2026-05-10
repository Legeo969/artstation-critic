'use client';

import React, { useState, useCallback } from 'react';

export interface OptimizationViewProps {
  /** 原始图片 base64 */
  originalImage: string;
  /** 优化后图片 URL */
  optimizedImageUrl: string;
  /** 是否正在生成 */
  isGenerating?: boolean;
  /** 生成错误 */
  error?: string | null;
  /** 生成中进度文本 */
  generatingText?: string;
  /** 重新生成回调 */
  onRegenerate?: () => void;
  /** 关闭优化视图回调 */
  onClose?: () => void;
  /** 下载优化图回调 */
  onDownload?: (imageUrl: string) => void;
}

export const OptimizationView: React.FC<OptimizationViewProps> = ({
  originalImage,
  optimizedImageUrl,
  isGenerating = false,
  error = null,
  generatingText = 'AI 正在生成优化图，请稍候...',
  onRegenerate,
  onClose,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'optimized'>('optimized');

  const handleDownload = useCallback(async () => {
    if (!onDownload && optimizedImageUrl) {
      // 默认下载行为
      const link = document.createElement('a');
      link.href = optimizedImageUrl;
      link.download = `optimized-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (onDownload) {
      onDownload(optimizedImageUrl);
    }
  }, [optimizedImageUrl, onDownload]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重新生成
          </button>
        )}
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <div className="relative mb-6">
          {/* 加载动画 */}
          <div className="w-20 h-20 border-4 border-zinc-300 dark:border-zinc-600 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-green-500 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-center">{generatingText}</p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
          提示：此功能使用 GPT-4o 付费模型
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 标签切换 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('original')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'original'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          原图
        </button>
        <button
          onClick={() => setActiveTab('optimized')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'optimized'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          优化图
        </button>
      </div>

      {/* 图片对比区域 */}
      <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
        {activeTab === 'original' && (
          <img
            src={originalImage}
            alt="原始作品"
            className="w-full h-full object-contain"
          />
        )}
        {activeTab === 'optimized' && (
          <img
            src={optimizedImageUrl}
            alt="优化作品"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-3">
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新生成
          </button>
        )}
        {onDownload && optimizedImageUrl && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载优化图
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            关闭
          </button>
        )}
      </div>

      {/* 对比提示 */}
      <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>点击标签切换查看原图和优化图</span>
      </div>
    </div>
  );
};

export default OptimizationView;
