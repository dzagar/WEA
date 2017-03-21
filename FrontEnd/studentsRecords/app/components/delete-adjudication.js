import Ember from 'ember';

export default Ember.Component.extend({
	adjudication: null,
	showWindow: null,
	student: null,
	store: Ember.inject.service(),

	actions: {
		deleteAdjudication: function(){
			var self = this;
			this.get('adjudication').destroyRecord().then(()=>{
				self.get('store').find('student', self.get('student').get('id')).then(updatedStu=>{
					self.set('student', updatedStu);
					this.set('showWindow', false);
					Ember.$('.ui.modal').modal('hide');
		      		Ember.$('.ui.modal').remove();
				});
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
