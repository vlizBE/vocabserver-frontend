import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Dataset extends Model {
  @attr uri;

  @attr title;
  @attr downloadPage;
  @attr modified;
  @attr format;
  @attr('number') maxRequests;

  @hasMany('file') dataDumps;
  @belongsTo('dataset-type') type;

  @attr property;
  @attr class;
  @attr entities;

  @hasMany('dataset', { inverse: null }) classes;
  @hasMany('dataset', { inverse: null }) properties;

  @hasMany('filter-count-input', {inverse: 'dataset'}) filterCountInputs;
  @hasMany('filter-count-output', {inverse: 'dataset'}) filterCountOutputs;

  @belongsTo('vocabulary') vocabulary;
}
