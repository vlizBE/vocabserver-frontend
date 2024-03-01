import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class VocabularyUnificationRoute extends Route {
  @service store;

  async model() {
    const id = this.modelFor('vocabulary').id;
    const ds = await this.store.query('dataset', {
      'filter[vocabulary][:id:]': id,
      include:
        'data-dumps,vocabulary,vocabulary.mapping-shape,vocabulary.mapping-shape.property-shapes,classes,properties',
      sort: '-classes.entities',
    });
    if (ds.length) {
      const vocabulary = await ds.firstObject.vocabulary;
      // We sort by descending number of class entities and consider the dataset
      // with the largest number of entities as the "primary" one.
      const lastUnification = (
        await this.store.query('task', {
          'filter[input-containers][content]': vocabulary.uri,
          sort: '-created',
          'filter[status]':
            'http://redpencil.data.gift/id/concept/JobStatus/success',
          'filter[operation]':
            'http://mu.semte.ch/vocabularies/ext/ContentUnificationJob',
          'page[size]': 1,
        })
      ).firstObject;
      return {
        dataset: ds.firstObject,
        datasets: ds,
        lastUnification,
        vocabulary,
      };
    }
  }

  @action
  reloadModel() {
    this.refresh();
  }
}
