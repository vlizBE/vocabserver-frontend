import Route from '@ember/routing/route';
import search from '../utils/mu-search';
import { action } from '@ember/object';

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
    // this makes this query the same as the webcomponent base query
    const qStartMatch =
      !this.q || this.q?.trim() === ''
        ? '*'
        : this.q
            .split(' ')
            .map((word) => `(${word}*|${word})`)
            .join(' ');
    const filter = {
      ':sqs:prefLabel.*,tagLabels': qStartMatch,
    };
    return search('concepts', page, size, sort, filter, (searchData) => {
      const entry = searchData.attributes;
      entry.id = searchData.id;
      return entry;
    });
  }

  @action
  loading(transition) {
    // see snippet in https://api.emberjs.com/ember/3.27/classes/Route/events/loading?anchor=loading
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    if (controller && transition.from?.name === transition.to?.name) {
      controller.set('isLoadingModel', true);
      transition.promise.finally(() => {
        controller.set('isLoadingModel', false);
      });
      return false;
    }
    return true;
  }

  async setupController(controller) {
    super.setupController(...arguments);
    controller.qBuffer = this.q;
  }
}
