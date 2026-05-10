import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrendChart } from './TrendChart';
import type { ScoreTrend } from '../lib/trend-analysis';

const createMockTrend = (overrides?: Partial<ScoreTrend>): ScoreTrend => ({
  dimension: 'composition',
  label: '构图',
  scores: [7, 8, 9],
  timestamps: [1, 2, 3],
  labels: ['1 月 1 日', '1 月 2 日', '1 月 3 日'],
  change: 2,
  direction: 'up',
  color: '#3b82f6',
  ...overrides,
});

describe('TrendChart', () => {
  it('应该渲染维度选择器', () => {
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={['composition']}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    expect(screen.getByText('构图')).toBeInTheDocument();
  });

  it('应该高亮选中的维度', () => {
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={['composition']}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    const compositionBtn = screen.getByText(/构图/);
    expect(compositionBtn).toHaveClass('bg-zinc-900');
  });

  it('点击维度应该调用回调', () => {
    const onDimensionToggle = vi.fn();
    
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={[]}
        onDimensionToggle={onDimensionToggle}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText(/构图/));
    expect(onDimensionToggle).toHaveBeenCalledTimes(1);
  });

  it('应该显示平均分切换按钮', () => {
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={[]}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    expect(screen.getByText('平均分')).toBeInTheDocument();
  });

  it('点击平均分应该调用回调', () => {
    const onAverageToggle = vi.fn();
    
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={[]}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={onAverageToggle}
      />
    );
    
    fireEvent.click(screen.getByText('平均分'));
    expect(onAverageToggle).toHaveBeenCalledTimes(1);
  });

  it('应该显示空数据提示', () => {
    render(
      <TrendChart
        trends={[]}
        selectedDimensions={[]}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('应该显示图例说明', () => {
    render(
      <TrendChart
        trends={[createMockTrend()]}
        selectedDimensions={['composition']}
        onDimensionToggle={vi.fn()}
        showAverage={false}
        onAverageToggle={vi.fn()}
      />
    );
    
    expect(screen.getByText('📈 折线显示评分变化趋势')).toBeInTheDocument();
    expect(screen.getByText('🔴 虚线为 5 分及格线')).toBeInTheDocument();
  });
});
