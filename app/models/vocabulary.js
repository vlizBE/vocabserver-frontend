import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class VocabularyModel extends Model {
  @service store;

  @attr('string') name;

  @attr('string') uri;
  @attr('string') alias;

  @hasMany('dataset') sourceDatasets;
  @belongsTo('shacl-node-shape') mappingShape;
  @hasMany('data-container') dataContainers;
}
