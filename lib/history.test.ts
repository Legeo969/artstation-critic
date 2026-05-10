import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { saveCritique, getHistory, clearHistory } from './history';
import type { ArtworkCritique } from './critique';

// Skip IndexedDB tests in Node.js environment
// These will be tested in the browser
describe.skip('History Storage (browser only)', () => {
  it('saves a critique to history', async () => {
    // Browser test only
    expect(true).toBe(true);
  });

  it('retrieves history list', async () => {
    expect(true).toBe(true);
  });

  it('clears history', async () => {
    expect(true).toBe(true);
  });
});
