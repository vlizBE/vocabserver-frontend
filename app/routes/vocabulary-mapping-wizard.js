import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VocabulariesRoute extends Route {
  @service store;

  async model(params) {
    const ds = await this.store.query('dataset', {
      'filter[vocabulary][:id:]': params.vocabulary_id,
      include: 'vocabulary,classes,properties',
    });
    if (ds.length) {
      return ds.firstObject;
    }
  }
}
