import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('vocabulary', params.vocabulary_id);
  }

  async afterModel(model) {
    super.afterModel(...arguments);
    this.sourceDatasets = await this.store.query('dataset', {
      'filter[vocabulary][:id:]': model.id,
      include: 'data-dumps',
    });
    if (this.sourceDatasets.length) {
      this.jobs = await this.store.query('vocab-download-job', {
        'filter[sources]': this.sourceDatasets.mapBy('downloadPage').join(','),
        sort: '-created',
      });
    }
  }

  async setupController(controller) {
    super.setupController(...arguments);
    controller.jobs = this.jobs;
  }
}
