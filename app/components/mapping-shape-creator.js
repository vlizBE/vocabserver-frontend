import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { restartableTask } from 'ember-concurrency';

const LABEL_PREDICATE = 'http://www.w3.org/2004/02/skos/core#prefLabel';
const TAG_PREDICATE = 'http://vocab-server.com/tagLabel';

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
    this.filter = initValues.filter ?? '';

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

  async testFilter(dataset) {
    let params = new FormData();
    params.append("dataset_uri", dataset.uri);
    params.append("class", this.pivotType);
    params.append("source_path_string", createPropertyPathStr(this.labelPath));
    params.append("filter", this.filter);

    const res = await fetch('/filter-count/', {
      method: 'POST',
      body: params,
      headers: {
        "Accept": "application/json"
      }
    });

    return res
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

  @tracked filterCount = null;
  @tracked filterValid = true;
  @tracked filterErrorMessage = '';
  @tracked filterErroredQuery = '';
  @tracked filterWarningMessage = '';

  @service store;

  get dataset() { return this.args.dataset; }

  get filterCountInputs() {
    return this.dataset.filterCountInputs.sortBy('created').reverse();
  }
  get filterCountOutputs() {
    return this.dataset.filterCountOutputs.sortBy('created').reverse();
  }

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
      filter: this.nodeShape.filter,
      labelPath: this.labelPropertyShape.path
        ? splitPropertyPathStr(this.labelPropertyShape.path)
        : null,
      keywordFilter: propertyShapes
        .filter((x) => x.description === TAG_PREDICATE)
        .map((x) => x.path)
        .map((x) => splitPropertyPathStr(x)),
    });
  }

  @action
  async testFilter() {
    const res = await this.formModel.testFilter(this.args.dataset);

    if (!res.ok) {
      console.error("Could not test filter query, check the server! Response:\n", await res.text());
      return;
    }

    this.args.dataset.filterCountInputs.reload()
  }

  @restartableTask
  *submit(params) {
    this.nodeShape.targetClass = params.pivotType;
    this.nodeShape.filter = params.filter;
    this.labelPropertyShape.path = createPropertyPathStr(params.labelPath);
    // Remove all keyword properties before inserting the new ones
    this.nodeShape.propertyShapes
      .filter((x) => x.description === TAG_PREDICATE)
      .forEach((x) => {
        x.destroyRecord();
      });
    for (const path of Object.values(params.keywordFilter)) {
      this.store.createRecord('shacl-property-shape', {
        description: TAG_PREDICATE,
        path: createPropertyPathStr(path),
        nodeShape: this.nodeShape,
      });
    }
    yield this.args.onSubmit(this.nodeShape);
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

  @action
  deleteModel(model) {
    model.destroyRecord();
    // Return false to keep the alert open until the model is actually removed.
    return false;
  }

  @action
  reloadFilterIO() {
    return Promise.all([
      this.args.dataset.filterCountInputs.reload(),
      this.args.dataset.filterCountOutputs.reload()
    ])
  }
}
