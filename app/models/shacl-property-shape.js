import Model, { attr, belongsTo } from '@ember-data/model';

export default class ShaclPropertyShape extends Model {
  @attr uri;

  @attr path;
  @attr name;
  @attr description;
  @attr minCount;

  @belongsTo('shacl-node-shape') nodeShape;
}
