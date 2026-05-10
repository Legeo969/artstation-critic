import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processUploadQueue, getQueueStats, type UploadQueueItem } from './batch-upload';
import type { ArtworkCritique } from './critique';

const createMockCritique = (filename: string): ArtworkCritique => ({
  filename,
  timestamp: Date.now(),
  overallImpression: '这是一幅很好的作品',
  scores: { composition: 7, colorLighting: 7, mood: 7, technique: 7, narrative: 7, commercial: 7 },
  dimensions: {},
  strengths: ['优点'],
  improvements: ['改进'],
  keyRecommendation: '建议',
});

describe('batch-upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该处理多张图片上传', async () => {
    const files = [
      new File(['test1'], 'art1.png', { type: 'image/png' }),
      new File(['test2'], 'art2.png', { type: 'image/png' }),
      new File(['test3'], 'art3.png', { type: 'image/png' }),
    ];

    const mockFn = vi.fn().mockResolvedValue(createMockCritique('test.png'));

    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      files,
      mockFn,
      progressCallback
    );

    expect(results).toHaveLength(3);
    expect(results.every(r => r.status === 'success')).toBe(true);
    expect(progressCallback).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('应该限制最大上传数量为 5', async () => {
    const files = Array(10).fill(null).map((_, i) =>
      new File([`test${i}`], `art${i}.png`, { type: 'image/png' })
    );

    const mockFn = vi.fn().mockResolvedValue(createMockCritique('test.png'));

    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      files,
      mockFn,
      progressCallback,
      { maxFiles: 5 }
    );

    expect(results).toHaveLength(5);
    expect(progressCallback).toHaveBeenCalledTimes(5);
  });

  it('应该单个失败不影响其他图片', async () => {
    const files = [
      new File(['test1'], 'art1.png', { type: 'image/png' }),
      new File(['test2'], 'art2.png', { type: 'image/png' }),
      new File(['test3'], 'art3.png', { type: 'image/png' }),
    ];

    // 使用序列调用模拟
    const mockFn = vi.fn();
    mockFn.mockImplementation(() => {
      const callIndex = mockFn.mock.calls.length;
      if (callIndex === 1) { // 第二个调用（索引 1）失败
        return Promise.reject(new Error('API 错误'));
      }
      return Promise.resolve(createMockCritique('test.png'));
    });

    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      files,
      mockFn,
      progressCallback
    );

    // 应该返回 3 个结果（第 2 个失败）
    expect(results).toHaveLength(3);
    expect(results.filter(r => r.status === 'success')).toHaveLength(2);
    expect(results.filter(r => r.status === 'failed')).toHaveLength(1);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('应该报告正确的进度', async () => {
    const files = [
      new File(['test1'], 'art1.png', { type: 'image/png' }),
      new File(['test2'], 'art2.png', { type: 'image/png' }),
    ];

    const mockFn = vi.fn().mockResolvedValue(createMockCritique('test.png'));

    const progressCallback = vi.fn();
    await processUploadQueue(files, mockFn, progressCallback);

    expect(progressCallback).toHaveBeenCalledWith(1, 2);
    expect(progressCallback).toHaveBeenCalledWith(2, 2);
  });

  it('应该返回包含错误信息的队列项', async () => {
    const files = [
      new File(['test1'], 'art1.png', { type: 'image/png' }),
      new File(['test2'], 'art2.png', { type: 'image/png' }),
    ];

    const mockFn = vi.fn();
    mockFn.mockImplementation(() => {
      const callIndex = mockFn.mock.calls.length;
      if (callIndex === 1) {
        return Promise.reject(new Error('网络错误'));
      }
      return Promise.resolve(createMockCritique('test.png'));
    });

    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      files,
      mockFn,
      progressCallback
    );

    // 检查结果中包含错误信息
    expect(results.some(r => r.error)).toBe(true);
    expect(results.some(r => r.critique)).toBe(true);
    expect(results.find(r => r.status === 'failed')?.error).toBe('网络错误');
  });

  it('应该支持自定义最大文件数', async () => {
    const files = Array(5).fill(null).map((_, i) =>
      new File([`test${i}`], `art${i}.png`, { type: 'image/png' })
    );

    const mockFn = vi.fn().mockResolvedValue(createMockCritique('test.png'));

    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      files,
      mockFn,
      progressCallback,
      { maxFiles: 5 }
    );

    expect(results).toHaveLength(5);
  });

  it('应该处理空文件数组', async () => {
    const mockFn = vi.fn();
    const progressCallback = vi.fn();
    const results = await processUploadQueue(
      [],
      mockFn,
      progressCallback
    );

    expect(results).toHaveLength(0);
    expect(progressCallback).not.toHaveBeenCalled();
    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe('getQueueStats', () => {
  it('应该正确计算队列统计', () => {
    const queue: UploadQueueItem[] = [
      { id: '1', file: new File(['t1'], 'a.png'), status: 'success', critique: createMockCritique('a.png') },
      { id: '2', file: new File(['t2'], 'b.png'), status: 'success', critique: createMockCritique('b.png') },
      { id: '3', file: new File(['t3'], 'c.png'), status: 'failed', error: 'error' },
      { id: '4', file: new File(['t4'], 'd.png'), status: 'pending' },
    ];

    const stats = getQueueStats(queue);

    expect(stats).toEqual({
      total: 4,
      completed: 2,
      failed: 1,
      pending: 1,
      progress: 50,
    });
  });

  it('应该处理空队列', () => {
    const stats = getQueueStats([]);

    expect(stats).toEqual({
      total: 0,
      completed: 0,
      failed: 0,
      pending: 0,
      progress: 0,
    });
  });
});
