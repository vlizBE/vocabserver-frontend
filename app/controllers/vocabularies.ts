import Model from '@ember-data/model';
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
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
      created: new Date(),
      sources: vocabUri,
    });
    yield record.save();
    // yield this.downloadVocab(record.id); // Handled by delta
  }

  @action
  async deleteVocab(vocabulary: Model) {
    await vocabulary.destroyRecord();
  }
}
