import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  @service store;

  async model(params) {
    const ds = await this.store.query('dataset', {
      'filter[vocabulary][:id:]': params.vocabulary_id,
      include:
        'data-dumps,vocabulary,vocabulary.mapping-shape,vocabulary.mapping-shape.property-shapes,classes,properties',
    });
    if (ds.length) {
      const vocabulary = await ds.firstObject.vocabulary;
      const lastUnification = (
        await this.store.query('content-unification-job', {
          'filter[sources]': vocabulary.uri,
          'filter[status]': 'http://vocab.deri.ie/cogs#Success',
          'page[size]': 1,
          sort: '-created',
        })
      ).firstObject;
      return {
        dataset: ds.firstObject,
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
