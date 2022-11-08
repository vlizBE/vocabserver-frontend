import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * @argument onClose
 * @argument onSubmit
 */
export default class AddVocabComponent extends Component {
  @service declare store;

  @action
  async submit(params) {
    const record = this.store.createRecord('vocabulary', params);
    this.args.onSubmit(record);
  }
}
