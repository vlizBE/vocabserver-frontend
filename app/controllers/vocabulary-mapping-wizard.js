import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class VocabularyMappingWizardController extends Controller {
  @service store;
  @service job;

  @tracked vocabulary;

  get hasDump() {
    return isPresent(this.model.dataset.dataDumps);
  }

  get hasMeta() {
    return (
      isPresent(this.model.dataset.properties) ||
      isPresent(this.model.dataset.classes)
    );
  }

  get hasMapping() {
    return isPresent(this.mappingShape);
  }

  get mappingShape() {
    return this.model.vocabulary.belongsTo('mappingShape').value();
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
    yield this.job.monitorProgress.perform(record);
    this.send('reloadModel');
  }

  @task
  *createAndRunMetadataExtractionJob(dataset) {
    const record = this.store.createRecord('metadata-extraction-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
    yield this.job.monitorProgress.perform(record);
    this.send('reloadModel');
  }

  @action
  async handleNewMappingShape(nodeShape) {
    nodeShape.vocabulary = this.model.dataset.get('vocabulary');
    await nodeShape.save();
    const propertyShape = nodeShape.propertyShapes.firstObject;
    await propertyShape.save();
    this.send('reloadModel');
  }

  @task
  *createAndRunUnifyVocabJob(dataset) {
    const record = this.store.createRecord('content-unification-job', {
      created: new Date(),
      sources: dataset.get('uri'),
    });
    yield record.save();
    yield this.job.monitorProgress.perform(record);
    this.send('reloadModel');
  }

  @action
  async updateVocabName(newName) {
    this.model.vocabulary.name = newName;
    await this.model.vocabulary.save();
  }
}
