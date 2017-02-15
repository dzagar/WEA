import Ember from 'ember';


export default Ember.Component.extend({
	store: Ember.inject.service(),
	notDONE: null,
	isImporting: null,



	actions: {
		deleteAllData: function(){
			var self = this;

			// this.get('store').findAll('gender').then(function(records){
			// 	records.content.forEach(function(rec) {
			//         Ember.run.once(self, function() {
			//            rec.deleteRecord();
			//            rec.save();
			//         });
			//      }, self);
			// });
			// console.log('deleted genders');

			// this.get('store').findAll('residency').then(function(records){
			// 	records.content.forEach(function(rec) {
			//         Ember.run.once(self, function() {
			//            rec.deleteRecord();
			//            rec.save();
			//         });
			//      }, self);
			// });
			// console.log('deleted residency');

			// this.get('store').findAll('scholarship').then(function(records){
			// 	records.content.forEach(function(rec) {
			//         Ember.run.once(self, function() {
			//            rec.deleteRecord();
			//            rec.save();
			//         });
			//      }, self);
			// });
			// console.log('deleted scholarship -- doesnt actually work in backend yet');

			// this.get('store').findAll('advanced-standing').then(function(records){
			// 	records.content.forEach(function(rec) {
			//         Ember.run.once(self, function() {
			//            rec.deleteRecord();
			//            rec.save();
			//         });
			//      }, self);
			// });
			// console.log('deleted advanced standings -- doesnt actually work in backend yet');

			// this.get('store').findAll('student').then(function(records){
			// 	records.content.forEach(function(rec) {
			//         Ember.run.once(self, function() {
			//            rec.deleteRecord();
			//            rec.save();
			//         });
			//      }, self);
			// });
			// console.log('deleted students -- doesnt actually work in backend yet');



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
