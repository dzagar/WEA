import Ember from 'ember';

export default Ember.Component.extend({

    applyEmphasis: Ember.computed('level', function() {
        return (this.get('level') % 2) === 1;
    }),
    showWindow: null,
    logLinks: null,  //logical link (any or all)
    department: null,   //what department this rule applies to
    fields: null,    //fields (argument 1 of boolean)
    operators: null,    //possible boolean operators (greater than, less than, etc)
    operator: null,
    arg1: null,
    arg2: null,
    arg1IsLogExp: false, /*Ember.computed('arg1', function() {
        return (typeof(this.get('arg1')) === 'object') && (this.get('arg1') !== null);
    }),*/
    arg2IsLogExp: false, /*Ember.computed('arg2', function() {
        return (typeof(this.get('arg2')) === 'object') && (this.get('arg2') !== null);
    }),*/
    level: 0,
    deleteSelf: null,
    parent: null,
    test: null,
    booleanExps: [],
    oldBooleanExps: [],
    count: 0,
    extraBoolExp: [],   //only one expression should ever be in here
    store: Ember.inject.service(),
    creatingNewLogExp: false,
    rule: null, //sent in from parameter builder
    objectID: null,     //THIS logical expression ID
    currentChildID: null,   //children's logical expression ID


    init() {
        this._super(...arguments);
        var self = this;
        var boolexps = [    //TESTESTESTEST
            {
                "field": 0,
                "opr": 2,
                "val": 40
            },
            {
                "field": 2,
                "opr": 3,
                "val": 20
            }
        ];

        var logLinks = [
            {
                "id": 0,
                "text": "all"
            },
            {
                "id": 1,
                "text": "any"
            },
        ];
        this.get('store').findAll('department').then(function(departments){
            self.set('departments', departments);
        });
        // var departments = [ //STRICTLY FOR TEST PURPOSES. WOULD LOAD IN DEPARTMENTS.
        //     {
        //         "id": 0,
        //         "name": "all departments"
        //     },
        //     {
        //         "id": 1,
        //         "name": "Software Engineering"
        //     }
        // ];
        var extra = [{
            "field": null,
            "opr": null,
            "val": null
        }];
        this.set('oldBooleanExps', boolexps);
        this.set('booleanExps', boolexps);
        this.set('logLinks', logLinks);
        //this.set('departments', departments);
        this.set('extraBoolExp', extra);
        this.set('count', this.get('booleanExps').length);

    },

    didInsertElement() {
        this.set('parent', this);
        console.log('element inserted');
    },

    actions: {
        // splitArg(argname) {
        //     if (argname == 'arg1')
        //     this.set(argname + 'IsLogExp', true);
        //     else
        //         this.get('test').log();
        //     //set arg to object
        // },

        // removeArg(argname) {
        //     this.set(argname + 'IsLogExp', false);
        //     this.set(argname, null);
        // },

        destroyBoolExp: function(item){
            this.get('booleanExps').removeObject(item);
        },

        addBoolExp: function(boolExp){
            this.get('booleanExps').insertAt(this.get('count'), {
                "field": boolExp.field,
                "opr": boolExp.opr,
                "val": boolExp.val
            });
            var extra = [{
                "field": null,
                "opr": null,
                "val": null
            }];
            this.set('extraBoolExp', extra);
            this.set('count', this.get('count')+1);
        },
        createLogExp: function(){
            // var newExp = this.get('store').createRecord('logical-expression', {
            //     booleanExpression: 
            // });
        },
        addLogExp: function(newID, expLevel){

        },
        toggleNewLogExp: function(){
            var self = this;
            if (this.get('creatingNewLogExp')){ //destroy record if request is to HIDE
                this.get('store').find('logical-expression', this.get('currentChildID')).then(function(obj){
                    obj.destroyRecord().then(function(){
                        self.set('currentChildID', null);
                        self.get('creatingNewLogExp', false);
                        console.log('entered destroy logexp');
                    });
                });
            } else {    //create record if request is to SHOW
                var newLogExp = this.get('store').createRecord('logical-expression', {
                    booleanExps: null,
                    logicalLink: null,
                    logicalExpressions: []
                });
                newLogExp.save().then(function(obj){
                    self.set('currentChildID', obj.get('id'));
                    self.set('creatingNewLogExp', true);
                    console.log('entered create/save logexp');
                })
            }
        }
    }
});
