import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	student: null,
	INDEX: null,
	showWindow: null,

	actions: {
		addStudent: function(student){
			
			Ember.$('.ui.modal').modal('hide');
      		Ember.$('.ui.modal').remove();

		},
		cancel: function(){
			this.set('showWindow', false);
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
