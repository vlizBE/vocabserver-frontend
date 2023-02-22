import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ConfirmationButton extends Component {
  @tracked showModal = false;
}
