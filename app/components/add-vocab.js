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
    { label: 'JSON-LD', value: 'https://www.w3.org/ns/formats/data/JSON-LD' },
  ];

  @action
  async submit(params) {
    const vocabularyMeta = this.store.createRecord('vocabulary', params);
    vocabularyMeta.name = params.name;
    const downloadUrlProps = [
      'downloadPage1',
      'downloadPage2',
      'downloadPage3',
    ];
    for (const downloadUrlProp of downloadUrlProps) {
      if (params[downloadUrlProp]) {
        const sourceDataset = this.store.createRecord('dataset', params);
        sourceDataset.downloadPage = params[downloadUrlProp];
        sourceDataset.format = params.format.value;
        sourceDataset.sparqlEndpoint = params.sparqlEndpoint;
        vocabularyMeta.sourceDatasets.pushObject(sourceDataset);
      }
    }
    // vocabularyMeta.sourceDatasets = [sourceDataset];
    this.args.onSubmit(vocabularyMeta);
  }
}
