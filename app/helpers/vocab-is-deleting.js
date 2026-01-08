import VocabGetDeletingTask from "./vocab-get-deleting-task"

export default class VocabIsDeleting extends VocabGetDeletingTask {

  async compute([vocab]) {
    const task = await super.compute([vocab])
    return task && !task.isSuccessful
  }
}
