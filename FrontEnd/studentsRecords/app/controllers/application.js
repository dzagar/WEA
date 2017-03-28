import Ember from 'ember';

export default Ember.Controller.extend({

    routing: Ember.inject.service('-routing'),

    ADM01IsPermitted: function(){
    	var authentication = this.get('oudaAuth');
	    if (authentication.getName === "Root") {
	      return true;
	    } else {
	      return (authentication.get('userCList').indexOf("ADM01") >= 0);
	    }
    }.property('login').volatile(),

    actions: {
        logout() {
            this.get('oudaAuth').close();
            this.get('routing').transitionTo('login');
        }
    }
});
