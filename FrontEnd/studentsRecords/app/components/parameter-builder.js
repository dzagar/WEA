import Ember from 'ember';

export default Ember.Component.extend({
	showWindow: null,

	init (){
		this._super(...arguments);
        Ember.$('.ui.modal').remove();  //remove any existing modals
	},

	didUpdateAttrs(){
		this.rerender();
	},
	actions: {
		cancel: function(){
            Ember.$('.ui.modal').modal('hide');
        },
	},

	didRender() {
	    var self = this;
	    Ember.$('.ui.modal')
	    .modal({
	        closable: false,
	        backdrop: 'static',
	        onHide: function() {
	            self.set('showWindow', false);
	        },
	        observeChanges: true
	    })
	    .modal('show');
    }
});
