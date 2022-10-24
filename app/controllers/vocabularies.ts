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
    try {
    let res = await fetch(`/fetch/${id}`, {
      method: 'POST',
    });
    } catch (e) {
      
    }
    this.downloadBtnTxt = '⬇️';
  }

  @action
  async deleteVocab(id: string) {
    let record = await this.store.findRecord('vocabulary', id);
    record.deleteRecord();
    await record.save();
  }
}
