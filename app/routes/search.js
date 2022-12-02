import Route from '@ember/routing/route';
import search from '../utils/mu-search';

export default class SearchRoute extends Route {
  queryParams = {
    q: {
      refreshModel: true,
    },
    lang: {
      refreshModel: true,
    },
  };

  async model(params) {
    const page = 0;
    const size = 15;
    const sort = null; // By relevance
    this.q = params.q;
    let searchField;
    if (params.lang) {
      searchField = `prefLabel.${params.lang}`;
    } else {
      searchField = 'prefLabel.*';
    }
    const filter = {
      [searchField]: params.q,
    };
    return search('concepts', page, size, sort, filter, (searchData) => {
      const entry = searchData.attributes;
      if (params.lang && entry.prefLabel[params.lang]) {
        entry.prefLabel = entry.prefLabel[params.lang];
      } else if (Object.values(entry.prefLabel).length) {
        entry.prefLabel = Object.values(entry.prefLabel)[0];
      }
      entry.id = searchData.id;
      return entry;
    });
  }

  async setupController(controller) {
    super.setupController(...arguments);
    controller.qBuffer = this.q;
  }
}
