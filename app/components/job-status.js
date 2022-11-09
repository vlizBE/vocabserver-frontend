import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';

export default class JobStatusComponent extends Component {
  @task
  *monitorJobProgress(job) {
    while (!job.hasEnded) {
      yield timeout(1000);
      yield job.reload();
    }
    return job;
  }
}
