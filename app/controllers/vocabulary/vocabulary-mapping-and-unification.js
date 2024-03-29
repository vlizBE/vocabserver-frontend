import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class VocabularyMappingAndUnificationController extends Controller {
  @service store;
  @service task;

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
    const runningTasks = [];
    for (const dataset of this.model.datasets.toArray()) {
      const record = this.store.createRecord('vocab-download-job', {
        created: new Date(),
        sources: dataset.get('uri'),
      });
      yield record.save();
      runningTasks.push(this.task.monitorProgress.perform(record));
    }
    yield Promise.all(runningTasks);
    this.send('reloadModel');
  }

  @task
  *createAndRunMetadataExtractionJob() {
    for (const dataset of this.model.datasets.toArray()) {
      const now = new Date();
      const container = this.store.createRecord('data-container', {
        content: [dataset.get('uri')],
      });
      yield container.save();
      const task = this.store.createRecord('task', {
        inputContainers: [container],
        operation: 'http://mu.semte.ch/vocabularies/ext/MetadataExtractionJob',
        status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
        index: '0',
        created: now,
        modified: now,
      });
      yield task.save();
    }
    this.send('reloadModel');
  }

  @action
  async handleNewMappingShape(nodeShape) {
    nodeShape.vocabulary = this.model.dataset.get('vocabulary');
    await nodeShape.save();
    await Promise.all(nodeShape.propertyShapes.map((x) => x.save()));
    await this.createAndRunUnifyVocabJob.perform();
    this.send('reloadModel');
  }

  @task
  *createAndRunUnifyVocabJob() {
    const now = new Date();
    const container = this.store.createRecord('data-container', {
      content: [this.model.vocabulary.get('uri')],
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    yield container.save();
    const task = this.store.createRecord('task', {
      inputContainers: [container],
      operation: 'http://mu.semte.ch/vocabularies/ext/ContentUnificationJob',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      index: '0',
      created: now,
      modified: now,
    });
    yield task.save();
    yield this.task.monitorProgress.perform(task);
    this.send('reloadModel');
  }

  @action
  async updateVocabName(newName) {
    this.model.vocabulary.name = newName;
    await this.model.vocabulary.save();
  }
}
