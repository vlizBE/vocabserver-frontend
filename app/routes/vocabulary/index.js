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
    let vocabularyId = this.modelFor('vocabulary').id;
    options.filter = { vocabulary: { ':id:': vocabularyId } };
    return {
      dataset: this.store.query('dataset', options),
      vocabulary_id: vocabularyId,
    };
  }
}
