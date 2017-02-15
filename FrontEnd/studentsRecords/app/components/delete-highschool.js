import Ember from 'ember';

export default Ember.Component.extend({
    highschool: null,
	showWindow: null,
	store: Ember.inject.service(),

	actions: {
		deleteHighSchool: function(){
			this.get('highschool').destroyRecord();
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

});
