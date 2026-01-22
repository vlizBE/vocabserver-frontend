import Model, { attr, belongsTo } from '@ember-data/model';

export default class FilterCountInputModel extends Model {
  @attr('string') uri;

  @attr('datetime') created;
  @attr('datetime') modified;

  @attr('string') sourceClass;
  @attr('string') sourcePathString;
  @attr('string') sourceFilter;

  @belongsTo('dataset', {inverse: 'filterCountInputs'}) dataset;
}
