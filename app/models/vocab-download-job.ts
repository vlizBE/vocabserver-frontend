import Model, { attr } from '@ember-data/model';

export default class VocabDownloadJob extends Model {
  @attr('date')
  declare created?: Date;

  @attr('string')
  declare sources?: string;
}
