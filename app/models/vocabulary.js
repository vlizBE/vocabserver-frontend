import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VocabularyModel extends Model {
  @attr('string') name;

  @attr('string') uri;
  @attr('string') alias;

  @hasMany('dataset') sourceDatasets;
  @belongsTo('shacl-node-shape') mappingShape;
}
