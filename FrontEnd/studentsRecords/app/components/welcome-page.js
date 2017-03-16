import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	currentName: "",
	authentication: Ember.inject.service('oudaAuth'),

	actions: {
		startStudentAdjudication: function(){
			this.get('studentDataEntry')();
		}
	}
});
