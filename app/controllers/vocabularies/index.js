import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class VocabulariesIndexController extends Controller {
  @service store;
  @tracked sort = 'name';
  @tracked page = 0;
  @tracked size = 20;

  @action
  async deleteVocab(vocabulary) {
    const datasets = await vocabulary.sourceDatasets;
    const promises = datasets.map((d) => d.destroyRecord());
    const shape = await vocabulary.mappingShape;
    await Promise.all([
      ...promises,
      shape?.destroyRecord(),
      vocabulary.destroyRecord(),
    ]);
  }
}
