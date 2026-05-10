'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CritiqueResults } from '../components/CritiqueResults';
import { Dropzone } from '../components/Dropzone';
import { critiqueArtwork } from '../lib/critique';
import { saveCritique, updateCritique } from '../lib/history';
import { loadSettings } from '../lib/settings';
import { generateOptimizedImage } from '../lib/optimization';
import { buildOptimizationPrompt } from '../lib/image-utils';
import type { ArtworkCritique } from '../lib/critique';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(base64DataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 2048, height: 2048 });
    img.src = base64DataUrl;
  });
}

// 导航链接组件
function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }
      `}
    >
      {children}
    </Link>
  );
}

// 响应式导航栏
export function Navbar({ currentPage = 'home' }: { currentPage?: 'home' | 'history' | 'settings' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-elevated group-hover:shadow-float transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 hidden sm:block">
              Artstation Critic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-2">
            <NavLink href="/" active={currentPage === 'home'}>
              上传
            </NavLink>
            <NavLink href="/history" active={currentPage === 'history'}>
              历史记录
            </NavLink>
            <NavLink href="/settings" active={currentPage === 'settings'}>
              设置
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="菜单"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="sm:hidden py-3 border-t border-zinc-200 dark:border-zinc-800 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📤 上传作品
              </Link>
              <Link
                href="/history"
                className="px-4 py-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📜 历史记录
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚙️ 设置
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [critique, setCritique] = useState<ArtworkCritique | null>(null);
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 优化相关状态
  const [isGeneratingOptimization, setIsGeneratingOptimization] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<{
    optimizedImageUrl: string;
    prompt: string;
  } | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError(null);
    setOptimizationError(null);
    setOptimizationResult(null);
    
    try {
      const base64 = await fileToBase64(selectedFile);
      setOriginalImageBase64(base64);

      const settings = loadSettings();
      const formData = new FormData();
      formData.append('filename', selectedFile.name);
      formData.append('image', base64);
      formData.append('settings', JSON.stringify(settings));
      const result = await critiqueArtwork(formData);
      setCritique(result);
      const record = await saveCritique(selectedFile.name, result, base64);
      setCurrentRecordId(record.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取点评失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateOptimization = async () => {
    if (!originalImageBase64 || !critique) return;
    
    setIsGeneratingOptimization(true);
    setOptimizationError(null);
    
    try {
      const settings = loadSettings();
      const prompt = buildOptimizationPrompt(critique);
      const dims = await getImageDimensions(originalImageBase64);
      const result = await generateOptimizedImage(
        prompt,
        {
          apiKey: settings.imageApiKey || settings.apiKey,
          apiBase: settings.imageApiBase || settings.apiBase,
          model: settings.imageModel || 'doubao-seedream-4-5-251128',
          size: `${dims.width}x${dims.height}`,
          referenceImage: originalImageBase64,
        }
      );
      
      setOptimizationResult({
        optimizedImageUrl: result.optimizedImageUrl,
        prompt: result.prompt,
      });
      if (currentRecordId && result.optimizedImageBase64) {
        await updateCritique(currentRecordId, {
          optimizedImageBase64: result.optimizedImageBase64,
          optimizationPrompt: result.prompt,
        });
      }
    } catch (err) {
      setOptimizationError(err instanceof Error ? err.message : '生成优化图失败');
    } finally {
      setIsGeneratingOptimization(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCritique(null);
    setOriginalImageBase64(null);
    setError(null);
    setOptimizationError(null);
    setOptimizationResult(null);
  };

  // 点评结果页面
  if (critique) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar currentPage="home" />
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <CritiqueResults
            critique={critique}
            originalImageBase64={originalImageBase64 || undefined}
            onReset={handleReset}
            onGenerateOptimization={handleGenerateOptimization}
            isGeneratingOptimization={isGeneratingOptimization}
            optimizationError={optimizationError}
            optimizationResult={optimizationResult}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar currentPage="home" />
      
      {/* 加载进度条 */}
      {isProcessing && (
        <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-loading-bar" />
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-3">
            AI 专业作品点评
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            上传你的作品，获取来自 AI 艺术导师的深度分析
          </p>
        </div>

        {/* 上传区域 */}
        <div className="animate-fade-in-up delay-100">
          <Dropzone
            onFileSelect={(file) => {
              setSelectedFile(file);
              setCritique(null);
              setError(null);
              setOptimizationError(null);
              setOptimizationResult(null);
            }}
            onError={(msg) => setError(msg)}
            maxSizeMB={10}
          />
        </div>

        {/* 文件信息和操作区 */}
        {selectedFile && (
          <div className="mt-6 space-y-4 animate-fade-in-up delay-200">
            {/* 文件卡片 */}
            <div className="card p-4 flex items-center gap-4">
              {/* 文件图标 */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* 文件信息 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {/* 删除按钮 */}
              <button
                onClick={handleReset}
                className="flex-shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="清除选择"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="card p-4 border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10 animate-fade-in">
                <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* 操作按钮 */}
            {isProcessing ? (
              <div className="space-y-4 animate-fade-in">
                <button
                  disabled
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  分析中...
                </button>
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  AI 正在深度分析你的作品，请稍候...
                </p>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                获取专业点评
              </button>
            )}
          </div>
        )}

        {/* 空状态提示 */}
        {!selectedFile && !error && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-300">
            <div className="card p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">上传作品</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">拖拽或粘贴图片</p>
            </div>
            <div className="card p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">AI 分析</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">6 个维度深度点评</p>
            </div>
            <div className="card p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">追踪进步</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">查看历史记录</p>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            基于火山方舟豆包模型 · 本地存储 · 开源免费
          </p>
        </div>
      </footer>
    </div>
  );
}
