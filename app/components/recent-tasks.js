import Component from '@glimmer/component';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class RecentTasksComponent extends Component {
  @service store;
  @service task;

  @tracked tasks;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.tasks = yield this.store.query('task', {
      'filter[input-containers][content]': this.args.source.uri,
      sort: '-created',
      'filter[operation]': this.args.operation,
      'page[size]': 3,
    });
  }
}
