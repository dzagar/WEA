import Ember from 'ember';

export default Ember.Component.extend({
	showWindow: null,
	ruleEditing: null,
	logicalExpID: null,

	init (){
		this._super(...arguments);
		var self = this;
        Ember.$('.ui.modal').remove();  //remove any existing modals
        var newLogExp = null;
        if (this.get('ruleEditing')){	//if object passed
        	newLogExp = this.get('ruleEditing').get('logicalExpressions').get('firstObject');
        } else {	//creating new logical expression
        	var ruleID = this.get('ruleEditing').get('id');
        	newLogExp = this.get('store').createRecord('logical-expression', {
	        	booleanExpression: null,
	        	logicalLink: null,
	        	assessmentCode: ruleID,
	        	logicalExpressions: []
        	});
        	newLogExp.save().then(function(){
        		self.set('logicalExpID', newLogExp.get('id'));
        	});
        }

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
