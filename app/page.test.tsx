import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the page title', () => {
    render(<Home />);
    expect(screen.getByText(/Artstation Critic/i)).toBeInTheDocument();
  });

  it('shows the upload area with label', () => {
    render(<Home />);
    // 测试：应该有 Dropzone 上传区域（中文提示）
    expect(screen.getByText(/拖拽图片或 Ctrl\+V 粘贴/i)).toBeInTheDocument();
    expect(screen.getByText(/支持 JPG、PNG、WebP/i)).toBeInTheDocument();
  });

  it('shows critique results when available', () => {
    // 测试：点评结果页面应该显示维度分数
    render(<Home />);
    // 暂时跳过，等实现点评结果组件后再测试
  });
});
