import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class VocabulariesController extends Controller {
  @service store;
  @service router;

  @tracked showCreationModal = false;

  @action
  async downloadVocab(id) {
    await fetch(`/vocab-download-jobs/${id}/run`, {
      method: 'POST',
    });
  }

  @task
  *createAndRunDownloadJob(dataset) {
    const record = this.store.createRecord('vocab-download-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
    // yield this.downloadVocab(record.id); // Handled by delta
  }

  @action
  async handleNewVocabulary(record) {
    record.sourceDataset = await (await record.sourceDataset).save();
    await record.save();
    this.showCreationModal = false;
    this.router.transitionTo('vocabulary-mapping-wizard', record.id);
  }

  @action
  async deleteVocab(vocabulary) {
    await fetch(`content-unification-jobs/delete-vocabulary/${vocabulary.id}`, {
      method: 'POST',
    });
    this.send('reloadModel');
  }
}
