import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InlineEdit extends Component {
  @tracked isEditing = false;

  constructor() {
    super(...arguments);
    this.value = this.args.value;
  }

  @action
  startEdit() {
    this.value = this.args.value;
    this.isEditing = true;
  }

  @action
  async submit() {
    this.isEditing = false;
    this.args.onSubmit(this.value);
  }

  @action
  cancel() {
    this.isEditing = false;
  }

  @action
  focusInputField(element) {
    element.focus();
    element.select();
  }
}
