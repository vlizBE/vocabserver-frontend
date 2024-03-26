import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, dropTask } from 'ember-concurrency';

export default class DownloadVocabs extends Component {
  selectAllOption = { isSelectAll: true, name: 'Select all vocabularies' };
  @tracked options = [this.selectAllOption];
  @tracked selection = [];
  @tracked downloadLink;
  @tracked task;
  @service store;

  @action
  onVocabsChanged(selection) {
    if (selection.any((s) => s.isSelectAll)) {
      this.setAllAsSelection.perform();
    } else {
      this.setAllAsSelection.cancelAll();
      this.selection = selection;
    }
  }

  @dropTask
  *setAllAsSelection() {
    const vocabs = yield this.store.query('vocabulary', { page: 0, size: 999 });
    this.selection = vocabs;
  }

  @action
  async fetchOptions(filter) {
    const query = {};
    if (filter) {
      query['filter'] = filter;
    }
    this.options = [
      ...(await this.store.query('vocabulary', { ...query })),
      this.selectAllOption,
    ];
  }

  @action
  async showDownload(task) {
    if (task.isSuccessful) {
      const fileUri = (await task.resultsContainers)[0].content[0];
      const file = await this.store.query('file', { 'filter[:uri:]': fileUri });
      this.downloadLink = file[0].namedDownloadLink;
    }
  }

  @task
  *startExport() {
    const now = new Date();
    const container = this.store.createRecord('data-container', {
      content: this.selection.map((vocab) => vocab.uri),
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    yield container.save();
    const job = this.store.createRecord('job', {
      created: now,
      creator: 'empty', // needs some content for job-controller to work
      modified: now,
      operation:
        'http://lblod.data.gift/id/jobs/concept/JobOperation/vocabs-export',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    yield job.save();
    this.task = this.store.createRecord('task', {
      job,
      inputContainers: [container],
      operation: 'http://mu.semte.ch/vocabularies/ext/VocabsExportJob',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      index: '0',
      created: now,
      modified: now,
    });
    yield this.task.save();
  }
}
