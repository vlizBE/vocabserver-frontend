import Model, { attr } from '@ember-data/model';

export default class Job extends Model {
  RUNNING = 'http://vocab.deri.ie/cogs#Running';
  SUCCESS = 'http://vocab.deri.ie/cogs#Success';
  FAILED = 'http://vocab.deri.ie/cogs#Fail';

  @attr('datetime') created;
  @attr('datetime') modified;

  @attr('string') sources;

  @attr('string') results;

  @attr('string') status;

  get hasEnded() {
    return this.status === this.SUCCESS || this.status === this.FAILED;
  }

  get succeeded() {
    return this.status === this.SUCCESS;
  }

  get failed() {
    return this.status === this.FAILED;
  }
}
