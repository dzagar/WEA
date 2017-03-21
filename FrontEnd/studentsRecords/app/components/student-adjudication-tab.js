import Ember from 'ember';

export default Ember.Component.extend({
	currentStudent: null,
	showDeleteConfirmation: false,
	adjudications: null,
	assessmentCodes: null,
	loadingAdjudications: false,
	newDateValue: null,
	newNoteValue: null,
	newTermCodeValue: null,
	newAssessmentCodeValue: null,
	selectedAdjudicationID: null,
	selectedAssessmentCodeID: null,
	store: null,

	
});
