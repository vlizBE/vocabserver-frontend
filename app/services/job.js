import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class JobService extends Service {
  @task
  *monitorProgress(jobRecord) {
    while (!jobRecord.hasEnded) {
      yield timeout(1000);
      yield jobRecord.reload();
    }
    return jobRecord;
  }
}
