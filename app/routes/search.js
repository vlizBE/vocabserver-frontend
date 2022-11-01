import Route from '@ember/routing/route';
import search from '../utils/mu-search';

export default class SearchRoute extends Route {
  queryParams = {
    q: {
      refreshModel: true,
    },
  };

  async model(params) {
    const page = 0;
    const size = 15;
    const sort = null; // By relevance
    this.q = params.q;
    const filter = {
      _all: params.q,
    };
    return search('concepts', page, size, sort, filter, (searchData) => {
      const entry = searchData.attributes;
      entry.id = searchData.id;
      return entry;
    });
  }

  async setupController(controller) {
    super.setupController(...arguments);
    controller.qBuffer = this.q;
  }
}
