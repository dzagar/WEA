import Ember from 'ember';


export default Ember.Component.extend({
	store: Ember.inject.service(),
	notDONE: null,
	isImporting: null,



	actions: {
		deleteAllData: function(){
			var self = this;

			this.get('store').query('gender', {
				deleteAll: true
			});
			console.log('deleted genders');

			this.get('store').query('residency', {
				deleteAll: true
			});
			console.log('deleted residencies');

			this.get('store').query('student', {
				deleteAll: true
			}).then(function(){
				self.get('store').query('scholarship', {
					deleteAll: true
				}).then(function(response){
					console.log(response);
				});
				console.log('deleted scholarships');

				self.get('store').query('advanced-standing', {
					deleteAll: true
				}).then(function(response){
					console.log(response);
				});
			});
			
			this.get('store').query('term-code', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});
			
			this.get('store').query('course-code', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});

			this.get('store').query('high-school', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});
			this.get('store').query('high-school-subject', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});

			this.get('store').query('high-school-grade', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});

			this.get('store').query('high-school-course', {
				deleteAll: true
			}).then(function(response) {
				console.log(response);
			});
			console.log('deleted students');

			this.set('isImporting', true);
			this.set('notDONE', false);
			Ember.$('.ui.modal').modal('hide');
      		Ember.$('.ui.modal').remove();
		},
		cancel: function(){
			console.log('cancelled');
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
