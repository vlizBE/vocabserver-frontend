import Component from '@glimmer/component';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RecentJobsComponent extends Component {
  @service store;
  @service job;

  @tracked jobs;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.jobs = yield this.store.query(this.args.jobType || 'job', {
      'filter[sources]': this.args.source.uri,
      sort: '-created',
      'page[size]': 3,
    });
  }
}
