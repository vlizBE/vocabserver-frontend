import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';

const LABEL_PREDICATE = 'http://www.w3.org/2004/02/skos/core#prefLabel';
const KEYWORD_PREDICATE = 'http://www.w3.org/2004/02/skos/core#member';

function splitPropertyPathStr(propertyPathStr) {
  let properties = [];
  let currentProperty = null;
  for (const c of propertyPathStr) {
    if (c === '>') {
      properties.push(currentProperty);
      currentProperty = null;
      continue;
    } else if (c === '<') {
      currentProperty = '';
    } else if (currentProperty !== null) {
      currentProperty += c;
    }
  }

  return properties;
}

function createPropertyPathStr(properties) {
  return properties.map((x) => `<${x}>`).join('/');
}

class FormModel {
  constructor(pivotTypeOptions, labelPathOptions, initValues) {
    this.pivotTypeOptions = pivotTypeOptions;
    this.labelPathOptions = labelPathOptions;

    this.labelPath = initValues.labelPath ?? null;
    this.pivotType = initValues.pivotType ?? null;

    this.newKeywordPath = null;

    this._nextKeywordIndex = 0;
    this.keywordFilter = tracked({});
    for (const keywordPath of initValues.keywordFilter) {
      this.insertKeywordPath(keywordPath);
    }
  }

  insertKeywordPath(keywordPath) {
    this.keywordFilter[this._nextKeywordIndex++] = keywordPath;
  }
}

/**
 * @argument dataset
 * @argument nodeShape: optional
 * @argument onSubmit
 */
export default class MappingShapeCreatorComponent extends Component {
  @tracked nodeShape;
  @tracked labelPropertyShape;
  @tracked formModel;

  @service store;

  @action
  async initializeData() {
    let propertyShapes;
    if (this.args.nodeShape) {
      this.nodeShape = this.args.nodeShape;
      propertyShapes = await this.nodeShape.propertyShapes;
      this.labelPropertyShape = propertyShapes.filter((x) => {
        return x.description === LABEL_PREDICATE;
      })[0];
    } else {
      this.nodeShape = this.store.createRecord('shacl-node-shape', {});
      propertyShapes = [];
      // TODO: handling all potential property shapes like this isn't great
      this.labelPropertyShape = this.store.createRecord(
        'shacl-property-shape',
        {
          description: LABEL_PREDICATE,
          nodeShape: this.nodeShape,
        }
      );
    }
    const pivotTypeOptions = await this.args.dataset.classes.map(
      (x) => x.class
    );
    const labelPathOptions = await this.args.dataset.properties.map(
      (x) => x.property
    );
    this.formModel = new FormModel(pivotTypeOptions, labelPathOptions, {
      pivotType: this.nodeShape.targetClass,
      labelPath: this.labelPropertyShape.path
        ? splitPropertyPathStr(this.labelPropertyShape.path)
        : null,
      keywordFilter: propertyShapes
        .filter((x) => x.description === KEYWORD_PREDICATE)
        .map((x) => x.path)
        .map((x) => splitPropertyPathStr(x)),
    });
  }

  @action
  async submit(params) {
    this.nodeShape.targetClass = params.pivotType;
    this.labelPropertyShape.path = createPropertyPathStr(params.labelPath);
    // Remove all keyword properties before inserting the new ones
    this.nodeShape.propertyShapes
      .filter((x) => x.description === KEYWORD_PREDICATE)
      .forEach((x) => {
        x.destroyRecord();
      });
    for (const path of Object.values(params.keywordFilter)) {
      this.store.createRecord('shacl-property-shape', {
        description: KEYWORD_PREDICATE,
        path: createPropertyPathStr(path),
        nodeShape: this.nodeShape,
      });
    }
    this.args.onSubmit(this.nodeShape);
  }

  @action
  keywordFilterChanged(keywordPathKey, keywordPath) {
    this.formModel.keywordFilter[keywordPathKey] = keywordPath;
    for (const [key, val] of Object.entries(this.formModel.keywordFilter)) {
      if (val.length === 0) {
        delete this.formModel.keywordFilter[key];
      }
    }
  }

  @action
  keywordFilterAdded(keywordPath) {
    this.formModel.insertKeywordPath(keywordPath);
  }

  @action
  removeKeywordFilter(key) {
    delete this.formModel.keywordFilter[key];
  }
}
