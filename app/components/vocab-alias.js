import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'frontend-vocab-search-admin/config/constants';
import aliasString from '../helpers/alias-string';
export default class VocabAliasComponent extends Component {
  @service store;

  @tracked editableVocab = null;
  @tracked newAlias = null;
  @tracked error = null;

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  aliasUri = (aliasString) =>
    aliasString === '' ? '' : `${config.VOCABULARY_ALIAS_BASE}${aliasString}`;

  @action
  setVocabEdit(vocab) {
    this.editableVocab = vocab;
    this.newAlias = aliasString(vocab.alias);
  }

  @action
  stopEditingVocab() {
    this.editableVocab = null;
    this.newAlias = null;
    this.error = null;
  }

  isValidAlias(alias) {
    return !alias.includes(' ') && !alias.includes(',');
  }

  @action
  async saveVocabAlias() {
    this.newAlias = this.newAlias.trim();
    if (!this.isValidAlias(this.newAlias)) {
      this.error = `This alias is not a valid alias to use.`;
      return;
    }
    const newAliasUri = this.aliasUri(this.newAlias);

    if (this.newAlias) {
      // check if the URI does not already exist
      // this makes the assumption only vocab aliases might have this URI base
      const vocabWithSimilarUri = await this.store.query('vocabulary', {
        'filter[:exact:alias]': newAliasUri,
      });
      if (vocabWithSimilarUri.length !== 0) {
        const vocab = vocabWithSimilarUri[0];
        this.error = `This alias is already used by the vocab '${vocab.name}'.`;
        return;
      }
    }

    // if empty, just remove the alias
    this.editableVocab.alias = newAliasUri === '' ? null : newAliasUri;
    await this.editableVocab.save();
    this.stopEditingVocab();
  }

  @action
  setNewAlias(newVal) {
    this.newAlias = newVal;
    this.error = null;
  }
}
