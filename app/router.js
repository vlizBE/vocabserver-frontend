import EmberRouter from '@ember/routing/router';
import config from 'frontend-vocab-search-admin/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('vocabularies');
  this.route('vocabulary', { path: '/vocabulary/:vocabulary_id' });
  this.route('vocabulary-mapping-wizard', { path: '/vocabulary/:vocabulary_id/wizard' });
  this.route('search');
});
