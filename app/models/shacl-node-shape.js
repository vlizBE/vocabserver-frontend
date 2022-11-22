import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ShaclNodeShape extends Model {
  @attr uri;

  @attr targetClass;
  @hasMany('shacl-property-shape') propertyShapes;
  @belongsTo('vocabulary') vocabulary;
}
