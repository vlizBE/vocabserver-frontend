import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class VocabularyModel extends Model {
  @service store;

  @attr('string') name;

  @attr('string') uri;
  @attr('string') alias;

  @hasMany('dataset') sourceDatasets;
  @belongsTo('shacl-node-shape') mappingShape;
  @hasMany('data-container') dataContainers;

  get deleting() {
    return this.deletingTask.then((t) => t && !t.hasEnded)
  }
  get deletingTask() {
    return this._getDeletingTask()
  }

  get deleteWaiting() {
    return this.deleteWaitingTask.then((t) => t && !t.hasEnded)
  }
  get deleteWaitingTask() {
    return this._getDeleteWaitingTask()
  }

  async _getDeletingTask() {
    const tasks = await this.store.query('task', {
      'filter[input-containers][content]': this.uri,
      'filter[operation]': 'http://mu.semte.ch/vocabularies/ext/VocabDeleteJob',
      sort: '-created',
      'page[size]': 1
    })
    return tasks.firstObject
  }

  async _getDeleteWaitingTask() {
    const tasks = await this.store.query('task', {
      'filter[input-containers][content]': this.uri,
      'filter[operation]': 'http://mu.semte.ch/vocabularies/ext/VocabDeleteWaitJob',
      sort: '-created',
      'page[size]': 1
    })
    return tasks.firstObject
  }
}
