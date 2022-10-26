import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Store from '@ember-data/store';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';

export default class VocabulariesController extends Controller {
  @service declare store: Store;

  @tracked downloadBtnTxt = '⬇️';

  @action
  async downloadVocab(id: string) {
    this.downloadBtnTxt = '⏳';
    await fetch(`/fetch/${id}`, {
      method: 'POST',
    });
    this.downloadBtnTxt = '⬇️';
  }

  @action
  async createDownloadJob(vocabUri: string) {
    const record = this.store.createRecord('vocab-download-job', {
      created: Date.now(),
      sources: vocabUri,
    });
    await record.save();
  }

  @action
  async deleteVocab(vocabulary: any) { // TODO: typechecking serves no purpose when used this way
    await vocabulary.destroyRecord();
  }
}
