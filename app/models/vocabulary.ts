import Model, { attr } from '@ember-data/model';

export default class VocabularyModel extends Model {
  @attr('string')
  declare name: string;

  @attr('string')
  declare url: string;

  @attr('string')
  declare uri: string;
}