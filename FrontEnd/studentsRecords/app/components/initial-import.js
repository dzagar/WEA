import Ember from 'ember';

export default Ember.Component.extend({

	store: Ember.inject.service(),
	notDONE: null,
	showDeleteConfirmation: false,
	showInitialDataImportBtn: true,
	importData: false,

	actions: {
		showEraseDataModal: function(){
			this.set('showDeleteConfirmation', true);
			this.set('showInitialDataImportBtn', false);
		}
		
	}



});
