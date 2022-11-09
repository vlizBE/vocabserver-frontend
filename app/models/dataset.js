import Model, { attr, hasMany } from '@ember-data/model';

export default class Job extends Model {
  @attr('string') property;
  @attr('string') class;
  @attr('string') entities;

  @hasMany('dataset', { inverse: null }) classes;
  @hasMany('dataset', { inverse: null }) properties;
}
