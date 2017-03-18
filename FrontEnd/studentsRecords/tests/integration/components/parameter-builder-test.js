import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('parameter-builder', 'Integration | Component | parameter builder', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{parameter-builder}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#parameter-builder}}
      template block text
    {{/parameter-builder}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
