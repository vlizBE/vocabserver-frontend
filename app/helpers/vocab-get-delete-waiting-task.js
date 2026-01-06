import GetTaskByInputAndOperation from "./get-task-by-input-and-operation";

export default class VocabGetDeleteWaitingTask extends GetTaskByInputAndOperation {

  compute([vocab]) {
    return super.compute([vocab], {
      operation: 'http://mu.semte.ch/vocabularies/ext/VocabDeleteWaitJob'
    })
  }
}
