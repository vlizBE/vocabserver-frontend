import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Dataset extends Model {
  @attr uri;

  @attr alias;

  @attr title;
  @attr downloadPage;
  @attr modified;
  @attr format;
  @attr('boolean') dereferenceMembers;
  @attr('number') maxRequests;

  @hasMany('file') dataDumps;
  @belongsTo('dataset-type') type;

  @attr property;
  @attr class;
  @attr entities;

  @hasMany('dataset', { inverse: null }) classes;
  @hasMany('dataset', { inverse: null }) properties;

  @belongsTo('vocabulary') vocabulary;
}
