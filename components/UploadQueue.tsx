'use client';

import React from 'react';
import type { UploadQueueItem } from '../lib/batch-upload';

export interface UploadQueueProps {
  /** 队列项列表 */
  items: UploadQueueItem[];
  /** 移除项回调 */
  onRemove: (id: string) => void;
  /** 查看结果回调 */
  onViewResult?: (item: UploadQueueItem) => void;
  /** 清空失败项回调 */
  onClearFailed?: () => void;
}

export const UploadQueue: React.FC<UploadQueueProps> = ({
  items,
  onRemove,
  onViewResult,
  onClearFailed,
}) => {
  if (items.length === 0) {
    return null;
  }

  const successCount = items.filter(i => i.status === 'success').length;
  const failedCount = items.filter(i => i.status === 'failed').length;
  const processingCount = items.filter(i => i.status === 'uploading').length;

  return (
    <div className="space-y-3">
      {/* 队列头部 */}
      <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            上传队列 ({items.length})
          </span>
          {successCount > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✓ {successCount} 完成
            </span>
          )}
          {failedCount > 0 && (
            <span className="text-xs text-red-600 dark:text-red-400">
              ✗ {failedCount} 失败
            </span>
          )}
          {processingCount > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              ⏳ {processingCount} 处理中
            </span>
          )}
        </div>
        {failedCount > 0 && onClearFailed && (
          <button
            onClick={onClearFailed}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            清除失败项
          </button>
        )}
      </div>

      {/* 队列项列表 */}
      <div className="space-y-2">
        {items.map(item => (
          <QueueItem
            key={item.id}
            item={item}
            onRemove={() => onRemove(item.id)}
            onViewResult={() => onViewResult?.(item)}
          />
        ))}
      </div>
    </div>
  );
};

interface QueueItemProps {
  item: UploadQueueItem;
  onRemove: () => void;
  onViewResult: () => void;
}

const QueueItem: React.FC<QueueItemProps> = ({ item, onRemove, onViewResult }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'uploading':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
      {/* 状态图标 */}
      <div className="flex-shrink-0">
        {getStatusIcon()}
      </div>

      {/* 文件信息 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {item.file.name}
        </p>
        {item.status === 'failed' && item.error && (
          <p className="text-xs text-red-500 mt-1">{item.error}</p>
        )}
        {item.status === 'uploading' && (
          <p className="text-xs text-blue-500 mt-1">处理中...</p>
        )}
      </div>

      {/* 文件大小 */}
      <div className="flex-shrink-0 text-xs text-zinc-500">
        {(item.file.size / 1024).toFixed(1)} KB
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 flex gap-2">
        {item.status === 'success' && onViewResult && (
          <button
            onClick={onViewResult}
            className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            查看
          </button>
        )}
        <button
          onClick={onRemove}
          className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          aria-label="移除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UploadQueue;
