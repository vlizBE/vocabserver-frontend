import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VocabulariesIndexRoute extends Route {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      include: 'data-containers.input-from-tasks'
    };

    if (params.filter) {
      options['filter'] = params.filter;
    }
    return this.store.query('vocabulary', options);
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    let controller = this.controllerFor(this.routeName);
    if (controller && transition.from?.name === transition.to?.name) {
      controller.set('isLoadingModel', true);
      transition.promise.finally(function () {
        controller.set('isLoadingModel', false);
      });
      return false;
    }
    return true;
  }
}
