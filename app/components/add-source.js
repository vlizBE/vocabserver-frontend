import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AddSourceComponent extends Component {
  @service store;
  @tracked downloadType;
  @tracked downloadUrl;
  @tracked downloadFormat;

  formatOptions = [
    { label: 'JSON-LD', value: 'https://www.w3.org/ns/formats/data/JSON-LD' },
    { label: 'N-Triples', value: 'http://www.w3.org/ns/formats/N-Triples' },
    { label: 'N3', value: 'http://www.w3.org/ns/formats/N3' },
    { label: 'RDF_XML', value: 'http://www.w3.org/ns/formats/RDF_XML' },
    { label: 'RDFa', value: 'http://www.w3.org/ns/formats/RDFa' },
    { label: 'Turtle', value: 'http://www.w3.org/ns/formats/Turtle' },
  ];

  @action
  async submit() {
    let data = await this.store.findAll('dataset-type');
    // TODO: add downloadFormat options
    this.downloadType = data.findBy('prefLabel', 'File dump');

    this.args.onSubmit(
      this.downloadType,
      this.downloadUrl,
      this.downloadFormat
    );
  }
}
