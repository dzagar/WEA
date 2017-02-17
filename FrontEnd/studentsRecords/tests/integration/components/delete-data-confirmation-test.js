import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('delete-data-confirmation', 'Integration | Component | delete data confirmation', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{delete-data-confirmation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#delete-data-confirmation}}
      template block text
    {{/delete-data-confirmation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
