import type { ArtworkCritique } from './critique';

/** 评分维度 */
export type ScoreDimension = 'composition' | 'colorLighting' | 'moodAtmosphere' | 'technique' | 'narrative' | 'commercialViability' | 'average';

/** 维度映射 */
const DIMENSION_LABELS: Record<string, string> = {
  composition: '构图',
  colorLighting: '色彩与光影',
  moodAtmosphere: '氛围与情绪',
  technique: '技法',
  narrative: '叙事',
  commercialViability: '商业潜力',
  average: '综合评分',
};

/** 维度颜色 */
const DIMENSION_COLORS: Record<string, string> = {
  composition: '#3b82f6',      // 蓝色
  colorLighting: '#f59e0b',    // 橙色
  moodAtmosphere: '#8b5cf6',             // 紫色
  technique: '#10b981',        // 绿色
  narrative: '#ef4444',        // 红色
  commercialViability: '#06b6d4',       // 青色
  average: '#6366f1',          // 靛蓝
};

/** 评分历史 */
export interface ScoreHistory extends ArtworkCritique {
  /** 时间戳 */
  timestamp: number;
}

/** 评分趋势 */
export interface ScoreTrend {
  /** 维度名 */
  dimension: ScoreDimension;
  /** 中文标签 */
  label: string;
  /** 评分数组 */
  scores: number[];
  /** 时间戳数组 */
  timestamps: number[];
  /** 格式化时间标签 */
  labels: string[];
  /** 变化值（最终 - 初始） */
  change: number;
  /** 变化方向 */
  direction: 'up' | 'down' | 'stable';
  /** 颜色 */
  color: string;
}

/**
 * 按文件名分组点评历史
 * 
 * @param critiques - 点评结果数组
 * @returns Map<文件名, 按时间排序的点评历史（最新在前）>
 */
export function groupByFilename(critiques: ArtworkCritique[]): Map<string, ScoreHistory[]> {
  const grouped = new Map<string, ScoreHistory[]>();

  for (const critique of critiques) {
    const filename = critique.filename;
    const existing = grouped.get(filename) || [];
    
    existing.push({
      ...critique,
      timestamp: critique.timestamp || Date.now(),
    });
    
    grouped.set(filename, existing);
  }

  // 按时间排序（最新在前）
  for (const [filename, history] of grouped) {
    history.sort((a, b) => b.timestamp - a.timestamp);
  }

  return grouped;
}

/**
 * 获取评分趋势数据
 * 
 * @param history - 同一作品的评分历史（已按时间排序）
 * @returns 各维度的评分趋势
 */
export function getScoreTrends(history: ScoreHistory[]): ScoreTrend[] {
  if (history.length === 0) {
    return [];
  }

  const dimensions: ScoreDimension[] = ['composition', 'colorLighting', 'moodAtmosphere', 'technique', 'narrative', 'commercialViability', 'average'];

  return dimensions.map(dimension => {
    // 获取该维度的评分序列
    const scores = history.map(h => {
      if (dimension === 'average') {
        const d = h.dimensions;
        return (d.composition.score + d.colorLighting.score + d.moodAtmosphere.score + d.technique.score + d.narrative.score + d.commercialViability.score) / 6;
      }
      return h.dimensions[dimension].score;
    });

    // 生成时间标签
    const labels = history.map(h => {
      const date = new Date(h.timestamp);
      return date.toLocaleString('zh-CN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    // 计算变化
    const change = scores[scores.length - 1] - scores[0];
    const direction = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';

    return {
      dimension,
      label: DIMENSION_LABELS[dimension],
      scores,
      timestamps: history.map(h => h.timestamp),
      labels,
      change,
      direction,
      color: DIMENSION_COLORS[dimension],
    };
  });
}

/**
 * 计算进步幅度
 * 
 * @param history - 评分历史
 * @returns 各维度的进步/退步信息
 */
export function calculateProgress(history: ScoreHistory[]): {
  dimension: string;
  change: number;
  direction: 'up' | 'down' | 'stable';
  percentage: number;
}[] {
  if (history.length < 2) {
    return [];
  }

  const dimensionKeys = ['composition', 'colorLighting', 'moodAtmosphere', 'technique', 'narrative', 'commercialViability'] as const;

  return dimensionKeys.map(dimension => {
    const first = history[history.length - 1].dimensions[dimension].score;
    const last = history[0].dimensions[dimension].score;
    const change = last - first;
    const percentage = first > 0 ? (change / 10) * 100 : 0;
    const direction = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';

    return {
      dimension: DIMENSION_LABELS[dimension],
      change,
      direction,
      percentage,
    };
  });
}

/**
 * 获取最佳评分记录
 */
export function getBestRecord(history: ScoreHistory[]): ScoreHistory | null {
  if (history.length === 0) return null;

  return history.reduce((best, current) => {
    const bestAvg = getAverageScore(best.dimensions);
    const currentAvg = getAverageScore(current.dimensions);
    return currentAvg > bestAvg ? current : best;
  });
}

/**
 * 获取最差评分记录
 */
export function getWorstRecord(history: ScoreHistory[]): ScoreHistory | null {
  if (history.length === 0) return null;

  return history.reduce((worst, current) => {
    const worstAvg = getAverageScore(worst.dimensions);
    const currentAvg = getAverageScore(current.dimensions);
    return currentAvg < worstAvg ? current : worst;
  });
}

/**
 * 计算平均分
 */
function getAverageScore(dims: ArtworkCritique['dimensions']): number {
  return (
    dims.composition.score +
    dims.colorLighting.score +
    dims.moodAtmosphere.score +
    dims.technique.score +
    dims.narrative.score +
    dims.commercialViability.score
  ) / 6;
}
