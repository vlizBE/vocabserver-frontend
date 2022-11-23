import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * @argument onClose
 * @argument onSubmit
 */
export default class AddVocabComponent extends Component {
  @service store;

  formatOptions = [
    { label: 'N3', value: 'http://www.w3.org/ns/formats/N3' },
    { label: 'N-Triples', value: 'http://www.w3.org/ns/formats/N-Triples' },
    { label: 'RDF_XML', value: 'http://www.w3.org/ns/formats/RDF_XML' },
    { label: 'RDFa', value: 'http://www.w3.org/ns/formats/RDFa' },
    { label: 'Turtle', value: 'http://www.w3.org/ns/formats/Turtle' },
  ];

  @action
  async submit(params) {
    const vocabularyMeta = this.store.createRecord('vocabulary', params);
    const sourceDataset = this.store.createRecord('dataset', params);
    sourceDataset.downloadPage = params.downloadPage;
    sourceDataset.format = params.format.value;
    sourceDataset.sparqlEndpoint = params.sparqlEndpoint;

    vocabularyMeta.sourceDataset = sourceDataset;
    vocabularyMeta.name = params.name;
    this.args.onSubmit(vocabularyMeta);
  }
}
