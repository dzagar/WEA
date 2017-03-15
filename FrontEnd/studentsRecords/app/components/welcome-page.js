import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	currentName: "",

	init() {
		this._super(...arguments);
		var authentication = this.get('oudaAuth');
		this.set('currentName', authentication.getName);
	},

	actions: {
		startStudentAdjudication: function(){
			this.get('studentDataEntry')();
		}
	}
});
