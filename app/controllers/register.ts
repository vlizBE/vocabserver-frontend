import Controller  from '@ember/controller';
import { action } from '@ember/object';

export default class RegisterController extends Controller {
    @action
    onRegisterFailed(error: string) {
        console.log(error);
    }
}