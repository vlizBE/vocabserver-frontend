import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

const DEBOUNCE_MS = 250;
const LANGUAGES = [
  {
    label: 'English',
    iso: 'en',
  },
  {
    label: 'Nederlands',
    iso: 'nl',
  },
  {
    label: 'Français',
    iso: 'fr',
  },
  {
    label: 'Deutsch',
    iso: 'de',
  },
];
export default class SearchController extends Controller {
  queryParams = ['q', 'lang'];
  @service router;
  @tracked q;
  @tracked lang = 'en';
  @tracked qBuffer;

  languages = LANGUAGES;

  @restartableTask
  *setQAndSearch(event) {
    const qBuffer = event.target.value;
    this.qBuffer = qBuffer;
    yield timeout(DEBOUNCE_MS);
    this.q = this.qBuffer;
  }
}
