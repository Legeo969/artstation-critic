import type { ArtworkCritique } from './critique';

export function buildOptimizationPrompt(critique: ArtworkCritique): string {
  const dims = critique.dimensions;
  const strengths = critique.strengths.join('\n');
  const improvements = critique.improvements.join('\n');

  return `
你是一位专业的美术导师。请基于以下点评，生成一幅优化后的艺术作品。

## 原作品点评

### 整体印象
${critique.overallImpression}

### 维度评分
- 构图 (Composition): ${dims.composition.score}/10
- 色彩与光影 (Color & Lighting): ${dims.colorLighting.score}/10
- 氛围与情绪 (Mood & Atmosphere): ${dims.moodAtmosphere.score}/10
- 技法 (Technique): ${dims.technique.score}/10
- 叙事 (Narrative): ${dims.narrative.score}/10
- 商业潜力 (Commercial Viability): ${dims.commercialViability.score}/10

### 优点
${strengths}

### 改进建议
${improvements}

### 关键建议
${critique.keyRecommendation}

## 生成要求

1. **保持原作品的风格和构图** - 不要改变整体的艺术风格和画面布局
2. **根据点评改进不足之处** - 重点改进评分较低的维度
3. **保留原作品的核心创意** - 不要完全重新创作
4. **输出高质量图像** - 细节丰富，色彩准确

请生成优化后的艺术作品图片。
`.trim();
}

export function getMimeTypeFromBase64(base64: string): string {
  const match = base64.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/png';
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '请选择图片文件' };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: '不支持的图片格式，请使用 JPG、PNG 或 WebP' };
  }

  return { valid: true };
}
