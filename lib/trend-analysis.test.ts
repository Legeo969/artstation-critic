import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  groupByFilename, 
  getScoreTrends,
  type ScoreTrend,
  type ScoreHistory,
} from './trend-analysis';
import type { ArtworkCritique } from './critique';

function makeDim(score: number) {
  return { score, feedback: '评价' };
}

const createMockCritique = (
  filename: string,
  dimOverrides?: Partial<Record<string, number>>
): ArtworkCritique => ({
  filename,
  timestamp: Date.now(),
  overallImpression: '这是一幅很好的作品',
  dimensions: {
    composition: makeDim(7),
    colorLighting: makeDim(7),
    moodAtmosphere: makeDim(7),
    technique: makeDim(7),
    narrative: makeDim(7),
    commercialViability: makeDim(7),
    ...Object.fromEntries(
      Object.entries(dimOverrides || {}).map(([k, v]) => [k, makeDim(v)])
    ),
  },
  strengths: ['优点'],
  improvements: ['改进'],
  keyRecommendation: '建议',
});

describe('groupByFilename', () => {
  it('应该按文件名分组点评历史', () => {
    const critiques: ArtworkCritique[] = [
      createMockCritique('art.png', { composition: 7 }),
      createMockCritique('art.png', { composition: 8 }),
      createMockCritique('art.png', { composition: 9 }),
      createMockCritique('other.png', { composition: 5 }),
    ];

    const grouped = groupByFilename(critiques);

    expect(grouped.size).toBe(2);
    expect(grouped.get('art.png')).toHaveLength(3);
    expect(grouped.get('other.png')).toHaveLength(1);
  });

  it('应该处理空数组', () => {
    const grouped = groupByFilename([]);
    expect(grouped.size).toBe(0);
  });

  it('应该按时间排序（最新在前）', () => {
    const critiques: ArtworkCritique[] = [
      { ...createMockCritique('art.png', { composition: 7 }), timestamp: 3 },
      { ...createMockCritique('art.png', { composition: 8 }), timestamp: 1 },
      { ...createMockCritique('art.png', { composition: 9 }), timestamp: 2 },
    ];

    const grouped = groupByFilename(critiques);
    const artHistory = grouped.get('art.png');

    // 最新在前
    expect(artHistory![0].timestamp).toBe(3);
    expect(artHistory![1].timestamp).toBe(2);
    expect(artHistory![2].timestamp).toBe(1);
  });
});

describe('getScoreTrends', () => {
  it('应该生成各维度的评分趋势', () => {
    const history: ScoreHistory[] = [
      { ...createMockCritique('art.png', { composition: 7, colorLighting: 6 }), timestamp: 1 },
      { ...createMockCritique('art.png', { composition: 8, colorLighting: 7 }), timestamp: 2 },
      { ...createMockCritique('art.png', { composition: 9, colorLighting: 8 }), timestamp: 3 },
    ];

    const trends = getScoreTrends(history);

    expect(trends).toHaveLength(7); // 6 个维度 + 平均分
    
    const compositionTrend = trends.find(t => t.dimension === 'composition');
    expect(compositionTrend).toBeDefined();
    expect(compositionTrend?.scores).toEqual([7, 8, 9]);
    expect(compositionTrend?.timestamps).toEqual([1, 2, 3]);
  });

  it('应该计算平均分趋势', () => {
    const history: ScoreHistory[] = [
      { ...createMockCritique('art.png', { composition: 5, colorLighting: 5, moodAtmosphere: 5, technique: 5, narrative: 5, commercialViability: 5 }), timestamp: 1 },
      { ...createMockCritique('art.png', { composition: 7, colorLighting: 7, moodAtmosphere: 7, technique: 7, narrative: 7, commercialViability: 7 }), timestamp: 2 },
      { ...createMockCritique('art.png', { composition: 9, colorLighting: 9, moodAtmosphere: 9, technique: 9, narrative: 9, commercialViability: 9 }), timestamp: 3 },
    ];

    const trends = getScoreTrends(history);

    // 检查是否有平均分趋势
    const avgTrend = trends.find(t => t.dimension === 'average');
    expect(avgTrend).toBeDefined();
    expect(avgTrend?.scores).toEqual([5, 7, 9]);
  });

  it('应该处理单个记录', () => {
    const history: ScoreHistory[] = [
      createMockCritique('art.png', { composition: 7 }),
    ];

    const trends = getScoreTrends(history);

    expect(trends).toHaveLength(7); // 6 个维度 + 平均分
    expect(trends[0].scores).toHaveLength(1);
  });

  it('应该包含时间标签', () => {
    const history: ScoreHistory[] = [
      { ...createMockCritique('art.png', { composition: 7 }), timestamp: 1700000000000 },
      { ...createMockCritique('art.png', { composition: 8 }), timestamp: 1700003600000 }, // 1 小时后
    ];

    const trends = getScoreTrends(history);
    const compositionTrend = trends.find(t => t.dimension === 'composition');

    expect(compositionTrend?.labels).toHaveLength(2);
    expect(compositionTrend?.labels[0]).toMatch(/\d+月\d+日/);
  });

  it('应该计算评分变化方向', () => {
    const history: ScoreHistory[] = [
      { ...createMockCritique('art.png', { composition: 5 }), timestamp: 1 },
      { ...createMockCritique('art.png', { composition: 7 }), timestamp: 2 },
      { ...createMockCritique('art.png', { composition: 6 }), timestamp: 3 },
    ];

    const trends = getScoreTrends(history);
    const compositionTrend = trends.find(t => t.dimension === 'composition');

    expect(compositionTrend?.change).toBe(1); // 最终比初始高 1
    expect(compositionTrend?.direction).toBe('up');
  });
});

describe('ScoreTrend 类型', () => {
  it('应该包含所有必需字段', () => {
    const trend: ScoreTrend = {
      dimension: 'composition',
      label: '构图',
      scores: [7, 8, 9],
      timestamps: [1, 2, 3],
      labels: ['2023-01-01', '2023-01-02', '2023-01-03'],
      change: 2,
      direction: 'up',
      color: '#3b82f6',
    };

    expect(trend.dimension).toBe('composition');
    expect(trend.scores).toHaveLength(3);
    expect(trend.direction).toBe('up');
  });
});
