import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class VocabulariesIndexController extends Controller {
  @service store;
  @service router;
  @tracked sort = ':no-case:name';
  @tracked page = 0;
  @tracked size = 20;

  @action
  async deleteVocab(vocabulary) {
    await vocabulary.destroyRecord();
    this.router.refresh();
  }

  @action
  async handleDeleteTaskFinished(task) {
    if (task.isSuccessful) {
      return this.refresh();
    }
  }

  @action
  async restartTask(task) {
    const now = new Date()
    const newTask = this.store.createRecord('task', {
      created: now,
      modified: now,
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      operation: task.operation,
      index: task.index,
      job: await task.job,
      inputContainers: await task.inputContainers
    });
    await newTask.save();
    this.router.refresh();
  }

  @action
  async refresh() {
    this.router.refresh();
  }
}
