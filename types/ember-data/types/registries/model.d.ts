/**
 * Catch-all for ember-data.
 */
import Model from '@ember-data/model';

// eslint-disable-next-line
export default interface ModelRegistry extends Record<string, Model> {}