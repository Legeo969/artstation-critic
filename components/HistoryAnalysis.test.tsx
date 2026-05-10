import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryAnalysis } from './HistoryAnalysis';
import type { ScoreHistory } from '../lib/trend-analysis';

function dim(score: number) {
  return { score, feedback: '评价' };
}

function makeDefaultDims() {
  return {
    composition: dim(7),
    colorLighting: dim(7),
    moodAtmosphere: dim(7),
    technique: dim(7),
    narrative: dim(7),
    commercialViability: dim(7),
  };
}

const createMockHistory = (overrides?: Partial<ScoreHistory>): ScoreHistory => ({
  filename: 'test.png',
  timestamp: Date.now(),
  overallImpression: '好',
  dimensions: makeDefaultDims(),
  strengths: [],
  improvements: [],
  keyRecommendation: '',
  ...overrides,
} as ScoreHistory);

describe('HistoryAnalysis', () => {
  it('应该显示作品文件名和记录数', () => {
    render(
      <HistoryAnalysis
        history={[createMockHistory()]}
        filename="art.png"
      />
    );
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('art.png');
    expect(screen.getByText('共 1 次点评记录')).toBeInTheDocument();
  });

  it('应该显示进步概览卡片', () => {
    render(
      <HistoryAnalysis
        history={[
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(5), colorLighting: dim(5), moodAtmosphere: dim(5), technique: dim(5), narrative: dim(5), commercialViability: dim(5) } }),
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(7), colorLighting: dim(7), moodAtmosphere: dim(7), technique: dim(7), narrative: dim(7), commercialViability: dim(7) } }),
        ]}
        filename="art.png"
      />
    );
    
    // 使用 getAllByText 因为多个地方有 "构图"
    const compositionElements = screen.getAllByText('构图');
    expect(compositionElements.length).toBeGreaterThan(0);
    // 显示的是进步（📈）或退步（📉）图标
    const declineIcons = screen.getAllByText('📉');
    expect(declineIcons.length).toBeGreaterThan(0);
  });

  it('应该显示最佳记录', () => {
    render(
      <HistoryAnalysis
        history={[
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(5), colorLighting: dim(5), moodAtmosphere: dim(5), technique: dim(5), narrative: dim(5), commercialViability: dim(5) } }),
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(9), colorLighting: dim(9), moodAtmosphere: dim(9), technique: dim(9), narrative: dim(9), commercialViability: dim(9) } }),
        ]}
        filename="art.png"
      />
    );
    
    expect(screen.getByText('🏆 最佳记录')).toBeInTheDocument();
    // 最佳记录应该是 9.0
    expect(screen.getByText('9.0')).toBeInTheDocument();
  });

  it('应该显示最低记录', () => {
    render(
      <HistoryAnalysis
        history={[
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(3), colorLighting: dim(3), moodAtmosphere: dim(3), technique: dim(3), narrative: dim(3), commercialViability: dim(3) } }),
          createMockHistory({ dimensions: { ...makeDefaultDims(), composition: dim(7), colorLighting: dim(7), moodAtmosphere: dim(7), technique: dim(7), narrative: dim(7), commercialViability: dim(7) } }),
        ]}
        filename="art.png"
      />
    );
    
    expect(screen.getByText('⚠️ 最低记录')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });

  it('应该显示趋势图表容器', () => {
    render(
      <HistoryAnalysis
        history={[createMockHistory()]}
        filename="art.png"
      />
    );
    
    // 检查趋势图组件已渲染（通过维度选择器验证）
    expect(screen.getByText('构图')).toBeInTheDocument();
  });

  it('应该显示提示框', () => {
    render(
      <HistoryAnalysis
        history={[createMockHistory()]}
        filename="art.png"
      />
    );
    
    expect(screen.getByText(/多次上传同一作品可以追踪进步轨迹/)).toBeInTheDocument();
  });

  it('应该处理空历史', () => {
    render(
      <HistoryAnalysis
        history={[]}
        filename="art.png"
      />
    );
    
    expect(screen.getByText('共 0 次点评记录')).toBeInTheDocument();
  });

  it('应该显示多个记录', () => {
    render(
      <HistoryAnalysis
        history={[
          createMockHistory({ timestamp: 1 }),
          createMockHistory({ timestamp: 2 }),
          createMockHistory({ timestamp: 3 }),
        ]}
        filename="art.png"
      />
    );
    
    expect(screen.getByText('共 3 次点评记录')).toBeInTheDocument();
  });
});
