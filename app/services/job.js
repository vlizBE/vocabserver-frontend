import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class JobService extends Service {
  @task
  *monitorProgress(job) {
    while (!job.hasEnded) {
      yield timeout(1000);
      yield job.reload();
    }
    return job;
  }
}
