import Ember from 'ember';

export default Ember.Component.extend({
	currentStudent: null,
	showDeleteConfirmation: false,
	assessmentCodes: null,
	loadingAssessmentCodes: false,
	newDateValue: Ember.computed(function(){
		var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        return today;
	}),
	newNoteValue: null,
	selectedTermCodeID: null,
	selectedAssessmentCodeID: null,
	errorDate: false,
	errorNote: false,
	errorAC: false,
	errorTC: false,
	store: null,
	selectedAdjudication: null,

	init(){
		this._super(...arguments);
		this.send('loadAssessmentCodes');
	},

	actions: {
		clearError(varName)
        {
            this.set(varName, false);
        },

        addAdjudication(){
        	this.set('errorDate', false);
        	this.set('errorNote', false);
        	this.set('errorAC', false);
        	this.set('errorTC', false);

        	var failed = false;

        	if (!(this.get('selectedTermCodeID'))){
        		failed = true;
        		this.set('errorTC', true);
        	}
        	if (!(this.get('selectedAssessmentCodeID'))){
        		failed = true;
        		this.set('errorAC', true);
        	}
        	if (!(this.get('newDateValue'))){
        		failed = true;
        		this.set('errorDate', true);
        	}

        	if (!failed){
        		var self = this;
        		this.get('store').find('term-code', this.get('selectedTermCodeID')).then(termCodeObj => {
        			self.get('store').find('assessment-code', this.get('selectedAssessmentCodeID')).then(assessmentCodeObj => {
        				var newAdjudicationObj = self.get('store').createRecord('adjudication', {
        					date: self.get('newDateValue'),
        					note: self.get('newNoteValue'),
        					student: self.get('currentStudent'),
        					termCode: termCodeObj,
        					assessmentCode: assessmentCodeObj
        				});
                        this.get('currentStudent').reload();
        				newAdjudicationObj.save().then(()=>{
        					self.set('newNoteValue', null);
        					self.set('selectedTermCodeID', null);
        					self.set('selectedAssessmentCodeID', null);
        				});
        			})
        		})
        	}
        },

        deleteAdjudication(adjudicationObj){
        	this.set('selectedAdjudication', adjudicationObj);
        	this.set('showDeleteConfirmation', true);
        },

        loadAssessmentCodes(){
        	if (!this.get('assessmentCodes')) {
                this.set('loadingAssessmentCodes', true);
                var self = this;
                this.get('store').findAll('assessment-code').then(function(records) {
                    self.set('assessmentCodes', records);
                    self.set('loadingAssessmentCodes', false);
                });
            }
        },
		selectTermToView(termCodeID){
			this.set('selectedTermCode', termCodeID);
			Ember.$('.ui.menu').find('.item').tab('change tab', 'program')
		}
	}
});
