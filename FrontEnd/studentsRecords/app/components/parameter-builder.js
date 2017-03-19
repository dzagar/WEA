import Ember from 'ember';

export default Ember.Component.extend({
	showWindow: null,
	ruleEditing: null,
	logicalExpID: null,
	addingNew: true,
	newLogExp: null,
	oldLogExp: null,
	store: Ember.inject.service(),
	loadLogExp: false,
	init (){
		this._super(...arguments);
		var self = this;
        Ember.$('.ui.modal').remove();  //remove any existing modals
        if (this.get('ruleEditing').get('logicalExpressions').get('firstObject') != null){	//if object passed
        	this.set('addingNew', false);	//you are just modifying not adding
        	this.set('newLogExp', this.get('ruleEditing').get('logicalExpressions').get('firstObject'));
        	this.set('oldLogExp', 'newLogExp');
        	this.set('logicalExpID', this.get('newLogExp').get('id'));
        	this.set('loadLogExp', true);
        	console.log('set parent logexp to id ' +  this.get('newLogExp').get('id') + 'for existing rule with id ' + ruleEditing.get('id'));
        } else {	//creating new logical expression
        	var ruleID = this.get('ruleEditing').get('id');
        	var logExp = this.get('store').createRecord('logical-expression', {
	        	booleanExpression: null,
	        	logicalLink: null,
	        	assessmentCode: ruleID,
	        	logicalExpressions: [],
	        	ownerExpression: null
        	});

        	logExp.save().then(function(){
        		self.set('newLogExp', logExp);
        		self.set('logicalExpID', self.get('newLogExp').get('id'));
        		self.set('loadLogExp', true);
        		console.log('created parent logexp with id ' + self.get('newLogExp').get('id'));
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
					self.get('store').findRecord('logical-expression', self.get('logicalExpID'), {reload: true}).then(function(obj){
						obj.destroyRecord().then(function(){
							self.set('logicalExpID', null);
							Ember.$('.ui.modal').modal('hide');
						});
					});
				}
            } else {
        		self.get('store').findRecord('logical-expression', self.get('logicalExpID'), {reload: true}).then(function(obj){
					obj.booleanExpression = self.get('oldLogExp').booleanExpression;
					obj.logicalLink = self.get('oldLogExp').logicalLink;
					obj.logicalExpressions = self.get('oldLogExp').logicalExpressions;
					obj.save().then(function(){
						Ember.$('.ui.modal').modal('hide'); 
						self.set('logicalExpID', null);
					});
				});
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
