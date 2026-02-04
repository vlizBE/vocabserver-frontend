import Model, { attr, belongsTo } from '@ember-data/model';

export default class FilterCountOutputModel extends Model {
  @attr('string') uri;

  @attr('datetime') created;
  @attr('datetime') modified;

  @attr('string') query;
  @attr('boolean') valid;
  @attr('number') count;
  @attr('string') warning;
  @attr('string') error;

  @belongsTo('dataset', {inverse: 'filterCountOutputs'}) dataset;

  get status() {
    if (this.error || !this.valid) {
      return 'danger';
    } else if (this.warning || this.count === 0) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
