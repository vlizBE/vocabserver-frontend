import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class VocabularyController extends Controller {
  @service declare store: Store;

  @action
  async unifyVocab(id: string) {
    await fetch(`/content-unification-jobs/${id}/run`, {
      method: 'POST',
    });
  }

  @task
  *createAndRunUnifyVocabJob(fileUri: string) {
    const record = this.store.createRecord('content-unification-job', {
      created: new Date(),
      sources: fileUri,
    });
    yield record.save();
    yield this.unifyVocab(record.id);
  }
}
