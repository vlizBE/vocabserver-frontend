import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

const TYPE_FILE_DUMP = 'http://vocabsearch.data.gift/dataset-types/FileDump';
const TYPE_LDES = 'http://vocabsearch.data.gift/dataset-types/LDES';

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
    { label: 'JSON-LD', value: 'https://www.w3.org/ns/formats/data/JSON-LD' },
    { label: 'N-Triples', value: 'http://www.w3.org/ns/formats/N-Triples' },
    { label: 'N3', value: 'http://www.w3.org/ns/formats/N3' },
    { label: 'RDF_XML', value: 'http://www.w3.org/ns/formats/RDF_XML' },
    { label: 'RDFa', value: 'http://www.w3.org/ns/formats/RDFa' },
    { label: 'Turtle', value: 'http://www.w3.org/ns/formats/Turtle' },
  ];

  get types() {
    return this.model;
  }

  get isLdes() {
    return this.downloadType?.uri === TYPE_LDES;
  }
  get isFileDump() {
    return this.downloadType?.uri === TYPE_FILE_DUMP;
  }

  @task
  *createAndRunDownloadJob(dataset) {
    const record = this.store.createRecord('vocab-download-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
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
    yield this.createAndRunDownloadJob.perform(dataset);
    yield this.router.transitionTo('vocabulary', vocabularyMeta.id);
  }
}
