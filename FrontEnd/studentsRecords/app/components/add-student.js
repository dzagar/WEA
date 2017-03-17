import Ember from 'ember';

export default Ember.Component.extend({
	DOB: null,
	firstName: null,
	gender: null,
	genderModel: null,
	INDEX: null,
	lastName: null,
	newStudent: null,
	notDONE: null,
	number: null,
	photo: null,
	residencyModel: null,
	resInfo: null,
	store: Ember.inject.service(),
	total: 0,
	basisOfAdmission: null,
	admissionAverage: null,
	admissionComments: null,
	registrationComments: null,
	invalidStudentNumber: false,
	invalidName: false,
	invalidDOB: false,
	invalidGender: false,
	invalidResidency: false,

	init() {
		this._super(...arguments);
		Ember.$('.ui.modal').remove();
		var self = this;
		this.get('store').findAll('residency').then(function (records) {
	      self.set('residencyModel', records);
	    });
		this.get('store').findAll('gender').then(function (records) {
	      self.set('genderModel', records);
	    });
	},
	actions: {
		addStudent: function(student){
			this.set('invalidStudentNumber', false);
			this.set('invalidName', false);
			this.set('invalidDOB', false);
			this.set('invalidGender', false);
			this.set('invalidResidency', false);

			if (this.get('number') == null || isNaN(this.get('number'))) {
				this.set('invalidStudentNumber', true);
			}
			if (this.get('firstName') == null || this.get('lastName') == null) {
				this.set('invalidName', true);
			}
			if (this.get('DOB') == null || isNaN(Date.parse(this.get('DOB')))) {
				this.set('invalidDOB', true);
			}
			if (this.get('gender') == null) {
				this.set('invalidGender', true);
			}
			if (this.get('resInfo') == null) {
				this.set('invalidResidency', true);
			}

			if (!(this.get('invalidStudentNumber') || this.get('invalidName') || this.get('invalidDOB') || this.get('invalidGender') || this.get('invalidResidency'))) {
				this.set('photo', "/assets/studentsPhotos/nonBinary.png");
				var strDate = this.get('DOB').substring(0,10);
				console.log(strDate);
				this.set('newStudent', this.get('store').createRecord('student', {
					number: this.get('number'),
					firstName: this.get('firstName'),
					lastName: this.get('lastName'),
					gender: this.get('store').peekRecord('gender', this.get('gender')),
					DOB: new Date(Date.parse(this.get('DOB'))),
					photo: this.get('photo'),
					resInfo: this.get('store').peekRecord('residency', this.get('resInfo')),
					basisOfAdmission: this.get('basisOfAdmission'),
					admissionAverage: this.get('admissionAverage'),
					admissionComments: this.get('admissionComments'),
					registrationComments: this.get('registrationComments')
				}));
				this.get('newStudent').save();
				this.set('total',this.get('total')+1);
				this.set('notDONE', false);
				//somehow jump to this student afterwards
				Ember.$('.ui.modal').modal('hide');
				//Ember.$('.ui.modal').remove();
			}

		},
		selectGender: function(gender){
			this.set('gender', gender);
		},
		selectResidency: function(res){
			this.set('resInfo', res);
		},
		selectDate: function(date){
			this.set('DOB', date);
		},
		cancel: function(){
			this.set('notDONE', false);
			Ember.$('.ui.modal').modal('hide');
      		//Ember.$('.ui.modal').remove();
		}
	},

	didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
		autofocus: false
      })
      .modal('show');
  }
});
