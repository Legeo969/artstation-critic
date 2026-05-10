import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadQueue } from './UploadQueue';
import type { UploadQueueItem } from '../lib/batch-upload';

const createMockItem = (overrides?: Partial<UploadQueueItem>): UploadQueueItem => ({
  id: 'test-id',
  file: new File(['test'], 'test.png', { type: 'image/png' }),
  status: 'success',
  ...overrides,
});

describe('UploadQueue', () => {
  it('应该不渲染空队列', () => {
    render(<UploadQueue items={[]} onRemove={vi.fn()} />);
    expect(screen.queryByText(/上传队列/i)).not.toBeInTheDocument();
  });

  it('应该显示队列头部信息', () => {
    const items = [
      createMockItem({ id: '1', status: 'success' }),
      createMockItem({ id: '2', status: 'success' }),
      createMockItem({ id: '3', status: 'failed', error: '错误' }),
    ];
    
    render(<UploadQueue items={items} onRemove={vi.fn()} />);
    
    expect(screen.getByText('上传队列 (3)')).toBeInTheDocument();
    expect(screen.getByText('✓ 2 完成')).toBeInTheDocument();
    expect(screen.getByText('✗ 1 失败')).toBeInTheDocument();
  });

  it('应该显示处理中状态', () => {
    const items = [
      createMockItem({ id: '1', status: 'uploading' }),
    ];
    
    render(<UploadQueue items={items} onRemove={vi.fn()} />);
    
    expect(screen.getByText('⏳ 1 处理中')).toBeInTheDocument();
  });

  it('应该显示成功项的查看按钮', () => {
    const items = [createMockItem({ id: '1', status: 'success' })];
    const onViewResult = vi.fn();
    
    render(<UploadQueue items={items} onRemove={vi.fn()} onViewResult={onViewResult} />);
    
    expect(screen.getByText('查看')).toBeInTheDocument();
  });

  it('点击查看应该调用回调', () => {
    const items = [createMockItem({ id: '1', status: 'success' })];
    const onViewResult = vi.fn();
    
    render(<UploadQueue items={items} onRemove={vi.fn()} onViewResult={onViewResult} />);
    
    fireEvent.click(screen.getByText('查看'));
    expect(onViewResult).toHaveBeenCalledTimes(1);
  });

  it('点击移除应该调用回调', () => {
    const items = [createMockItem({ id: '1' })];
    const onRemove = vi.fn();
    
    render(<UploadQueue items={items} onRemove={onRemove} />);
    
    fireEvent.click(screen.getByLabelText('移除'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('应该显示失败错误信息', () => {
    const items = [createMockItem({ id: '1', status: 'failed', error: '网络错误' })];
    
    render(<UploadQueue items={items} onRemove={vi.fn()} />);
    
    expect(screen.getByText('网络错误')).toBeInTheDocument();
  });

  it('应该显示文件大小', () => {
    const items = [createMockItem({ id: '1', file: new File(['test'], 'test.png', { type: 'image/png' }) })];
    
    render(<UploadQueue items={items} onRemove={vi.fn()} />);
    
    expect(screen.getByText(/KB/i)).toBeInTheDocument();
  });

  it('应该显示清除失败项按钮', () => {
    const items = [createMockItem({ id: '1', status: 'failed' })];
    const onClearFailed = vi.fn();
    
    render(<UploadQueue items={items} onRemove={vi.fn()} onClearFailed={onClearFailed} />);
    
    expect(screen.getByText('清除失败项')).toBeInTheDocument();
  });

  it('应该显示处理中图标', () => {
    const items = [createMockItem({ id: '1', status: 'uploading' })];
    
    render(<UploadQueue items={items} onRemove={vi.fn()} />);
    
    // 检查是否有旋转动画类（SVG 没有 aria-label，用 container 查询）
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
