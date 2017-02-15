import Ember from 'ember';

export default Ember.Component.extend({
	
	INDEX: null,
	showWindow: null,
	store: Ember.inject.service(),
	student: null,
	total: 0,

	actions: {
		deleteStudent: function(student){
			this.get('student').destroyRecord();
			this.set('INDEX', this.get('INDEX')+1);
			this.set('total', this.get('total')-1);
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
