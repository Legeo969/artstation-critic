import { describe, it, expect } from 'vitest';
import { ARTSTATION_CRITIC_PROMPT } from './critic-prompt';

describe('Artstation Critic Prompt', () => {
  it('contains all 6 critique dimensions', () => {
    const dimensions = [
      'Composition',
      'Color & Lighting',
      'Mood & Atmosphere',
      'Technique & Execution',
      'Narrative',
      'Commercial Viability',
    ];

    dimensions.forEach((dim) => {
      expect(ARTSTATION_CRITIC_PROMPT).toContain(dim);
    });
  });

  it('contains the persona definition', () => {
    expect(ARTSTATION_CRITIC_PROMPT).toContain('Artstation');
    expect(ARTSTATION_CRITIC_PROMPT).toContain('experienced art critic');
  });

  it('contains output format instructions', () => {
    expect(ARTSTATION_CRITIC_PROMPT).toContain('overallImpression');
    expect(ARTSTATION_CRITIC_PROMPT).toContain('dimensions');
    expect(ARTSTATION_CRITIC_PROMPT).toContain('strengths');
    expect(ARTSTATION_CRITIC_PROMPT).toContain('improvements');
    expect(ARTSTATION_CRITIC_PROMPT).toContain('JSON');
  });
});
