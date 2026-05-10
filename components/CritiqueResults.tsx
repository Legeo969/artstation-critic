'use client';

import { useState } from 'react';
import { ArtworkCritique } from '../lib/critique';
import { OptimizationView } from './OptimizationView';

interface CritiqueResultsProps {
  critique: ArtworkCritique;
  originalImageBase64?: string;
  onReset: () => void;
  onGenerateOptimization?: () => Promise<void>;
  isGeneratingOptimization?: boolean;
  optimizationError?: string | null;
  optimizationResult?: {
    optimizedImageUrl: string;
    prompt: string;
  } | null;
}

const dimensionNames: Record<string, string> = {
  composition: '构图',
  colorLighting: '色彩与光影',
  moodAtmosphere: '氛围与情绪',
  technique: '技法',
  narrative: '叙事',
  commercialViability: '商业潜力',
};

const dimensionColors: Record<string, string> = {
  composition: 'bg-blue-500',
  colorLighting: 'bg-amber-500',
  moodAtmosphere: 'bg-purple-500',
  technique: 'bg-emerald-500',
  narrative: 'bg-rose-500',
  commercialViability: 'bg-indigo-500',
};

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 6) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBarColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500';
  if (score >= 6) return 'bg-amber-500';
  return 'bg-red-500';
}

export function CritiqueResults({
  critique,
  originalImageBase64,
  onReset,
  onGenerateOptimization,
  isGeneratingOptimization = false,
  optimizationError = null,
  optimizationResult = null,
}: CritiqueResultsProps) {
  const [showOptimization, setShowOptimization] = useState(!!optimizationResult);

  const handleGenerateOptimization = async () => {
    if (onGenerateOptimization) {
      await onGenerateOptimization();
      setShowOptimization(true);
    }
  };

  const averageScore = Object.values(critique.dimensions).reduce((a, d) => a + d.score, 0) / 6;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ===== 头部：作品信息和平均分 ===== */}
      <header className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
        {originalImageBase64 && (
          <div className="flex-shrink-0">
            <img
              src={originalImageBase64}
              alt="上传的作品"
              className="w-20 h-20 object-cover rounded-xl shadow-elevated"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
            点评结果
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            AI 专业点评分析
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold leading-none text-emerald-600 dark:text-emerald-400">
            {averageScore.toFixed(1)}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">综合评分</p>
        </div>
      </header>

      {/* ===== 整体印象 ===== */}
      <section className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            整体印象
          </h2>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {critique.overallImpression}
        </p>
      </section>

      {/* ===== 维度评分 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            维度评分
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(critique.dimensions).map(([key, value]) => (
            <div
              key={key}
              className="card p-4 card-hover group"
            >
              <div className="flex justify-between items-center gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dimensionColors[key]}`} />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {dimensionNames[key] || key}
                  </span>
                </div>
                <span className={`text-lg font-semibold tabular-nums flex-shrink-0 ${getScoreColor(value.score)}`}>
                  {value.score}/10
                </span>
              </div>
              {/* 进度条 */}
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(value.score)}`}
                  style={{ width: `${value.score * 10}%` }}
                />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {value.feedback}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 优点 ===== */}
      <section className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
            优点
          </h2>
        </div>
        <ul className="space-y-2">
          {critique.strengths.map((strength, i) => (
            <li
              key={i}
              className="text-zinc-700 dark:text-zinc-300 flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-0.5">
                ✓
              </span>
              <span className="leading-relaxed">{strength}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 改进建议 ===== */}
      <section className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
            改进建议
          </h2>
        </div>
        <ul className="space-y-2">
          {critique.improvements.map((improvement, i) => (
            <li
              key={i}
              className="text-zinc-700 dark:text-zinc-300 flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-bold mt-0.5">
                !
              </span>
              <span className="leading-relaxed">{improvement}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 关键建议 ===== */}
      <section className="card p-5 border-amber-200 dark:border-amber-800/30 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
            关键建议
          </h2>
        </div>
        <p className="text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
          {critique.keyRecommendation}
        </p>
      </section>

      {/* ===== AI 优化对比 ===== */}
      {showOptimization && optimizationResult && originalImageBase64 && (
        <section className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              AI 优化对比
            </h2>
          </div>
          <OptimizationView
            originalImage={originalImageBase64}
            optimizedImageUrl={optimizationResult.optimizedImageUrl}
            isGenerating={isGeneratingOptimization}
            error={optimizationError}
            generatingText="AI 正在生成优化图，请稍候..."
            onRegenerate={onGenerateOptimization}
            onClose={() => setShowOptimization(false)}
          />
        </section>
      )}

      {/* ===== 操作按钮 ===== */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onGenerateOptimization && !showOptimization && (
          <button
            onClick={handleGenerateOptimization}
            disabled={isGeneratingOptimization || !originalImageBase64}
            className="btn-accent flex-1 flex items-center justify-center gap-2"
          >
            {isGeneratingOptimization ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI 生成优化图
              </>
            )}
          </button>
        )}
        <button
          onClick={onReset}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          上传另一张作品
        </button>
      </div>

      {/* ===== API Key 提示 ===== */}
      {optimizationError?.includes('API Key') && (
        <div className="card p-4 border-blue-200 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10">
          <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <span>💡</span>
            <span>
              要使用 AI 生成优化图功能，请在{' '}
              <a href="/settings" className="underline hover:text-blue-900 dark:hover:text-blue-300 font-medium">
                设置页面
              </a>{' '}
              配置图片生成 API
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
