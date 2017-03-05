import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		startStudentAdjudication: function(){
			this.get('studentDataEntry')();
		}
	}
});
