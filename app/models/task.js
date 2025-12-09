import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TaskModel extends Model {
  @attr('string') uri;
  @attr('string') status;
  @attr('datetime') created;
  @attr('datetime') modified;
  @attr('string') operation;
  @attr('string') index;

  // @belongsTo('job-error', { async: true, inverse: null }) error;
  @belongsTo('job', { async: true, inverse: 'tasks' }) job;

  // @hasMany('task', { async: true, inverse: null }) parentTasks;

  //Due to lack of inheritance in mu-cl-resource, we directly link to file and collection, stuff we need here.
  @hasMany('data-container', { async: true, inverse: null }) resultsContainers;
  @hasMany('data-container', { async: true, inverse: 'inputFromTasks' }) inputContainers;

  //TODO: move this later to a propery modeled skos:Conceptscheme from backend
  statusesMap = {
    'http://redpencil.data.gift/id/concept/JobStatus/busy': 'busy',
    'http://redpencil.data.gift/id/concept/JobStatus/scheduled': 'scheduled',
    'http://redpencil.data.gift/id/concept/JobStatus/success': 'success',
    'http://redpencil.data.gift/id/concept/JobStatus/failed': 'failed',
    'http://redpencil.data.gift/id/concept/JobStatus/canceled': 'canceled',
  };

  get shortStatus() {
    return this.statusesMap[this.status];
  }

  get hasEnded() {
    return [
      'http://redpencil.data.gift/id/concept/JobStatus/success',
      'http://redpencil.data.gift/id/concept/JobStatus/failed',
      'http://redpencil.data.gift/id/concept/JobStatus/canceled',
    ].includes(this.status);
  }

  get isSuccessful() {
    return (
      this.status === 'http://redpencil.data.gift/id/concept/JobStatus/success'
    );
  }
}
