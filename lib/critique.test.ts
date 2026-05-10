import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { critiqueArtwork, fetchModels } from './critique';

vi.mock('openai', () => {
  const MockOpenAI = vi.fn();
  MockOpenAI.prototype = {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  };
  return {
    default: MockOpenAI,
  };
});

function mockApiResponse(body: unknown, ok = true, statusText = 'OK') {
  return {
    ok,
    statusText,
    status: ok ? 200 : 400,
    json: () => Promise.resolve(body),
  };
}

describe('critiqueArtwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a critique with all 6 dimensions', async () => {
    const MockOpenAI = vi.mocked(await import('openai')).default;

    const mockCreate = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overallImpression: 'Great piece!',
              dimensions: {
                composition: { score: 8, feedback: 'Strong focal point' },
                colorLighting: { score: 7, feedback: 'Good color harmony' },
                moodAtmosphere: { score: 8, feedback: 'Compelling mood' },
                technique: { score: 7, feedback: 'Solid execution' },
                narrative: { score: 6, feedback: 'Story could be clearer' },
                commercialViability: { score: 7, feedback: 'Portfolio ready' },
              },
              strengths: ['Strong composition'],
              improvements: ['Clarify the narrative'],
              keyRecommendation: 'Add visual clues to strengthen the story',
            }),
          },
        },
      ],
    });

    MockOpenAI.prototype.chat.completions.create = mockCreate;

    const fd = new FormData();
    fd.append('filename', 'test-image.png');
    fd.append('image', 'data:image/png;base64,dGVzdA==');
    const result = await critiqueArtwork(fd);

    expect(result).toHaveProperty('overallImpression');
    expect(result).toHaveProperty('dimensions');
    expect(result.dimensions.composition).toBeDefined();
    expect(result.dimensions.colorLighting).toBeDefined();
    expect(result.dimensions.moodAtmosphere).toBeDefined();
    expect(result.dimensions.technique).toBeDefined();
    expect(result.dimensions.narrative).toBeDefined();
    expect(result.dimensions.commercialViability).toBeDefined();
    expect(result.strengths).toBeInstanceOf(Array);
    expect(result.improvements).toBeInstanceOf(Array);
    expect(result.keyRecommendation).toBeDefined();
  });

  it('uses settings model when provided', async () => {
    const MockOpenAI = vi.mocked(await import('openai')).default;

    const mockCreate = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overallImpression: 'Test',
              dimensions: {
                composition: { score: 5, feedback: '' },
                colorLighting: { score: 5, feedback: '' },
                moodAtmosphere: { score: 5, feedback: '' },
                technique: { score: 5, feedback: '' },
                narrative: { score: 5, feedback: '' },
                commercialViability: { score: 5, feedback: '' },
              },
              strengths: [],
              improvements: [],
              keyRecommendation: '',
            }),
          },
        },
      ],
    });

    MockOpenAI.prototype.chat.completions.create = mockCreate;

    const fd = new FormData();
    fd.append('filename', 'test.png');
    fd.append('image', 'data:image/png;base64,test');
    fd.append('settings', JSON.stringify({
      apiKey: 'custom-key',
      apiBase: 'https://custom.api.com/v1',
      model: 'custom-model',
    }));
    await critiqueArtwork(fd);

    expect(MockOpenAI).toHaveBeenCalledWith({
      apiKey: 'custom-key',
      baseURL: 'https://custom.api.com/v1',
    });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'custom-model' })
    );
  });
});

describe('fetchModels', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns model IDs from the API response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      mockApiResponse({ data: [{ id: 'model-a' }, { id: 'model-b' }] })
    );

    const models = await fetchModels('key', 'https://api.example.com/v1');
    expect(models).toEqual([{ id: 'model-a' }, { id: 'model-b' }]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v1/models',
      { headers: { Authorization: 'Bearer key' } }
    );
  });

  it('strips trailing slash from apiBase', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      mockApiResponse({ data: [] })
    );

    await fetchModels('key', 'https://api.example.com/v1/');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v1/models',
      expect.anything()
    );
  });

  it('throws on non-OK response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      mockApiResponse({}, false, 'Unauthorized')
    );

    await expect(fetchModels('bad-key', 'https://api.example.com/v1'))
      .rejects.toThrow('Failed to fetch models');
  });
});
