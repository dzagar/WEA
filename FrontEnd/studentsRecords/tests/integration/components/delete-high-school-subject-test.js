import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('delete-high-school-subject', 'Integration | Component | delete high school subject', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{delete-high-school-subject}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#delete-high-school-subject}}
      template block text
    {{/delete-high-school-subject}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
