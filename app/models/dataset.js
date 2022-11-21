import Model, { attr, hasMany } from '@ember-data/model';

export default class DatasetModel extends Model {
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
}
