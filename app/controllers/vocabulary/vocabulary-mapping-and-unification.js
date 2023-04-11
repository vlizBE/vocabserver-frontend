import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class VocabularyMappingAndUnificationController extends Controller {
  @service store;
  @service job;

  @tracked vocabulary;

  get hasDump() {
    return isPresent(this.model.dataset.dataDumps);
  }

  get hasMeta() {
    return (
      isPresent(this.model.dataset.properties) &&
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
  *createAndRunDownloadJob() {
    const runningJobs = [];
    for (const dataset of this.model.datasets.toArray()) {
      const record = this.store.createRecord('vocab-download-job', {
        created: new Date(),
        sources: dataset.get('uri'),
      });
      yield record.save();
      runningJobs.push(this.job.monitorProgress.perform(record));
    }
    yield Promise.all(runningJobs);
    this.send('reloadModel');
  }

  @task
  *createAndRunMetadataExtractionJob() {
    for (const dataset of this.model.datasets.toArray()) {
      const record = this.store.createRecord('metadata-extraction-job', {
        created: new Date(),
        sources: dataset.get('uri'),
      });
      yield record.save();
      yield this.job.monitorProgress.perform(record);
    }
    this.send('reloadModel');
  }

  @action
  async handleNewMappingShape(nodeShape) {
    nodeShape.vocabulary = this.model.dataset.get('vocabulary');
    await nodeShape.save();
    await Promise.all(nodeShape.propertyShapes.map((x) => x.save()));
    this.send('reloadModel');
  }

  @task
  *createAndRunUnifyVocabJob() {
    const record = this.store.createRecord('content-unification-job', {
      created: new Date(),
      sources: this.model.vocabulary.get('uri'),
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
