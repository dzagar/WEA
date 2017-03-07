import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel() {
        if (this.get('oudaAuth').get('isAuthenticated')=== false) {
            this.transitionTo('login');
        }
    }
});