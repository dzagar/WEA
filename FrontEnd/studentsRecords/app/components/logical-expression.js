import Ember from 'ember';

export default Ember.Component.extend({

    applyEmphasis: Ember.computed('level', function() {
        return (this.get('level') % 2) === 1;
    }),
    logLinks: null,  //logical link (any or all)
    level: 0,
    booleanExps: [],
    logicalExpressionsArr: [],
    extraBoolExp: [],   //only one expression should ever be in here
    store: Ember.inject.service(),
    creatingNewLogExp: false,
    rule: null, //sent in from parameter builder
    objectID: null,     //THIS logical expression ID!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    currentChildID: null,   //children's logical expression ID
    logLink: null,

    logLinkObserve: Ember.observer('logLink', function(){
        var parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
        if (parent){
            parent.set('logicalLink', this.get('logLink'));
            parent.save();
        } else {
            this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
            .then(obj => {
                obj.set('logicalLink', self.get('logLink'));
                obj.save();
            });
        }
    }),

    init() {
        this._super(...arguments);
        var self = this;
        var logLinks = [
            {
                "id": "0",
                "text": "all"
            },
            {
                "id": "1",
                "text": "any"
            },
        ];
        var extra = [{
            "field": null,
            "opr": null,
            "val": null
        }];

        this.set('logLinks', logLinks);
        this.set('extraBoolExp', extra);

        var rec = this.get('store').find('logical-expression', this.get('objectID'));
        if (rec){
            rec.then(obj => {
                self.set('logicalExpressionsArr', obj.get('logicalExpressions'));
                if (obj.get('booleanExpression') != ""){
                    self.set('booleanExps', JSON.parse(obj.get('booleanExpression')));
                } else {
                    self.set('booleanExps', []);
                }
                self.set('logLink', obj.get('logicalLink'));
            });
        }
        
    },

    willDestroy() { //reset component window
        this.set('logLink', null);
        this.set('booleanExps', null);
        this.set('logicalExpressionsArr', []);
        this.set('objectID', null);
        this.set('currentChildID', null);
        this.set('rule', null);
    },

    actions: {
        destroyBoolExp: function(item){
            this.get('booleanExps').removeObject(item);
            var parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
            if (parent){
                parent.set('booleanExpression', JSON.stringify(this.get('booleanExps')));
                parent.save();
            } else {
                this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.set('booleanExpression', JSON.stringify(self.get('booleanExps')));
                    obj.save();
                });
            }
        },

        addBoolExp: function(boolExp){
            var self = this;
            this.set('booleanExps', this.get('booleanExps') || []);
            this.get('booleanExps').pushObject({
                "field": Number(boolExp.field),
                "opr": boolExp.opr,
                "val": boolExp.val
            });
            var parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
            if (parent){
                parent.set('booleanExpression', JSON.stringify(this.get('booleanExps')));
                parent.save();
            } else {
                this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.set('booleanExpression', JSON.stringify(self.get('booleanExps')));
                    obj.save();
                });
            }
            var extra = [{
                "field": null,
                "opr": null,
                "val": null
            }];
            this.set('extraBoolExp', extra);
        },
        createLogExp: function(){
            this.set('logicalExpressionsArr', this.get('logicalExpressionsArr') || []);
            var self = this;
            let child = this.get('store').peekRecord('logical-expression', this.get('currentChildID'));
            if (child){
                this.get('logicalExpressionsArr').pushObject(child);
                this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.save().then(()=>{
                        self.set('currentChildID', null);
                        self.set('creatingNewLogExp', false);
                    });
                });
            }
            
        },
        destroyLogExp: function(logExpObj){
            this.get('logicalExpressionsArr').removeObject(logExpObj);
            var self = this;
            this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.save().then(()=>{
                        logExpObj.save().then(()=>{
                            logExpObj.destroyRecord();
                            self.set('currentChildID', null);
                            self.set('creatingNewLogExp', false);
                        });
                    });
                });
        },
        toggleNewLogExp: function(){
            var self = this;
            if (this.get('creatingNewLogExp')){ //destroy record if request is to HIDE
                var child = this.get('store').peekRecord('logical-expression', this.get('currentChildID'));
                if (child){
                    child.destroyRecord().then(()=>{
                        self.set('currentChildID', null);
                        self.set('creatingNewLogExp', false);
                    });
                }
            } else {    //create record if request is to SHOW
                var newLogExp = this.get('store').createRecord('logical-expression', {
                    booleanExpression: null,
                    logicalLink: null,
                    logicalExpressions: [],
                    ownerExpression: null
                });
                newLogExp.save().then(function(obj){
                    self.set('currentChildID', obj.get('id'));
                    self.set('creatingNewLogExp', true);
                });
            }
        }
    }
});
