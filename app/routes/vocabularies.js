import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('vocabulary');
  }

  @action
  reloadModel() {
    this.refresh();
  }
}
