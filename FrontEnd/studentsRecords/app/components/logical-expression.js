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

    init() {
        this._super(...arguments);
        console.log('logical-expression init');
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
        var departments = [ //STRICTLY FOR TEST PURPOSES. WOULD LOAD IN DEPARTMENTS.
            {
                "id": 0,
                "name": "all departments"
            },
            {
                "id": 1,
                "name": "Software Engineering"
            }
        ];
        var fields = [  //TESTER
            {
                "id": 0,
                "name": "Yearly weighted average"
            },
            {
                "id": 1,
                "name": "Cumulatively weighted average"
            },
            {
                "id": 2,
                "name": "Number of failed credits"
            }, 
            {
                "id": 3,
                "name": "Number of credits"
            }
        ];
        var operators = [
            {
                "id": 0,
                "name": "is greater than"
            },
            {
                "id": 1,
                "name": "is less than"
            },
            {
                "id": 2,
                "name": "is greater than or equal to"
            },
            {
                "id": 3,
                "name": "is less than or equal to"
            },
            {
                "id": 4,
                "name": "is equal to"
            },
            {
                "id": 5,
                "name": "is not equal to"
            }
        ];
        this.set('fields', fields);
        this.set('operators', operators);
        this.set('logLinks', logLinks);
        this.set('departments', departments);
    },

    didInsertElement() {
        this.set('parent', this);
        console.log('element inserted');
    },

    actions: {
        splitArg(argname) {
            if (argname == 'arg1')
            this.set(argname + 'IsLogExp', true);
            else
                this.get('test').log();
            //set arg to object
        },

        removeArg(argname) {
            this.set(argname + 'IsLogExp', false);
            this.set(argname, null);
        },

        removeSelf() {
            console.log('removing self');
            if (this.get('deleteSelf')) {
                this.get('deleteSelf')();
            }
        },

        log() {
            console.log('Hello World! I am at level ' + this.get('level'));
        },

        logchild() {
            this.get('test').send('log');
        },

        cancel: function(){
            this.set('showWindow', false);
            Ember.$('.ui.modal').modal('hide');
            Ember.$('.ui.modal').remove();
        }
    }
});
