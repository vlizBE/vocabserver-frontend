import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Dataset extends Model {
  @attr uri;
  @attr prefLabel;

  @hasMany('dataset') datasets;
}
