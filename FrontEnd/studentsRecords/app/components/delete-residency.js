import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
	residency: null,
	showWindow: null,

	actions: {
		deleteResidency: function(){
			this.get('residency').destroyRecord();
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