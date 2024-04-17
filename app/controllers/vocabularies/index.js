import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class VocabulariesIndexController extends Controller {
  @service store;
  @tracked sort = ':no-case:name';
  @tracked page = 0;
  @tracked size = 20;

  @action
  async deleteVocab(vocabulary) {
    vocabulary.destroyRecord();
  }
}
