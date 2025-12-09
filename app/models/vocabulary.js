import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VocabularyModel extends Model {
  @attr('string') name;

  @attr('string') uri;
  @attr('string') alias;

  @hasMany('dataset') sourceDatasets;
  @belongsTo('shacl-node-shape') mappingShape;
  @hasMany('data-container') dataContainers;

  get deleting() {
    return this.deletingTask
  }
  get deletingTask() {
    return this._getDeletingTask()
  }

  async _getDeletingTask() {
    const dataContainers = await this.dataContainers
    const tasks = await Promise.all(dataContainers.map((dc) => dc.inputFromTasks))

    return tasks.flat().find((task) => {
      console.log(task.operation)
      return task.operation === 'http://mu.semte.ch/vocabularies/ext/VocabDeleteJob'
    })
  }
}
