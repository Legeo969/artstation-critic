import { describe, it, expect } from 'vitest';
import {
  buildOptimizationPrompt,
  getMimeTypeFromBase64,
  validateImageFile,
} from './image-utils';

describe('optimization utilities', () => {
  const mockCritique = {
    filename: 'test-artwork.png',
    timestamp: Date.now(),
    overallImpression: '这是一幅很有潜力的作品',
    dimensions: {
      composition: { score: 7, feedback: '构图平衡，视觉引导清晰' },
      colorLighting: { score: 7, feedback: '色彩搭配和谐' },
      moodAtmosphere: { score: 8, feedback: '氛围营造较好' },
      technique: { score: 7, feedback: '技法扎实' },
      narrative: { score: 7, feedback: '叙事清晰' },
      commercialViability: { score: 6, feedback: '商业潜力可提升' },
    },
    strengths: [
      '构图平衡，视觉引导清晰',
      '色彩搭配和谐',
    ],
    improvements: [
      '增加光影对比度',
      '细化背景细节',
      '增强主体轮廓',
    ],
    keyRecommendation: '建议加强明暗对比，让主体更加突出',
  };

  describe('buildOptimizationPrompt', () => {
    it('应该生成包含所有关键信息的提示词', () => {
      const prompt = buildOptimizationPrompt(mockCritique);

      expect(prompt).toContain('保持原作品的风格和构图');
      expect(prompt).toContain('根据点评改进不足之处');
      expect(prompt).toContain('保留原作品的核心创意');
    });

    it('应该包含维度评分', () => {
      const prompt = buildOptimizationPrompt(mockCritique);

      expect(prompt).toContain('构图 (Composition): 7/10');
      expect(prompt).toContain('色彩与光影 (Color & Lighting): 7/10');
    });

    it('应该包含优点和改进建议', () => {
      const prompt = buildOptimizationPrompt(mockCritique);

      expect(prompt).toContain('构图平衡，视觉引导清晰');
      expect(prompt).toContain('增加光影对比度');
    });

    it('应该包含关键建议', () => {
      const prompt = buildOptimizationPrompt(mockCritique);

      expect(prompt).toContain('建议加强明暗对比，让主体更加突出');
    });
  });

  describe('getMimeTypeFromBase64', () => {
    it('应该正确提取 PNG 的 MIME 类型', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
      expect(getMimeTypeFromBase64(base64)).toBe('image/png');
    });

    it('应该正确提取 JPEG 的 MIME 类型', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ';
      expect(getMimeTypeFromBase64(base64)).toBe('image/jpeg');
    });

    it('应该正确提取 WebP 的 MIME 类型', () => {
      const base64 = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4';
      expect(getMimeTypeFromBase64(base64)).toBe('image/webp');
    });

    it('对于无效格式返回默认 png', () => {
      const base64 = 'invalid-base64-string';
      expect(getMimeTypeFromBase64(base64)).toBe('image/png');
    });
  });

  describe('validateImageFile', () => {
    it('应该验证有效的图片文件', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该拒绝非图片文件', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('请选择图片文件');
    });

    it('应该拒绝不支持的图片格式', () => {
      const file = new File(['test'], 'test.bmp', { type: 'image/bmp' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('不支持的图片格式，请使用 JPG、PNG 或 WebP');
    });

    it('应该支持 JPEG 格式', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('应该支持 WebP 格式', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });
  });
});
