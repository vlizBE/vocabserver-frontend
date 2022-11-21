import Model, { attr } from '@ember-data/model';

export default class FileModel extends Model {
  @attr filename;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }

  get namedDownloadLink() {
    // TODO: sanitize filename if you have use-cases where it could contain file-system unsafe chars
    return `${this.downloadLink}?name=${encodeURIComponent(this.filename)}`;
  }
}
