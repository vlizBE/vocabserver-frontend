import Model, { attr, belongsTo } from '@ember-data/model';

export default class VocabularyModel extends Model {
  @attr('string') name;

  @attr('string') uri;

  @belongsTo('dataset') sourceDataset;
  @belongsTo('shacl-node-shape') mappingShape;
}
