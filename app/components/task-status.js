import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';

export default class TaskStatusComponent extends Component {
  @task
  *monitorTaskProgress(task) {
    while (!task.hasEnded) {
      yield timeout(1000);
      yield task.reload();
    }
    return task;
  }
}
