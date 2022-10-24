/**
 * Catch-all for ember-data.
 */
import Model from '@ember-data/model';

export default interface ModelRegistry extends Record<string, Model> {}