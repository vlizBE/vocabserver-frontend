import config from 'frontend-vocab-search-admin/config/constants';

export default function aliasString(aliasUri /*, named*/) {
  return aliasUri && aliasUri.startsWith(config.VOCABULARY_ALIAS_BASE)
    ? aliasUri.replace(config.VOCABULARY_ALIAS_BASE, '')
    : aliasUri;
}
