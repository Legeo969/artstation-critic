'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ScoreTrend } from '../lib/trend-analysis';

export interface TrendChartProps {
  /** 趋势数据 */
  trends: ScoreTrend[];
  /** 选中的维度 */
  selectedDimensions: string[];
  /** 维度切换回调 */
  onDimensionToggle: (dimension: string) => void;
  /** 是否显示平均分 */
  showAverage: boolean;
  /** 平均分切换回调 */
  onAverageToggle: () => void;
}

const ALL_DIMENSIONS = ['composition', 'colorLighting', 'moodAtmosphere', 'technique', 'narrative', 'commercialViability'];

export const TrendChart: React.FC<TrendChartProps> = ({
  trends,
  selectedDimensions,
  onDimensionToggle,
  showAverage,
  onAverageToggle,
}) => {
  // 准备图表数据
  const chartData = trends[0]?.labels.map((label, index) => {
    const dataPoint: Record<string, string | number> = { label };
    
    for (const trend of trends) {
      if (trend.dimension === 'average' && !showAverage) continue;
      if (!selectedDimensions.includes(trend.dimension) && trend.dimension !== 'average') continue;
      
      dataPoint[trend.dimension] = trend.scores[index];
    }
    
    return dataPoint;
  }) || [];

  // 获取选中的趋势
  const activeTrends = trends.filter(t => 
    selectedDimensions.includes(t.dimension) || (t.dimension === 'average' && showAverage)
  );

  return (
    <div className="space-y-4">
      {/* 维度选择器 */}
      <div className="flex flex-wrap gap-2">
        {ALL_DIMENSIONS.map(dimension => {
          const trend = trends.find(t => t.dimension === dimension);
          const isSelected = selectedDimensions.includes(dimension);
          
          return (
            <button
              key={dimension}
              onClick={() => onDimensionToggle(dimension)}
              className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              style={isSelected ? { borderColor: trend?.color, borderWidth: 2, borderStyle: 'solid' } : {}}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: trend?.color }} />
              {trend?.label}
            </button>
          );
        })}
        
        <button
          onClick={onAverageToggle}
          className={`px-3 py-1.5 text-xs rounded-full transition-all ${
            showAverage
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: '#6366f1' }} />
          平均分
        </button>
      </div>

      {/* 图表 */}
      <div className="h-80 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-400">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickCount={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                verticalAlign="top"
                height={30}
              />
              {activeTrends.map(trend => (
                <Line
                  key={trend.dimension}
                  type="monotone"
                  dataKey={trend.dimension}
                  stroke={trend.color}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name={trend.label}
                />
              ))}
              {/* 参考线：5 分及格线 */}
              <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="5 5" opacity={0.5} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 图例说明 */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span>📈 折线显示评分变化趋势</span>
        <span>🔴 虚线为 5 分及格线</span>
        <span>🎯 点击维度切换显示</span>
      </div>
    </div>
  );
};

export default TrendChart;
