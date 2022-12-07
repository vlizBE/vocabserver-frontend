import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
    if (this.args.nodeShape) {
      this.nodeShape = this.args.nodeShape;
      this.labelPropertyShape = this.nodeShape
        .hasMany('propertyShapes')
        .value().firstObject;
    } else {
      this.nodeShape = this.store.createRecord('shacl-node-shape', {});
      // TODO: handling all potential property shapes like this isn't great
      this.labelPropertyShape = this.store.createRecord(
        'shacl-property-shape',
        {
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
    });
  }

  @action
  async submit(params) {
    this.nodeShape.targetClass = params.pivotType;
    this.labelPropertyShape.path = createPropertyPathStr(params.labelPath);
    this.args.onSubmit(this.nodeShape);
  }
}
