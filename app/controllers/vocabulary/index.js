import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

const TYPE_FILE_DUMP = 'http://vocabsearch.data.gift/dataset-types/FileDump';

export default class VocabularyIndexController extends Controller {
  @service store;
  @service router;
  @tracked showAddSource = false;
  @tracked page = 0;
  @tracked size = 20;
  @tracked ldesDereference = false;
  @tracked ldesMaxRequests = 120;

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
    this.router.refresh();
  }

  @task
  *addSource(downloadType, downloadUrl, downloadFormat) {
    const vocabularyMeta = this.store.findRecord(
      'vocabulary',
      this.model.vocabulary_id
    );
    yield vocabularyMeta;
    const dataset = this.store.createRecord('dataset', {
      downloadPage: downloadUrl,
      format: downloadFormat.value,
      dereferenceMembers: this.ldesDereference,
      maxRequests: this.ldesMaxRequests,
      vocabulary: vocabularyMeta,
      type: downloadType,
    });
    yield dataset.save();
    if (downloadFormat.value === TYPE_FILE_DUMP) {
      yield this.createAndRunDownloadJob(dataset);
    }
    yield this.switchShowAddSource();
    this.router.refresh();
  }
}
