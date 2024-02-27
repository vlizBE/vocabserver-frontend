import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import config from 'frontend-vocab-search-admin/config/constants';

const FORMAT_OPTIONS = config.FORMAT_OPTIONS;

export default class VocabulariesNewController extends Controller {
  @service store;
  @service router;
  @tracked downloadType;
  @tracked downloadUrl;
  @tracked vocabName;
  @tracked downloadFormat;
  @tracked ldesDereference = false;
  @tracked ldesMaxRequests = 120;

  formatOptions = [
    FORMAT_OPTIONS.JSONLD,
    FORMAT_OPTIONS.NTRIPLES,
    FORMAT_OPTIONS.N3,
    FORMAT_OPTIONS.RDFXML,
    FORMAT_OPTIONS.RDFA,
    FORMAT_OPTIONS.TURTLE,
  ];

  get types() {
    return this.model;
  }

  get isLdes() {
    return this.downloadType?.uri === config.DATASET_TYPES.LDES;
  }
  get isFileDump() {
    return this.downloadType?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  reset() {
    this.downloadType = null;
    this.downloadUrl = null;
    this.vocabName = null;
    this.downloadFormat = null;
    this.ldesDereference = false;
    this.ldesMaxRequests = 120;
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
  }

  @task
  *submit() {
    const vocabularyMeta = this.store.createRecord('vocabulary', {
      name: this.vocabName,
    });
    yield vocabularyMeta.save();
    const dataset = this.store.createRecord('dataset', {
      downloadPage: this.downloadUrl,
      format: this.downloadFormat?.value,
      dereferenceMembers: this.ldesDereference,
      maxRequests: this.ldesMaxRequests,
      vocabulary: vocabularyMeta,
      type: this.downloadType,
    });
    yield dataset.save();
    if (this.downloadType?.uri === config.DATASET_TYPES.FILE_DUMP) {
      yield this.createAndRunDownloadJob.perform(dataset);
    }
    yield this.router.transitionTo('vocabulary', vocabularyMeta.id);
  }
}
