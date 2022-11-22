import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * @argument dataset
 * @argument nodeShape: optional
 * @argument onSubmit
 */
export default class MappingShapeCreatorComponent extends Component {
  @tracked nodeShape;
  @tracked labelPropertyShape;

  @service store;

  constructor() {
    super(...arguments);
    this.initializeData();
  }

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
  }

  // TODO: getters are merely to comply with how bootstrap form "model" seems to work
  // there might be a better way
  get type() {
    return this.store
      .peekAll('dataset')
      .filterBy('class', this.nodeShape.targetClass).firstObject;
  }
  set type(val) {
    this.nodeShape.targetClass = val.class;
  }

  get labelPath() {
    return this.labelPropertyShape.path;
  }
  set labelPath(val) {
    this.labelPropertyShape.path = val;
  }

  @action
  async submit(params) {
    this.nodeShape.targetClass = params.type.class;
    this.labelPropertyShape.path = params.labelPath;
    this.args.onSubmit(this.nodeShape);
  }
}
