import Ember from 'ember';

export default Ember.Component.extend({

    applyEmphasis: Ember.computed('level', function() {
        return (this.get('level') % 2) === 1;
    }),
    logLinks: null,  //logical link (any or all)
    department: null,   //what department this rule applies to
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

        this.get('store').findAll('department').then(function(departments){
            self.set('departments', departments);
        });

        this.set('logLinks', logLinks);
        this.set('extraBoolExp', extra);
        console.log(this.get('objectID'));

        var rec = this.get('store').find('logical-expression', this.get('objectID'));
        if (rec){
            rec.then(obj => {
                console.log('entered find record init');
                self.set('logicalExpressionsArr', obj.get('logicalExpressions'));
                self.set('booleanExps', JSON.parse(obj.get('booleanExpression')));
                self.set('logLink', obj.get('logicalLink'));
                console.log('did rcv attrs ' + self.get('objectID'));
                console.log(self.get('logicalExpressionsArr'));
            });
        }
        
    },

    didReceiveAttrs() {
        this._super(...arguments);
        var self = this;

    },

    willDestroy() { //reset component window
        this.set('logLink', null);
        this.set('booleanExps', null);
        this.set('logicalExpressionsArr', null);
        this.set('objectID', null);
        this.set('currentChildID', null);
        this.set('rule', null);
    },

    actions: {
        destroyBoolExp: function(item){
            this.get('booleanExps').removeObject(item);
            var parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
            if (parent){
                parent.set('booleanExpression', this.get('booleanExps'));
                parent.save();
            } else {
                this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.set('booleanExpression', self.get('booleanExps'));
                    obj.save();
                });
            }
        },

        addBoolExp: function(boolExp){
            var self = this;
            this.set('booleanExps', this.get('booleanExps') || []);
            this.get('booleanExps').pushObject({
                "field": boolExp.field,
                "opr": boolExp.opr,
                "val": boolExp.val
            });
            var parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
            if (parent){
                parent.set('booleanExpression', JSON.stringify(this.get('booleanExps')));
                console.log(parent);
                console.log(this.get('booleanExps'));
                parent.save();
            } else {
                this.get('store').findRecord('logical-expression', this.get('objectID'), {reload: true})
                .then(obj => {
                    obj.set('booleanExpression', JSON.stringify(self.get('booleanExps')));
                    console.log(parent);
                    console.log(self.get('booleanExps'));
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
                console.log('there is a child');
                this.get('logicalExpressionsArr').pushObject(child);
                console.log('length iz ' + this.get('logicalExpressionsArr').get('length'));
                this.get('store').find('logical-expression', this.get('objectID'))
                .then(obj => {
                    obj.get('logicalExpressions').then(function(exps){
                        exps.pushObject(child);
                        obj.save().then(function(){
                            console.log(obj.get('logicalExpressions').get('firstObject'));
                            self.set('currentChildID', null);
                            self.set('creatingNewLogExp', false);
                        });
                    });
                });
            }
            
        },
        destroyLogExp: function(logExpObj){
            var self = this;
            this.get('logicalExpressionsArr').removeObject(logExpObj);
            this.get('store').find('logical-expression', this.get('objectID'))
            .then(obj => {
                obj.get('logicalExpressions').then(function(exps){
                    exps.removeObject(logExpObj);
                    console.log('removed child with id ' + logExpObj.get('id') + ' from parent');
                    obj.save().then(function(){
                        //console.log(obj.get('logicalExpressions').get('firstObject'));
                        console.log('successful save');
                        self.set('currentChildID', null);
                        self.set('creatingNewLogExp', false);
                        //destroy in backend
                        logExpObj.destroyRecord();
                    });
                });
            });
        },
        toggleNewLogExp: function(){
            var self = this;
            let parent = this.get('store').peekRecord('logical-expression', this.get('objectID'));
            if (!parent){
                parent = this.get('store').findRecord('logical-expression', this.get('objectID'));
            }
            if (this.get('creatingNewLogExp')){ //destroy record if request is to HIDE
                var child = this.get('store').peekRecord('logical-expression', this.get('currentChildID'));
                if (child){
                    parent.get('logicalExpressions').removeObject(child);
                    parent.save().then(function(){
                        child.destroyRecord().then(function(){
                            self.set('currentChildID', null);
                            self.set('creatingNewLogExp', false);
                            console.log('entered destroy logexp');
                        });
                    });
                }
            } else {    //create record if request is to SHOW
                var parentID = this.get('objectID');
                var newLogExp = this.get('store').createRecord('logical-expression', {
                    booleanExpression: null,
                    logicalLink: "1",
                    logicalExpressions: [],
                    ownerExpression: null
                });
                //newLogExp.set('ownerExpression', parent);
                //console.log(newLogExp.get('ownerExpression').get('id'));
                console.log(newLogExp);
                //parent.get('logicalExpressions').pushObject(newLogExp);
                newLogExp.save().then(function(obj){
                    console.log('child id is ' + obj.get('id'));
                    self.set('currentChildID', obj.get('id'));
                    self.set('creatingNewLogExp', true);
                    console.log('entered create/save logexp');
                    //newLogExp.set('ownerExpression', parent);
                });
            }
        }
    }
});
