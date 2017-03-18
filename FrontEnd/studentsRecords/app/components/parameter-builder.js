import Ember from 'ember';

export default Ember.Component.extend({
	showWindow: null,
	ruleEditing: null,
	logicalExpID: null,
	addingNew: true,
	store: Ember.inject.service(),

	init (){
		this._super(...arguments);
		var self = this;
        Ember.$('.ui.modal').remove();  //remove any existing modals
        var newLogExp = null;
        if (this.get('ruleEditing').get('logicalExpressions').get('firstObject') != null){	//if object passed
        	this.set('addingNew', false);	//you are just modifying not adding
        	newLogExp = this.get('ruleEditing').get('logicalExpressions').get('firstObject');
        	this.set('logicalExpID', newLogExp.get('id'));
        	console.log('set parent logexp to id ' +  newLogExp.get('id') + 'for existing rule with id ' + ruleEditing.get('id'));
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
        		console.log('created parent logexp with id ' + newLogExp.get('id'));
        	});
        }

	},

	didUpdateAttrs(){
		this.rerender();
	},
	actions: {
		cancel: function(){
			var self = this;
			if (this.get('addingNew')){	//need to delete parent log exp
				var destroyParent = self.get('store').get('logical-expression', self.get('logicalExpID'));
				if (destroyParent){
					destroyParent.destroyRecord().then(function(){
						self.set('logicalExpID', null);
						Ember.$('.ui.modal').modal('hide');
					});
				} else {
					self.get('store').findRecord('logical-expression', self.get('logicalExpID'), {reload: true})
					.then(obj => obj.destroyRecord())
					.then(() => {Ember.$('.ui.modal').modal('hide'); self.set('logicalExpID', null)});
				}
            } else {
            	Ember.$('.ui.modal').modal('hide');
            }
           
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
