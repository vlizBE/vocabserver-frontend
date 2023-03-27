import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class VocabularyIndexController extends Controller {
  @service store;
  @tracked showAddSource = false;
  @tracked page = 0;
  @tracked size = 20;

  @action
  async switchShowAddSource() {
    this.showAddSource = !this.showAddSource;
  }

  @action
  async deleteDataset(dataset) {
    await dataset.destroyRecord();
  }
  @task
  *createAndRunDownloadJob(dataset) {
    const record = this.store.createRecord('vocab-download-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
  }
}
