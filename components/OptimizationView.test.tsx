import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptimizationView } from './OptimizationView';

describe('OptimizationView', () => {
  const defaultProps = {
    originalImage: 'data:image/png;base64,test',
    optimizedImageUrl: 'https://example.com/optimized.png',
  };

  it('应该显示默认优化图标签', () => {
    render(<OptimizationView {...defaultProps} />);
    expect(screen.getByText('优化图')).toHaveClass('bg-zinc-900');
  });

  it('应该切换显示原图', () => {
    render(<OptimizationView {...defaultProps} />);
    
    const originalBtn = screen.getByText('原图');
    fireEvent.click(originalBtn);
    
    expect(originalBtn).toHaveClass('bg-zinc-900');
  });

  it('应该显示下载按钮', () => {
    render(<OptimizationView {...defaultProps} onDownload={vi.fn()} />);
    
    expect(screen.getByText('下载优化图')).toBeInTheDocument();
  });

  it('应该显示重新生成按钮', () => {
    render(<OptimizationView {...defaultProps} onRegenerate={vi.fn()} />);
    
    expect(screen.getByText('重新生成')).toBeInTheDocument();
  });

  it('应该显示关闭按钮', () => {
    render(<OptimizationView {...defaultProps} onClose={vi.fn()} />);
    
    expect(screen.getByText('关闭')).toBeInTheDocument();
  });

  it('应该显示生成中状态', () => {
    render(
      <OptimizationView
        {...defaultProps}
        isGenerating={true}
        generatingText="正在生成..."
      />
    );
    
    expect(screen.getByText('正在生成...')).toBeInTheDocument();
  });

  it('应该显示错误状态', () => {
    render(
      <OptimizationView
        {...defaultProps}
        error="生成失败"
        onRegenerate={vi.fn()}
      />
    );
    
    expect(screen.getByText('生成失败')).toBeInTheDocument();
    expect(screen.getByText('重新生成')).toBeInTheDocument();
  });

  it('不应该在生成中时显示图片', () => {
    render(
      <OptimizationView
        {...defaultProps}
        isGenerating={true}
      />
    );
    
    // 生成中时不显示图片，应该显示加载动画
    expect(screen.getByText('AI 正在生成优化图，请稍候...')).toBeInTheDocument();
  });

  it('应该显示原图', () => {
    const { container } = render(<OptimizationView {...defaultProps} />);
    
    // 点击原图标签
    fireEvent.click(screen.getByText('原图'));
    
    // 应该显示原图
    const img = container.querySelector('img[alt="原始作品"]');
    expect(img).toBeInTheDocument();
  });

  it('应该显示优化图', () => {
    const { container } = render(<OptimizationView {...defaultProps} />);
    
    // 默认显示优化图
    const img = container.querySelector('img[alt="优化作品"]');
    expect(img).toBeInTheDocument();
  });
});
