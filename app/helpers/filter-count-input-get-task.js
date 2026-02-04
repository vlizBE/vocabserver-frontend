import GetTaskByInputAndOperation from "./get-task-by-input-and-operation";

export default class FilterCountInputGetTask extends GetTaskByInputAndOperation {
  compute([filterCountInput]) {
    return super.compute([filterCountInput], {
      operation: 'http://mu.semte.ch/vocabularies/ext/FilterCountJob',
    });
  }
}

