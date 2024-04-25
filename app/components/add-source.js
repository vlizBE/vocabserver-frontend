import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'frontend-vocab-search-admin/config/constants';

const FORMAT_OPTIONS = config.FORMAT_OPTIONS;

export default class AddSourceComponent extends Component {
  @service store;
  @tracked downloadType;
  @tracked downloadUrl;
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
    return this.args.types;
  }

  get isLdes() {
    return this.downloadType?.uri === config.DATASET_TYPES.LDES;
  }
  get isFileDump() {
    return this.downloadType?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  @action
  async submit() {
    this.args.onSubmit(
      this.downloadType,
      this.downloadUrl,
      this.downloadFormat,
      this.ldesDereference,
      this.ldesMaxRequests
    );
  }
}
