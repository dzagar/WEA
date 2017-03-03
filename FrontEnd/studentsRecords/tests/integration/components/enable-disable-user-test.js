import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('enable-disable-user', 'Integration | Component | enable disable user', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{enable-disable-user}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#enable-disable-user}}
      template block text
    {{/enable-disable-user}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
