/**
 * Artstation Critic - Library Exports
 * 
 * 统一导出 lib 目录下的所有模块，方便外部引用。
 */

// Core critique functionality
export { critiqueArtwork, fetchModels } from './critique';
export type { ArtworkCritique, DimensionFeedback, UserSettings, ModelInfo } from './critique';

// System prompt
export { ARTSTATION_CRITIC_PROMPT } from './critic-prompt';

// History storage
export {
  saveCritique,
  getHistory,
  getCritiqueById,
  deleteCritique,
  clearHistory,
} from './history';
export type { CritiqueRecord } from './history';

// Settings
export { loadSettings, saveSettings } from './settings';
export type { UserSettings as Settings } from './critique';
