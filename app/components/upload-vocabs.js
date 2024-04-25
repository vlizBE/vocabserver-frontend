import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { trackedFunction } from 'ember-resources/util/function';

export default class UploadVocabs extends Component {
  @tracked file;
  @tracked importTask;
  @service store;

  @action
  setImportFile(file) {
    this.file = file;
    this.importTask = undefined;
  }

  newVocabs = trackedFunction(this, async () => {
    if (this.importTask.isSuccessful) {
      const vocabUris = (await this.importTask.resultsContainers)[0].content;
      await Promise.resolve();
      const vocabs = await Promise.all(
        vocabUris.map(async (vocabUri) => {
          const vocabsFetch = await this.store.query('vocabulary', {
            'filter[:uri:]': vocabUri,
          });
          return vocabsFetch[0];
        })
      );
      return vocabs;
    }
    return [];
  });

  uploadImport = task(async () => {
    try {
      const uploadResponse = await (await this.file.upload('/files')).json();
      const fileRecord = await this.store.findRecord(
        'file',
        uploadResponse.data.id
      );

      if (fileRecord?.uri) {
        this.startExport.perform(fileRecord.uri);
      }
    } catch (e) {
      console.warn(
        `Error during file upload: ${e.message || JSON.stringify(e)}`,
        {
          id: 'failure.upload',
        }
      );
    }
  });

  startExport = task(async (fileUri) => {
    const now = new Date();
    const container = this.store.createRecord('data-container', {
      content: [fileUri],
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    await container.save();
    const job = this.store.createRecord('job', {
      created: now,
      creator: 'empty', // needs some content for job-controller to work
      modified: now,
      operation:
        'http://lblod.data.gift/id/jobs/concept/JobOperation/vocabs-import',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
    });
    await job.save();
    this.importTask = this.store.createRecord('task', {
      job,
      inputContainers: [container],
      operation: 'http://mu.semte.ch/vocabularies/ext/VocabsImportJob',
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      index: '0',
      created: now,
      modified: now,
    });
    await this.importTask.save();
  });
}
