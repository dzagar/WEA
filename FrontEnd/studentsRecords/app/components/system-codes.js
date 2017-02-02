import Ember from 'ember';

export default Ember.Component.extend({

    didRender() {
    Ember.$('.menu .item').tab();
    }
});
