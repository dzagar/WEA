import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	student: null,
	INDEX: null,
	showWindow: null,

	actions: {
		deleteStudent: function(student){
			this.get('student').destroyRecord();
			this.set('INDEX', this.get('INDEX')+1);
			this.set('showWindow', false);
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
