import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-vocab-search-admin/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Helper | get-task-by-input-and-operation',
  function (hooks) {
    setupRenderingTest(hooks);

    // TODO: Replace this with your real tests.
    test('it renders', async function (assert) {
      this.set('inputValue', '1234');

      await render(hbs`{{get-task-by-input-and-operation this.inputValue}}`);

      assert.dom(this.element).hasText('1234');
    });
  }
);
