import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class VocabulariesNewRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('dataset-type');
  }

  resetController(controller) {// eslint-disable-line
    this.controller.reset();// eslint-disable-line
  }
}
