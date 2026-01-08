import VocabGetDeleteWaitingTask from "./vocab-get-delete-waiting-task"

export default class VocabIsDeleteWaiting extends VocabGetDeleteWaitingTask {

  async compute([vocab]) {
    const task = await super.compute([vocab])
    return task && !task.isSuccessful
  }
}
