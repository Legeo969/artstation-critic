'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadSettings, saveSettings } from '../../lib/settings';
import { Navbar } from '../page';
import type { UserSettings } from '../../lib/critique';

export default function SettingsPage() {
  const [apiBase, setApiBase] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // 图片生成 API
  const [imageApiBase, setImageApiBase] = useState('');
  const [imageApiKey, setImageApiKey] = useState('');
  const [imageModel, setImageModel] = useState('');
  const [showImageApiKey, setShowImageApiKey] = useState(false);
  const [imageModels, setImageModels] = useState<string[]>([]);
  const [isFetchingImageModels, setIsFetchingImageModels] = useState(false);
  const [fetchImageError, setFetchImageError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSettings();
    if (saved.apiBase) setApiBase(saved.apiBase);
    if (saved.apiKey) setApiKey(saved.apiKey);
    if (saved.model) setModel(saved.model);
    if (saved.imageApiBase) setImageApiBase(saved.imageApiBase);
    if (saved.imageApiKey) setImageApiKey(saved.imageApiKey);
    if (saved.imageModel) setImageModel(saved.imageModel);
  }, []);

  async function handleFetchModels() {
    if (!apiKey || !apiBase) {
      setFetchError('请先填写 API 地址和 API Key');
      return;
    }
    setIsFetching(true);
    setFetchError(null);
    try {
      const { fetchModels } = await import('../../lib/critique');
      const result = await fetchModels(apiKey, apiBase);
      setModels(result.map((m) => m.id));
      if (result.length === 0) {
        setFetchError('该 API 没有可用模型');
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : '获取模型失败');
    } finally {
      setIsFetching(false);
    }
  }

  async function handleFetchImageModels() {
    const key = imageApiKey || apiKey;
    const base = imageApiBase || apiBase;
    if (!key || !base) {
      setFetchImageError('请先填写 API 地址和 API Key');
      return;
    }
    setIsFetchingImageModels(true);
    setFetchImageError(null);
    try {
      const { fetchModels } = await import('../../lib/critique');
      const result = await fetchModels(key, base);
      setImageModels(result.map((m) => m.id));
      if (result.length === 0) {
        setFetchImageError('该 API 没有可用模型');
      }
    } catch (err) {
      setFetchImageError(err instanceof Error ? err.message : '获取模型失败');
    } finally {
      setIsFetchingImageModels(false);
    }
  }

  function handleSave() {
    const settings: Partial<UserSettings> = {};
    if (apiBase) settings.apiBase = apiBase;
    if (apiKey) settings.apiKey = apiKey;
    if (model) settings.model = model;
    if (imageApiBase) settings.imageApiBase = imageApiBase;
    if (imageApiKey) settings.imageApiKey = imageApiKey;
    if (imageModel) settings.imageModel = imageModel;
    saveSettings(settings);
    setSaveMessage('✅ 保存成功');
    setTimeout(() => setSaveMessage(null), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar currentPage="settings" />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            设置
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            配置 API 以使用 AI 点评功能
          </p>
        </div>

        {/* API 设置卡片 */}
        <div className="card p-6 animate-fade-in-up delay-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                API 配置
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                使用火山方舟豆包 Seed 或兼容 OpenAI 格式的 API
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* API 地址 */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                API 地址
              </label>
              <input
                type="text"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
                placeholder="https://ark.cn-beijing.volces.com/api/v3"
                className="input-field font-mono text-sm"
              />
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                支持 DeepSeek、OpenAI 等兼容格式
              </p>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入 API Key"
                  className="input-field font-mono text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  aria-label={showApiKey ? '隐藏' : '显示'}
                >
                  {showApiKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 拉取模型按钮 */}
            <div>
              <button
                onClick={handleFetchModels}
                disabled={isFetching || !apiKey || !apiBase}
                className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    获取中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    拉取可用模型
                  </>
                )}
              </button>
              {fetchError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fetchError}
                </p>
              )}
            </div>

            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                模型
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                list="model-list"
                placeholder={models.length > 0 ? '选择或输入模型名称' : 'doubao-seed-2-0-pro-260215'}
                className="input-field font-mono text-sm"
              />
              {models.length > 0 && (
                <datalist id="model-list">
                  {models.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              )}
              {models.length > 0 && (
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  已发现 {models.length} 个可用模型
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 图片生成 API 设置 */}
        <div className="card p-6 animate-fade-in-up delay-150 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                图片生成 API
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                用于 AI 生成优化图（Seedream / DALL-E 3 等）
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                API 地址
              </label>
              <input
                type="text"
                value={imageApiBase}
                onChange={(e) => setImageApiBase(e.target.value)}
                placeholder="留空则使用上方点评 API 地址"
                className="input-field font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showImageApiKey ? 'text' : 'password'}
                  value={imageApiKey}
                  onChange={(e) => setImageApiKey(e.target.value)}
                  placeholder="留空则使用上方点评 API Key"
                  className="input-field font-mono text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowImageApiKey(!showImageApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  aria-label={showImageApiKey ? '隐藏' : '显示'}
                >
                  {showImageApiKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 拉取模型 */}
            <div>
              <button
                onClick={handleFetchImageModels}
                disabled={isFetchingImageModels || (!imageApiKey && !apiKey) || (!imageApiBase && !apiBase)}
                className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isFetchingImageModels ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    获取中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    拉取可用模型
                  </>
                )}
              </button>
              {fetchImageError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fetchImageError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                模型
              </label>
              <input
                type="text"
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value)}
                list="image-model-list"
                placeholder={imageModels.length > 0 ? '选择或输入模型名称' : 'doubao-seedream-4-5-251128'}
                className="input-field font-mono text-sm"
              />
              {imageModels.length > 0 && (
                <datalist id="image-model-list">
                  {imageModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              )}
              {imageModels.length > 0 && (
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  已发现 {imageModels.length} 个可用模型
                </p>
              )}
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                默认使用火山方舟 Seedream 4.5，也支持 DALL-E 3
              </p>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="mt-6 animate-fade-in-up delay-200">
          <button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            保存设置
          </button>
          {saveMessage && (
            <p className="mt-3 text-center text-sm text-emerald-600 dark:text-emerald-400 animate-fade-in">
              {saveMessage}
            </p>
          )}
        </div>

        {/* 提示信息 */}
        <div className="mt-6 card p-4 border-blue-200 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10 animate-fade-in-up delay-300">
          <p className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
            <span className="flex-shrink-0">💡</span>
            <span>
              推荐使用豆包 Seed 模型点评 + Seedream 4.5 生成优化图
            </span>
          </p>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>API Key 仅存储在本地浏览器中，不会上传到任何服务器</p>
        </div>
      </footer>
    </div>
  );
}
