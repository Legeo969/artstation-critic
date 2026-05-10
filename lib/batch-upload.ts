import type { ArtworkCritique } from './critique';

export interface UploadQueueItem {
  /** 唯一 ID */
  id: string;
  /** 文件对象 */
  file: File;
  /** 上传状态 */
  status: 'pending' | 'uploading' | 'success' | 'failed';
  /** 点评结果 */
  critique?: ArtworkCritique;
  /** 错误信息 */
  error?: string;
  /** 图片 base64 */
  base64?: string;
}

export interface BatchUploadOptions {
  /** 最大文件数量 */
  maxFiles?: number;
  /** 并发数 */
  concurrency?: number;
  /** 最大文件大小（MB） */
  maxSizeMB?: number;
}

export interface BatchUploadResult {
  /** 队列项 */
  item: UploadQueueItem;
  /** 是否成功 */
  success: boolean;
}

/**
 * 处理批量上传队列
 * 
 * @param files - 待上传的文件数组
 * @param critiqueFn - 点评函数
 * @param onProgress - 进度回调 (completed, total)
 * @param options - 上传选项
 * @returns 处理结果数组
 */
export async function processUploadQueue(
  files: File[],
  critiqueFn: (filename: string, base64: string, settings: any) => Promise<ArtworkCritique>,
  onProgress?: (completed: number, total: number) => void,
  options: BatchUploadOptions = {}
): Promise<UploadQueueItem[]> {
  const {
    maxFiles = 5,
    concurrency = 1, // 串行处理，避免 API 限流
    maxSizeMB = 10,
  } = options;

  // 限制文件数量
  const limitedFiles = files.slice(0, maxFiles);

  if (limitedFiles.length === 0) {
    return [];
  }

  // 创建队列项
  const queue: UploadQueueItem[] = limitedFiles.map(file => ({
    id: crypto.randomUUID(),
    file,
    status: 'pending',
  }));

  const results: UploadQueueItem[] = [];
  let completedCount = 0;

  // 串行处理（按顺序逐个上传）
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    item.status = 'uploading';

    try {
      // 验证文件
      const validation = validateFile(item.file);
      if (!validation.valid) {
        throw new Error(validation.error || '文件验证失败');
      }

      // 转换为 base64
      const base64 = await fileToBase64(item.file);
      item.base64 = base64;

      // 调用点评函数
      const critique = await critiqueFn(item.file.name, base64, {});
      
      item.status = 'success';
      item.critique = critique;
      results.push(item);
    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : '上传失败';
      results.push(item);
    }

    completedCount++;
    onProgress?.(completedCount, queue.length);
  }

  return results;
}

/**
 * 文件转 base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 验证文件
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '请选择图片文件' };
  }

  // 检查文件大小
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    return { valid: false, error: '图片大小不能超过 10MB' };
  }

  return { valid: true };
}

/**
 * 生成队列统计
 */
export function getQueueStats(queue: UploadQueueItem[]) {
  const total = queue.length;
  const completed = queue.filter(item => item.status === 'success').length;
  const failed = queue.filter(item => item.status === 'failed').length;
  const pending = queue.filter(item => item.status === 'pending' || item.status === 'uploading').length;

  return {
    total,
    completed,
    failed,
    pending,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * 清理失败项
 */
export function filterFailedItems(queue: UploadQueueItem[]): UploadQueueItem[] {
  return queue.filter(item => item.status !== 'failed');
}

/**
 * 获取成功项
 */
export function filterSuccessItems(queue: UploadQueueItem[]): UploadQueueItem[] {
  return queue.filter(item => item.status === 'success');
}
