import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
/**
 * @argument onClose
 * @argument onSubmit
 */

const TYPE_FILE_DUMP = 'http://vocabsearch.data.gift/dataset-types/FileDump';

export default class AddVocabComponent extends Component {
  @service store;
  @tracked downloadType;
  @tracked downloadUrl;
  @tracked vocabName;
  @tracked downloadFormat;
  @tracked types;
  @tracked sources = [];

  formatOptions = [
    { label: 'JSON-LD', value: 'https://www.w3.org/ns/formats/data/JSON-LD' },
    { label: 'N-Triples', value: 'http://www.w3.org/ns/formats/N-Triples' },
    { label: 'N3', value: 'http://www.w3.org/ns/formats/N3' },
    { label: 'RDF_XML', value: 'http://www.w3.org/ns/formats/RDF_XML' },
    { label: 'RDFa', value: 'http://www.w3.org/ns/formats/RDFa' },
    { label: 'Turtle', value: 'http://www.w3.org/ns/formats/Turtle' },
  ];

  format = this.formatOptions[0];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  get isFileDump() {
    return this.downloadType?.uri == TYPE_FILE_DUMP;
  }

  @action
  submit() {
    const vocabularyMeta = this.store.createRecord('vocabulary', {
      name: this.vocabName,
      sourceDatasets: this.sources
    });
    this.args.onSubmit(vocabularyMeta);
  }

  @action
  removeSource(source) {

    this.sources.removeObject(source);
  }

  get isValidSource() {
    return this.downloadType && this.downloadUrl;
  }

  @action
  addSource() {
    if (this.isValidSource) {
      const source = this.store.createRecord('dataset',  {
        downloadPage: this.downloadUrl,
        title: this.downloadName,
        format: this.downloadFormat?.value,
        type: this.downloadType
      });

      this.sources.pushObject(source);
      this.resetAddSource();
    }
  }
  @action
  resetAddSource() {
    this.downloadType = undefined;
    this.downloadUrl = undefined;
    this.downloadName = undefined;
    this.downloadFormat = undefined;
  }

  @task
  *loadData() {
    this.types = yield this.store.findAll('dataset-type');
  }
}
