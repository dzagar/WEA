import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-new-course-grouping', 'Integration | Component | add new course grouping', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{add-new-course-grouping}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#add-new-course-grouping}}
      template block text
    {{/add-new-course-grouping}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
