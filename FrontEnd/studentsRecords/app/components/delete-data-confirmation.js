import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	notDONE: null,

	actions: {
		deleteAllData: function(){
			console.log('deleted EVERYTHING!!');
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
