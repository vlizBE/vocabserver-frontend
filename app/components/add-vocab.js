import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * @argument onClose
 * @argument onSubmit
 */
export default class AddVocabComponent extends Component {
  @service store;

  @action
  async submit(params) {
    const vocabularyMeta = this.store.createRecord('vocabulary', params);
    const sourceDataset = this.store.createRecord('dataset', params);
    sourceDataset.downloadPage = params.downloadPage;
    sourceDataset.format = params.format;
    sourceDataset.sparqlEndpoint = params.sparqlEndpoint;

    vocabularyMeta.sourceDataset = sourceDataset;
    vocabularyMeta.name = params.name;
    this.args.onSubmit(vocabularyMeta);
  }
}
