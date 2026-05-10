'use server';

import OpenAI from 'openai';

const ARK_API_BASE = 'https://ark.cn-beijing.volces.com/api/v3';

export interface OptimizationOptions {
  model?: string;
  apiKey?: string;
  apiBase?: string;
  size?: string;
  watermark?: boolean;
  referenceImage?: string;
}

export interface OptimizationResult {
  optimizedImageUrl: string;
  optimizedImageBase64?: string;
  prompt: string;
  timestamp: number;
}

const SEEDREAM_MIN_PIXELS = 3686400; // 约 1920×1920

function ensureMinSize(size: string): string {
  const [w, h] = size.split('x').map(Number);
  if (!w || !h) return size;
  if (w * h >= SEEDREAM_MIN_PIXELS) return size;
  const scale = Math.sqrt(SEEDREAM_MIN_PIXELS / (w * h));
  return `${Math.round(w * scale)}x${Math.round(h * scale)}`;
}

export async function generateOptimizedImage(
  prompt: string,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> {
  const {
    model = 'doubao-seedream-4-5-251128',
    apiKey = process.env.ARK_API_KEY,
    apiBase = process.env.ARK_API_BASE || ARK_API_BASE,
    size = '2048x2048',
    watermark = false,
    referenceImage,
  } = options;
  const safeSize = ensureMinSize(size);

  if (!apiKey) {
    throw new Error('缺少 API Key，请在设置中配置');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: apiBase,
  });

  try {
    const params: Record<string, unknown> = {
      model,
      prompt,
      n: 1,
      size: safeSize,
      extra_body: { watermark },
    };
    if (referenceImage) {
      params.image = referenceImage;
    }

    const response = await openai.images.generate(params as never);

    if (!response.data || response.data.length === 0) {
      throw new Error('图像生成失败：API 未返回有效结果');
    }

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('图像生成失败：未获取到图片 URL');
    }

    const optimizedImageBase64 = await fetchImageAsBase64(imageUrl);

    return {
      optimizedImageUrl: imageUrl,
      optimizedImageBase64,
      prompt,
      timestamp: Date.now(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : '图像生成失败';
    throw new Error(`Seedream 图像生成失败: ${message}`);
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch {
    return '';
  }
}
