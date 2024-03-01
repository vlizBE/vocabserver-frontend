import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * @argument dataset: uri of the dataset you want to scope the search to
 */
export default class WebcomponentSnippetComponent extends Component {
  @service store;

  @tracked query;
  @tracked searchEndpoint;
  @tracked selectedLanguages;
  @tracked vocabularies;

  languages = [
    { label: 'Dutch', value: 'nl' },
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
  ];

  constructor() {
    super(...arguments);
    this.query = '';
    this.searchEndpoint = this.origin;
    this.selectedLanguages = [];
    this.initData();
  }
  // use the alias of a vocab, or uri if no alias is set
  aliasesOrUris = (vocabs) => vocabs?.map((vocab) => vocab.alias || vocab.uri);

  async initData() {
    this.vocabularies = await this.store.findAll('vocabulary');
  }

  get scriptSrc() {
    return this.baseUrl + '/' + 'main.js';
  }

  get baseUrl() {
    return this.origin + '/webcomponent';
  }

  get origin() {
    return window.location.origin;
  }

  @action
  languageSelectionChanged(value) {
    this.selectedLanguages = value;
  }

  get selectedLanguageString() {
    return this.selectedLanguages.map((x) => x.value).join(',');
  }
}
