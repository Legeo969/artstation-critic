'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistory, deleteCritique, updateCritique } from '../../lib/history';
import { Navbar } from '../page';
import { CritiqueResults } from '../../components/CritiqueResults';
import { generateOptimizedImage } from '../../lib/optimization';
import { buildOptimizationPrompt } from '../../lib/image-utils';
import { loadSettings } from '../../lib/settings';
import type { CritiqueRecord } from '../../lib/history';

function getImageDimensions(base64DataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 2048, height: 2048 });
    img.src = base64DataUrl;
  });
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CritiqueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CritiqueRecord | null>(null);
  const [isGeneratingOptimization, setIsGeneratingOptimization] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<{
    optimizedImageUrl: string;
    prompt: string;
  } | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const records = await getHistory();
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (confirm('确定删除这条点评？')) {
      await deleteCritique(id);
      setHistory(history.filter((h) => h.id !== id));
    }
  }

  async function handleGenerateOptimization() {
    if (!selectedRecord?.imageBase64 || !selectedRecord?.critique) return;
    setIsGeneratingOptimization(true);
    setOptimizationError(null);
    try {
      const settings = loadSettings();
      const prompt = buildOptimizationPrompt(selectedRecord.critique);
      const dims = await getImageDimensions(selectedRecord.imageBase64!);
      const result = await generateOptimizedImage(prompt, {
        apiKey: settings.imageApiKey || settings.apiKey,
        apiBase: settings.imageApiBase || settings.apiBase,
        model: settings.imageModel || 'doubao-seedream-4-5-251128',
        size: `${dims.width}x${dims.height}`,
        referenceImage: selectedRecord.imageBase64,
      });
      setOptimizationResult({
        optimizedImageUrl: result.optimizedImageUrl,
        prompt: result.prompt,
      });
      if (selectedRecord && result.optimizedImageBase64) {
        await updateCritique(selectedRecord.id, {
          optimizedImageBase64: result.optimizedImageBase64,
          optimizationPrompt: result.prompt,
        });
      }
    } catch (err) {
      setOptimizationError(err instanceof Error ? err.message : '生成优化图失败');
    } finally {
      setIsGeneratingOptimization(false);
    }
  }

  // 计算平均分
  function getAverageScore(record: CritiqueRecord): number {
    return Object.values(record.critique.dimensions)
      .reduce((sum, d) => sum + d.score, 0) / 6;
  }

  // 格式化时间
  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60 / 1000)} 分钟前`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 60 / 60 / 1000)} 小时前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  if (selectedRecord) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar currentPage="history" />
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => { setSelectedRecord(null); setOptimizationResult(null); setOptimizationError(null); }}
            className="mb-6 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回历史记录
          </button>
          <CritiqueResults
            critique={selectedRecord.critique}
            originalImageBase64={selectedRecord.imageBase64}
            onReset={() => setSelectedRecord(null)}
            onGenerateOptimization={handleGenerateOptimization}
            isGeneratingOptimization={isGeneratingOptimization}
            optimizationError={optimizationError}
            optimizationResult={optimizationResult || (selectedRecord.optimizedImageBase64 ? {
              optimizedImageUrl: selectedRecord.optimizedImageBase64,
              prompt: selectedRecord.optimizationPrompt || '',
            } : null)}
          />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar currentPage="history" />
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-shimmer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl skeleton" />
                    <div>
                      <div className="w-32 h-4 rounded skeleton mb-2" />
                      <div className="w-24 h-3 rounded skeleton" />
                    </div>
                  </div>
                  <div className="w-20 h-8 rounded skeleton" />
                </div>
                <div className="w-full h-4 rounded skeleton" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar currentPage="history" />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              历史记录
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              共 {history.length} 条点评记录
            </p>
          </div>
          {history.length > 0 && (
            <Link
              href="/"
              className="btn-primary flex items-center gap-2 text-sm py-2.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              上传新作品
            </Link>
          )}
        </div>

        {history.length === 0 ? (
          // 空状态
          <div className="card p-12 text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              暂无点评记录
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              上传你的第一张作品，获取 AI 专业点评
            </p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              上传作品
            </Link>
          </div>
        ) : (
          // 历史记录列表
          <div className="space-y-3 animate-fade-in-up">
            {history.map((record, index) => {
              const avgScore = getAverageScore(record);
              return (
                <div
                  key={record.id}
                  onClick={() => { setSelectedRecord(record); setOptimizationResult(null); setOptimizationError(null); }}
                  className="card p-4 sm:p-5 card-hover group animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* 缩略图 */}
                    {record.imageBase64 && (
                      <div className="flex-shrink-0">
                        <img
                          src={record.imageBase64}
                          alt={record.filename}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-soft group-hover:shadow-elevated transition-shadow"
                        />
                      </div>
                    )}
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {record.filename}
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {formatTime(record.timestamp)}
                          </p>
                        </div>
                        {/* 评分 */}
                        <div className="flex-shrink-0 text-right">
                          <div className={`text-xl font-bold ${
                            avgScore >= 7 ? 'text-emerald-600 dark:text-emerald-400'
                            : avgScore >= 5 ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                          }`}>
                            {avgScore.toFixed(1)}
                          </div>
                          <p className="text-xs text-zinc-500">综合评分</p>
                        </div>
                      </div>
                      
                      {/* 整体印象 */}
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 mb-3">
                        {record.critique.overallImpression}
                      </p>
                      
                      {/* 维度评分小标签 */}
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(record.critique.dimensions).slice(0, 3).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {value.score}
                          </span>
                        ))}
                        {Object.keys(record.critique.dimensions).length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            +{Object.keys(record.critique.dimensions).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => handleDelete(e, record.id)}
                      className="flex-shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="删除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>数据存储在本地 · 不会上传到服务器</p>
        </div>
      </footer>
    </div>
  );
}
