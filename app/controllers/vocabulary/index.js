import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import config from 'frontend-vocab-search-admin/config/constants';

export default class VocabularyIndexController extends Controller {
  @service store;
  @service router;
  @tracked showAddSource = false;
  @tracked page = 0;
  @tracked size = 20;
  @tracked ldesMaxRequests = 120;

  @action
  async switchShowAddSource() {
    this.showAddSource = !this.showAddSource;
  }

  @action
  isDump(dataset) {
    return dataset.datasetType.value?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  get types() {
    return this.model.types;
  }

  @action
  async deleteDataset(dataset) {
    await dataset.destroyRecord();
    this.router.refresh();
  }

  @task
  *createAndRunDownloadJob(dataset) {
    const now = new Date();
    const container = this.store.createRecord('data-container', {
      content: [dataset.get('uri')],
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    yield container.save();
    const job = this.store.createRecord('job', {
      created: now,
      creator: 'empty', // needs some content for job-controller to work
      modified: now,
      operation:
        'http://lblod.data.gift/id/jobs/concept/JobOperation/vocab-download',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    yield job.save();
    const task = this.store.createRecord('task', {
      job,
      inputContainers: [container],
      operation: 'http://mu.semte.ch/vocabularies/ext/VocabDownloadJob',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      index: '0',
      created: now,
      modified: now,
    });
    yield task.save();
    this.router.refresh();
  }

  @task
  *addSource(
    downloadType,
    downloadUrl,
    downloadFormat,
    ldesMaxRequests = 120
  ) {
    const vocabularyMeta = this.store.findRecord(
      'vocabulary',
      this.model.vocabulary_id
    );
    yield vocabularyMeta;
    const dataset = this.store.createRecord('dataset', {
      downloadPage: downloadUrl,
      format: downloadFormat?.value,
      maxRequests: ldesMaxRequests,
      vocabulary: vocabularyMeta,
      type: downloadType,
    });
    yield dataset.save();
    if (downloadType?.uri === config.DATASET_TYPES.FILE_DUMP) {
      yield this.createAndRunDownloadJob.perform(dataset);
    }
    yield this.switchShowAddSource();
    this.router.refresh();
  }
}
