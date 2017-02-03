import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	newStudent: null,
	INDEX: null,
	residencyModel: null,
	genderModel: null,
	number: null,
	firstName: null,
	lastName: null,
	gender: null,
	DOB: null,
	photo: null,
	resInfo: null,
	notDONE: null,

	init() {
		this._super(...arguments);
		var self = this;
		this.get('store').findAll('residency').then(function (records) {
	      self.set('residencyModel', records);
	      self.set('resInfo', records.get('firstObject').get('id'));
	    });
		this.get('store').findAll('gender').then(function (records) {
	      self.set('genderModel', records);
	      self.set('gender', records.get('firstObject').get('id'));
	    });
	},
	actions: {
		addStudent: function(student){
			console.log(this.get('DOB'));
			if (this.get('number') == null || this.get('firstName') == null || this.get('lastName') == null || this.get('gender') == null || this.get('DOB') == null || this.get('resInfo') == null){
				console.log('u fucked up');
				return;
			}
			if (this.get('gender') == 1){
				this.set('photo', "/assets/studentsPhotos/male.png");
			} else if (this.get('gender') == 2) {
				this.set('photo', "/assets/studentsPhotos/female.png");
			} else {
				this.set('photo', "/assets/studentsPhotos/nonBinary.png");
			}
			var date = this.get('DOB');
			var strDate = date.substring(0,10);
			console.log(strDate);
			this.set('newStudent', this.get('store').createRecord('student', {
				number: this.get('number'),
				firstName: this.get('firstName'),
				lastName: this.get('lastName'),
				gender: this.get('store').peekRecord('gender', this.get('gender')),
				DOB: date,
				photo: this.get('photo'),
				resInfo: this.get('store').peekRecord('residency', this.get('resInfo'))
			}));
			this.get('newStudent').save();
			this.set('notDONE', false);
			//somehow jump to this student afterwards
			Ember.$('.ui.modal').modal('hide');
      		Ember.$('.ui.modal').remove();

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
      		Ember.$('.ui.modal').remove();
		}
	},

	didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
