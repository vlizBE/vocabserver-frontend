import Model, { attr } from '@ember-data/model';

export default class Job extends Model {
  RUNNING = 'http://vocab.deri.ie/cogs#Running';
  SUCCESS = 'http://vocab.deri.ie/cogs#Success';
  FAILED = 'http://vocab.deri.ie/cogs#Fail';

  @attr('date')
  declare created?: Date;

  @attr('string')
  declare sources?: string;

  @attr('string')
  declare results?: string;

  @attr('string')
  declare status?: string;

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
