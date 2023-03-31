import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import VocabularyMappingWizardController from "../vocabulary-mapping-wizard";

export default class VocabularyUnificationController extends VocabularyMappingWizardController {
}
