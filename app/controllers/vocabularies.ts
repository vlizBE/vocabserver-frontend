import Model from '@ember-data/model';
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';

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
      created: new Date(),
      sources: vocabUri,
    });
    await record.save();
  }

  @action
  async deleteVocab(vocabulary: Model) {
    await vocabulary.destroyRecord();
  }
}
