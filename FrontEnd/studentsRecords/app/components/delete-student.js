import Ember from 'ember';

export default Ember.Component.extend({
	
	INDEX: null,
	showWindow: null,
	store: Ember.inject.service(),
	student: null,
	total: 0,

	actions: {
		deleteStudent: function(student){
			let self = this;
			this.get('student').destroyRecord().then(function() {
					self.set('INDEX', self.get('INDEX')+1);
					self.set('total', self.get('total')-1);
					self.set('showWindow', false);
					Ember.$('.ui.modal').modal('hide');
					Ember.$('.ui.modal').remove();
			});
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
