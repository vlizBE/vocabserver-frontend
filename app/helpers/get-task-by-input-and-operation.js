import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class GetTaskByInputAndOperation extends Helper {
  @service store;

  async compute([input], { operation }) {
    return getTaskByInputAndOperation(this.store, input, operation);
  }

}

export async function getTaskByInputAndOperation(store, input, operation) {
    const tasks = await store.query('task', {
      'filter[input-containers][content]': input.uri,
      'filter[operation]': operation,
      sort: '-created',
      'page[size]': 1
    });
    return tasks[0];
  }
