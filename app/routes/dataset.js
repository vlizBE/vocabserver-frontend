import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  queryParams = {
    uri: {
      refreshModel: true,
    },
  };

  @service store;

  async model(params) {
    const ds = await this.store.query('dataset', {
      'filter[:uri:]': params.uri,
      sort: '-classes.entities,-properties.entities',
      include: 'classes,properties',
    });
    if (ds.length) {
      return ds.firstObject;
    }
  }
}
