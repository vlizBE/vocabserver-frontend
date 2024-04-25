import EmberRouter from '@ember/routing/router';
import config from 'frontend-vocab-search-admin/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('vocabularies', function () {
    this.route('new');
  });
  this.route('vocabulary', { path: '/vocabularies/show/:id' }, function () {
    this.route('mapping');
    this.route('unification');
  });
  this.route('migration');
  this.route('search');
  this.route('webcomponent-config');
  this.route('404', { path: '/*path' });
});
