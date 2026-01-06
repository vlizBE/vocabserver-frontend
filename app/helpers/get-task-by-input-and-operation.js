import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class GetTaskByInputAndOperation extends Helper{
  @service store;

  async compute([input], { operation }) {
    const tasks = await this.store.query('task', {
      'filter[input-containers][content]': input.uri,
      'filter[operation]': operation,
      sort: '-created',
      'page[size]': 1
    });
    return tasks[0];
  }
}
