import Ember from 'ember';

export default Ember.Component.extend({

  	store: Ember.inject.service(),
  	notDONE: null,
  	residency: null,
	actions: {

		search: function () {
    		this.set('notDONE', false);
	    	Ember.$('.ui.modal').modal('hide');
	    	Ember.$('.ui.modal').remove();
		},
    	exit: function () {
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
