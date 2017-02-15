import Ember from 'ember';

export default Ember.Component.extend({

	store: Ember.inject.service(),
	notDONE: null,
	showDeleteConfirmation: false,
	importData: false,

	actions: {
		showEraseDataModal: function(){
			this.set('showDeleteConfirmation', true);
		}
		
	}



});
