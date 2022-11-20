import Model, { attr } from '@ember-data/model';

export default class VocabularyModel extends Model {
  @attr('string') name;

  @attr('string') url;

  @attr('string') uri;
}
