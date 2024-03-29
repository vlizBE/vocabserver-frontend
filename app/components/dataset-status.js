import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

import config from 'frontend-vocab-search-admin/config/constants';

export default class DatasetStatusComponent extends Component {
  @service store;

  get job() {
    return this.lastJob.value;
  }

  get isDump() {
    return this.datasetType.value?.uri === config.DATASET_TYPES.FILE_DUMP;
  }

  datasetType = trackedFunction(this, async () => {
    return await this.args.dataset?.type;
  });

  lastJob = trackedFunction(this, async () => {
    const datasetId = this.args.dataset?.id;
    if (datasetId) {
      await Promise.resolve();
      const jobs = await this.store.query(this.args.jobType || 'job', {
        'filter[sources]': this.args.dataset.uri,
        sort: '-created',
        'page[size]': 1,
      });
      if (jobs.length === 1) return jobs.firstObject;
    }
  });
}
