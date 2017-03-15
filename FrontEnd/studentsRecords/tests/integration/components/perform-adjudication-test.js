import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('perform-adjudication', 'Integration | Component | perform adjudication', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{perform-adjudication}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#perform-adjudication}}
      template block text
    {{/perform-adjudication}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
