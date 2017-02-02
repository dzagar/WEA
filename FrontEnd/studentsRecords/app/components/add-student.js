import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	newStudent: null,
	INDEX: null,
	residencyModel: null,
	number: null,
	firstName: null,
	lastName: null,
	gender: 1,
	DOB: null,
	photo: null,
	resInfo: null,
	notDONE: null,

	init() {
		this._super(...arguments);
		var self = this;
		this.get('store').findAll('residency').then(function (records) {
	      self.set('residencyModel', records);
	      console.log(records.get('firstObject'));
	      self.set('resInfo', records.get('firstObject'));
	    });
	},
	actions: {
		addStudent: function(student){
			if (this.get('number') == null || this.get('firstName') == null || this.get('lastName') == null || this.get('gender') == null || this.get('DOB') == null || this.get('resInfo') == null){
				console.log('u fucked up');
				return;
			}
			if (this.get('gender') == 1){
				this.set('photo', "/assets/studentsPhotos/male.png");
			} else if (this.get('gender') == 2) {
				this.set('photo', "/assets/studentsPhotos/female.png");
			} else {
				this.set('photo', "NOTHING!!!");
			}
			this.set('newStudent', this.get('store').createRecord('student', {
				number: this.get('number'),
				firstName: this.get('firstName'),
				lastName: this.get('lastName'),
				gender: this.get('gender'),
				DOB: new Date(this.get('DOB')),
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
