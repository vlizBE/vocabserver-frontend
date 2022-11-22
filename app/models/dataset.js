import Model, { attr, hasMany } from '@ember-data/model';

export default class Job extends Model {
  @attr uri;

  @attr title;
  @attr downloadPage;
  @attr modified;
  @attr format;
  @attr sparqlEndpoint;

  @hasMany('file') dataDumps;

  @attr property;
  @attr class;
  @attr entities;

  @hasMany('dataset', { inverse: null }) classes;
  @hasMany('dataset', { inverse: null }) properties;
}
