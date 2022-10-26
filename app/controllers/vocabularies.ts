import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Store from '@ember-data/store';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class VocabulariesController extends Controller {
  @service declare store: Store;

  @action
  async downloadVocab(id: string) {
    await fetch(`/vocab-download-jobs/${id}/run`, {
      method: 'POST',
    });
  }

  @task
  *createAndRunDownloadJob(vocabUri: string) {
    const record = this.store.createRecord('vocab-download-job', {
      created: Date.now(),
      sources: vocabUri,
    });
    yield record.save();
    yield this.downloadVocab(record.id);
  }

  @action
  async deleteVocab(vocabulary: any) { // TODO: typechecking serves no purpose when used this way
    await vocabulary.destroyRecord();
  }
}
