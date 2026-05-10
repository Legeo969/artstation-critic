'use client';

import React, { useState } from 'react';
import { TrendChart } from './TrendChart';
import type { ScoreHistory, ScoreTrend } from '../lib/trend-analysis';
import { getScoreTrends, calculateProgress, getBestRecord, getWorstRecord } from '../lib/trend-analysis';

export interface HistoryAnalysisProps {
  /** 作品历史 */
  history: ScoreHistory[];
  /** 作品文件名 */
  filename: string;
}

export const HistoryAnalysis: React.FC<HistoryAnalysisProps> = ({
  history,
  filename,
}) => {
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['composition', 'colorLighting', 'moodAtmosphere', 'technique', 'narrative', 'commercialViability']);
  const [showAverage, setShowAverage] = useState(true);

  const trends = getScoreTrends(history);
  const progress = calculateProgress(history);
  const bestRecord = getBestRecord(history);
  const worstRecord = getWorstRecord(history);

  const handleDimensionToggle = (dimension: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dimension) 
        ? prev.filter(d => d !== dimension)
        : [...prev, dimension]
    );
  };

  const handleAverageToggle = () => {
    setShowAverage(prev => !prev);
  };

  const getProgressIcon = (dir: 'up' | 'down' | 'stable') => {
    switch (dir) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          📊 {filename} - 进步趋势
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          共 {history.length} 次点评记录
        </p>
      </div>

      {/* 进步概览 */}
      {progress.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {progress.map(item => (
            <div 
              key={item.dimension}
              className={`p-3 rounded-lg border ${
                item.direction === 'up' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : item.direction === 'down'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <p className="text-xs text-zinc-500 mb-1">{item.dimension}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold" style={{ color: item.direction === 'up' ? '#10b981' : item.direction === 'down' ? '#ef4444' : '#6b7280' }}>
                  {getProgressIcon(item.direction)}
                </span>
                <span className={`text-sm font-medium ${
                  item.direction === 'up' ? 'text-green-600 dark:text-green-400' : item.direction === 'down' ? 'text-red-600 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'
                }`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{item.percentage > 0 ? '+' : ''}{item.percentage.toFixed(0)}%</p>
            </div>
          ))}
        </div>
      )}

      {/* 最佳/最差记录 */}
      {(bestRecord || worstRecord) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestRecord && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">🏆 最佳记录</p>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {((bestRecord.dimensions.composition.score + bestRecord.dimensions.colorLighting.score + bestRecord.dimensions.moodAtmosphere.score + bestRecord.dimensions.technique.score + bestRecord.dimensions.narrative.score + bestRecord.dimensions.commercialViability.score) / 6).toFixed(1)}
                </div>
                <p className="text-xs text-zinc-500">
                  {new Date(bestRecord.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
          {worstRecord && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">⚠️ 最低记录</p>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {((worstRecord.dimensions.composition.score + worstRecord.dimensions.colorLighting.score + worstRecord.dimensions.moodAtmosphere.score + worstRecord.dimensions.technique.score + worstRecord.dimensions.narrative.score + worstRecord.dimensions.commercialViability.score) / 6).toFixed(1)}
                </div>
                <p className="text-xs text-zinc-500">
                  {new Date(worstRecord.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 趋势图表 */}
      <TrendChart
        trends={trends}
        selectedDimensions={selectedDimensions}
        onDimensionToggle={handleDimensionToggle}
        showAverage={showAverage}
        onAverageToggle={handleAverageToggle}
      />

      {/* 提示 */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 提示：多次上传同一作品可以追踪进步轨迹。建议定期上传，观察各维度评分变化。
        </p>
      </div>
    </div>
  );
};

export default HistoryAnalysis;
