'use server';

import OpenAI from 'openai';
import { ARTSTATION_CRITIC_PROMPT } from './critic-prompt';

export interface DimensionFeedback {
  score: number;
  feedback: string;
}

export interface ArtworkCritique {
  filename: string;
  timestamp?: number;
  overallImpression: string;
  dimensions: {
    composition: DimensionFeedback;
    colorLighting: DimensionFeedback;
    moodAtmosphere: DimensionFeedback;
    technique: DimensionFeedback;
    narrative: DimensionFeedback;
    commercialViability: DimensionFeedback;
  };
  strengths: string[];
  improvements: string[];
  keyRecommendation: string;
}

export interface UserSettings {
  apiKey: string;
  apiBase: string;
  model: string;
  imageApiKey?: string;
  imageApiBase?: string;
  imageModel?: string;
}

const ARK_API_BASE = 'https://ark.cn-beijing.volces.com/api/v3';

export async function critiqueArtwork(
  formData: FormData
): Promise<ArtworkCritique> {
  const filename = formData.get('filename') as string;
  const base64DataUrl = formData.get('image') as string;
  const settingsJson = formData.get('settings') as string;

  let settings: Partial<UserSettings> = {};
  try { settings = settingsJson ? JSON.parse(settingsJson) : {}; } catch {}

  const apiKey = settings?.apiKey || process.env.ARK_API_KEY;
  const apiBase = settings?.apiBase || process.env.ARK_API_BASE || ARK_API_BASE;

  if (!apiKey) {
    throw new Error('API key not configured. Set ARK_API_KEY in .env.local or configure in Settings');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: apiBase,
  });

  const response = await openai.chat.completions.create({
    model: settings?.model || 'doubao-seed-2-0-pro-260215',
    messages: [
      {
        role: 'system',
        content: ARTSTATION_CRITIC_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Please critique this artwork: ${filename}`,
          },
          {
            type: 'image_url',
            image_url: {
              url: base64DataUrl,
            },
          },
        ],
      },
    ],
  });

  let content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No critique returned from AI');
  }

  // Strip markdown code blocks if present
  content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

  const critique = JSON.parse(content) as ArtworkCritique;
  critique.filename = filename;
  return critique;
}

export interface ModelInfo {
  id: string;
}

export async function fetchModels(
  apiKey: string,
  apiBase: string
): Promise<ModelInfo[]> {
  if (!apiKey) throw new Error('API key is required');
  if (!apiBase) throw new Error('API base URL is required');

  const baseUrl = apiBase.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.data || []) as ModelInfo[];
}
