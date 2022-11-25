import Controller from '@ember/controller';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

const DEBOUNCE_MS = 250;
export default class SearchController extends Controller {
  queryParams = ['q'];
  @service router;
  @tracked q;
  @tracked qBuffer;

  @restartableTask
  *setQAndSearch(event) {
    const qBuffer = event.target.value;
    this.qBuffer = qBuffer;
    yield timeout(DEBOUNCE_MS);
    this.q = this.qBuffer;
  }
}
