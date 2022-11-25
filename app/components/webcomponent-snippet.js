import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * @argument dataset: uri of the dataset you want to scope the search to
 */
export default class WebcomponentSnippetComponent extends Component {
  get scriptSrc() {
    return this.baseUrl + '/' + 'main.js';
  }

  get baseUrl() {
    return window.location.origin + '/widget';
  }
}
