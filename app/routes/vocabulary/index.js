import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class VocabulariesShowIndexRoute extends Route {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };
    options.filter = { 'vocabulary[:id:]': params.id };
    return this.store.query('dataset', options);
  }
}
