import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('boolean-expression', 'Integration | Component | boolean expression', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{boolean-expression}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#boolean-expression}}
      template block text
    {{/boolean-expression}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
