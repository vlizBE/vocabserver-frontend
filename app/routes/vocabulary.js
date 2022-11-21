import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('vocabulary', params.vocabulary_id);
  }

  async afterModel(model) {
    super.afterModel(...arguments);
    this.sourceDataset = await this.store.query('dataset', {
      'filter[vocabulary][:id:]': model.id,
      include: 'data-dumps',
    });
    this.jobs = await this.store.query('vocab-download-job', {
      'filter[sources]': this.sourceDataset.downloadPage,
      sort: '-created',
    });
  }

  async setupController(controller) {
    super.setupController(...arguments);
    controller.jobs = this.jobs;
  }
}
