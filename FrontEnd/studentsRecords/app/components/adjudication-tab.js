import Ember from 'ember';

export default Ember.Component.extend({

	didRender() {
      Ember.$('.menu .item').tab();
      Ember.$('.ui.menu').find('.item').tab('change tab', 'second');
    }
});
