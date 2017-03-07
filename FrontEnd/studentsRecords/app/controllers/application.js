import Ember from 'ember';

export default Ember.Controller.extend({

    routing: Ember.inject.service('-routing'),
    actions: {
        logout() {
            this.get('oudaAuth').close();
            this.get('routing').transitionTo('login');
        }
    }
});
