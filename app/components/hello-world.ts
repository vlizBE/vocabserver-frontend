import Component from '@glimmer/component';
import { service } from '@ember/service';
import Router from '@ember/routing/router';

interface HelloWorldArgs {
  foo: null;
}

export default class HelloWorld extends Component<HelloWorldArgs> {
  @service declare router: Router;

  constructor(owner: unknown, args: HelloWorldArgs) {
    super(owner, args);
  }
}
