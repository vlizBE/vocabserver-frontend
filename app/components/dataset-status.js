import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

import config from 'frontend-vocab-search-admin/config/constants';

export default class DatasetStatusComponent extends Component {
  @service store;

  get task() {
    return this.lastTask.value;
  }

  get isDump() {
    return this.datasetType.value?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  datasetType = trackedFunction(this, async () => {
    return await this.args.dataset?.type;
  });

  lastTask = trackedFunction(this, async () => {
    const datasetId = this.args.dataset?.id;
    if (datasetId) {
      await Promise.resolve();
      const tasks = await this.store.query('task', {
        'filter[input-containers][content]': this.args.dataset.uri,
        sort: '-created',
        'filter[operation]':
          'http://mu.semte.ch/vocabularies/ext/VocabDownloadJob',
        'page[size]': 1,
      });
      if (tasks.length === 1) return tasks.firstObject;
    }
  });
}
