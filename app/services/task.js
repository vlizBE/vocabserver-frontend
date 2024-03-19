import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class TaskService extends Service {
  @task
  *monitorProgress(taskRecord) {
    while (!taskRecord.hasEnded) {
      yield timeout(1000);
      yield taskRecord.reload();
    }
    return taskRecord;
  }
}
