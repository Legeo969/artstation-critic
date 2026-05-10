import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone, DropzoneProps } from './Dropzone';

describe('Dropzone', () => {
  const defaultProps: DropzoneProps = {
    onFileSelect: vi.fn(),
    onError: vi.fn(),
  };

  it('应该显示默认的上传提示', () => {
    render(<Dropzone {...defaultProps} />);
    expect(screen.getByText(/拖拽图片或 Ctrl\+V 粘贴/i)).toBeInTheDocument();
  });

  it('应该显示拖拽状态样式', () => {
    render(<Dropzone {...defaultProps} />);
    const dropzone = screen.getByRole('button');
    
    // 模拟拖拽进入
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    
    expect(dropzone).toHaveClass('border-emerald-500');
    expect(dropzone).toHaveClass('bg-emerald-50/50');
  });

  it('应该处理拖拽文件上传', () => {
    const onFileSelect = vi.fn();
    render(<Dropzone {...defaultProps} onFileSelect={onFileSelect} />);
    
    const dropzone = screen.getByRole('button');
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('应该拒绝非图片文件', () => {
    const onError = vi.fn();
    render(<Dropzone {...defaultProps} onError={onError} />);
    
    const dropzone = screen.getByRole('button');
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    expect(onError).toHaveBeenCalledWith('请选择图片文件');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('应该处理剪贴板粘贴图片', () => {
    const onFileSelect = vi.fn();
    const onError = vi.fn();
    
    // Mock clipboard API
    const mockFile = new File(['test'], 'pasted-image.png', { type: 'image/png' });
    const mockClipboardItems = [
      {
        type: 'image/png',
        getAsFile: () => mockFile,
      },
    ];
    
    Object.assign(navigator, {
      clipboard: {
        read: vi.fn().mockResolvedValue(mockClipboardItems),
      },
    });
    
    render(<Dropzone {...defaultProps} onFileSelect={onFileSelect} onError={onError} />);
    
    const dropzone = screen.getByRole('button');
    
    // 模拟粘贴事件
    fireEvent.paste(dropzone, {
      clipboardData: {
        items: mockClipboardItems,
      },
    });
    
    expect(onFileSelect).toHaveBeenCalledWith(mockFile);
  });

  it('应该在粘贴空剪贴板时调用 onError', () => {
    const onError = vi.fn();
    render(<Dropzone {...defaultProps} onError={onError} />);
    
    const dropzone = screen.getByRole('button');
    
    fireEvent.paste(dropzone, {
      clipboardData: {
        items: [],
      },
    });
    
    expect(onError).toHaveBeenCalledWith('剪贴板中没有图片');
  });

  it('应该在文件过大时调用 onError', () => {
    const onError = vi.fn();
    render(<Dropzone {...defaultProps} onError={onError} maxSizeMB={1} />);
    
    const dropzone = screen.getByRole('button');
    // 创建 2MB 的文件
    const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [largeFile],
      },
    });
    
    expect(onError).toHaveBeenCalledWith('图片大小不能超过 1MB');
  });

  it('应该支持自定义提示文本', () => {
    render(
      <Dropzone
        {...defaultProps}
        prompt="自定义提示文本"
      />
    );
    
    expect(screen.getByText('自定义提示文本')).toBeInTheDocument();
  });

  it('应该在拖拽离开时移除拖拽样式', () => {
    render(<Dropzone {...defaultProps} />);
    const dropzone = screen.getByRole('button');
    
    // 拖拽进入
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    expect(dropzone).toHaveClass('border-emerald-500');
    
    // 拖拽离开
    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveClass('border-emerald-500');
  });
});
