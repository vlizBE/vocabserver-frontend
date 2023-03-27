import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class VocabulariesShowController extends Controller {
  @action
  async updateVocabName(newName) {
    this.model.name = newName;
    await this.model.save();
  }
}
