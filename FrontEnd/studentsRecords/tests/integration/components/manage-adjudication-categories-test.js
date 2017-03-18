import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('manage-adjudication-categories', 'Integration | Component | manage adjudication categories', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{manage-adjudication-categories}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#manage-adjudication-categories}}
      template block text
    {{/manage-adjudication-categories}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
