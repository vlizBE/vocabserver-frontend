import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';

export default class VocabularyMappingWizardController extends Controller {
  @service store;
  @service job;

  get hasDump() {
    return isPresent(this.model.dataDumps);
  }

  get hasMeta() {
    return isPresent(this.model.properties);
  }

  @action
  async unifyVocab(id) {
    await fetch(`/content-unification-jobs/${id}/run`, {
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
    yield this.job.monitorProgress(record);
  }

  @task
  *createAndRunMetadataExtractionJob(dataset) {
    const record = this.store.createRecord('metadata-extraction-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
    yield this.job.monitorProgress(record);
  }

  @task
  *createAndRunUnifyVocabJob(dataset) {
    const record = this.store.createRecord('content-unification-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
    yield this.job.monitorProgress(record);
  }
}
