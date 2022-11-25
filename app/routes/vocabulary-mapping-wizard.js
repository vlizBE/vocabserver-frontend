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
      return ds.firstObject;
    }
  }

  async afterModel(model) {
    this.vocabulary = await model.vocabulary;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.vocabulary = this.vocabulary;
  }

  @action
  reloadModel() {
    this.refresh();
  }
}
