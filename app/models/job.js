import Model, { attr, hasMany } from '@ember-data/model';

export default class Job extends Model {
  RUNNING = 'http://redpencil.data.gift/id/concept/JobStatus/busy';
  SUCCESS = 'http://redpencil.data.gift/id/concept/JobStatus/success';
  FAILED = 'http://redpencil.data.gift/id/concept/JobStatus/failed';

  @attr('string') uri;
  @attr('string') status;
  @attr('datetime') created;
  @attr('string') creator;
  @attr('datetime') modified;
  @attr('string') operation;

  @attr('string') sources;

  @attr('string') results;

  @attr('string') status;

  // @belongsTo('job-error', { async: true, inverse: null }) error;
  @hasMany('task', { async: true, inverse: 'job' }) tasks;

  get hasEnded() {
    return this.status === this.SUCCESS || this.status === this.FAILED;
  }

  get succeeded() {
    return this.status === this.SUCCESS;
  }

  get failed() {
    return this.status === this.FAILED;
  }

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
}
