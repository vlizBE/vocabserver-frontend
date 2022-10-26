import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Store from '@ember-data/store';

export default class AddVocabComponent extends Component {
  @service declare store: Store;
  @tracked vocabUrl = '';
  @tracked vocabName = '';
  @tracked errorMsg = '';

  @action
  async submitVocab(event: Event) {
    event.preventDefault();
    const record = this.store.createRecord('vocabulary', {
      url: this.vocabUrl,
      name: this.vocabName,
    });
    try {
      await record.save();
      this.vocabUrl = '';
      this.vocabName = '';
    } catch (error) {
      if (error instanceof Error) {
        this.errorMsg = error.message;
      } else {
        this.errorMsg = String(error);
      }
    }
  }
}
