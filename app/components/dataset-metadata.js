import Component from '@glimmer/component';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class DatasetMetadataComponent extends Component {
  @service store;

  @tracked classes;
  @tracked properties;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const datasets = yield this.store.query('dataset', {
      'filter[:id:]': this.args.dataset.id,
      include: 'classes,properties',
    });
    this.dataset = datasets.firstObject;
    this.classes = (yield this.dataset.get('classes'))
      .sortBy('entities')
      .reverseObjects();
    this.properties = (yield this.dataset.get('properties'))
      .sortBy('entities')
      .reverseObjects();
  }
}
