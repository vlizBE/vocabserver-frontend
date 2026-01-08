import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class VocabulariesIndexController extends Controller {
  @service store;
  @service router;
  @tracked sort = ':no-case:name';
  @tracked page = 0;
  @tracked size = 20;

  @action
  async deleteVocab(vocabulary) {
    await vocabulary.destroyRecord();
    this.router.refresh();
  }

  @action
  async handleDeleteTaskFinished(task) {
    if (task.isSuccessful) {
      return this.refresh();
    }
  }

  @action
  async refresh() {
    this.router.refresh();
  }
}
