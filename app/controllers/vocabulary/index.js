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
  @tracked ldesDereference = false;
  @tracked ldesMaxRequests = 120;
  @tracked editableDataset = null;
  @tracked newAlias = null;
  @tracked error = null;

  aliasString(aliasUri) {
    return aliasUri && aliasUri.startsWith(config.DATASET_ALIAS_BASE)
      ? aliasUri.replace(config.DATASET_ALIAS_BASE, '')
      : aliasUri;
  }

  aliasUri = (aliasString) =>
    aliasString === '' ? '' : `${config.DATASET_ALIAS_BASE}${aliasString}`;

  @action
  async switchShowAddSource() {
    this.showAddSource = !this.showAddSource;
  }

  @action
  isDump(dataset) {
    return dataset.datasetType.value?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  @action
  async deleteDataset(dataset) {
    await dataset.destroyRecord();
    this.router.refresh();
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
    if (downloadType?.uri === config.DATASET_TYPES.FILE_DUMP) {
      yield this.createAndRunDownloadJob.perform(dataset);
    }
    yield this.switchShowAddSource();
    this.router.refresh();
  }

  @action
  setDatasetEdit(dataset) {
    this.editableDataset = dataset;
    this.newAlias = this.aliasString(dataset.alias);
  }

  @action
  stopEditingDataset() {
    this.editableDataset = null;
    this.newAlias = null;
    this.error = null;
  }

  @action
  async saveDatasetAlias() {
    const newAliasUri = this.aliasUri(this.newAlias);

    if (this.newAlias) {
      // check if the URI does not already exist
      // this makes the assumption only dataset aliases might have this URI base
      const datasetWithSimilarUri = await this.store.query('dataset', {
        'filter[alias]': newAliasUri,
        include: 'vocabulary',
      });
      if (datasetWithSimilarUri.length !== 0) {
        const dataset = datasetWithSimilarUri[0];
        this.error = `This alias is already used by the dataset '${
          dataset.downloadPage
        }' in vocabulary '${dataset.get('vocabulary.name')}'`;
        return;
      }
    }

    // if empty, just remove the alias
    this.editableDataset.alias = newAliasUri === '' ? null : newAliasUri;
    await this.editableDataset.save();
    this.stopEditingDataset();
  }

  @action
  setNewAlias(newVal) {
    this.newAlias = newVal;
    this.error = null;
  }
}
