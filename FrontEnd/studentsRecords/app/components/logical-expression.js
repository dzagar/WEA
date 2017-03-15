import Ember from 'ember';

export default Ember.Component.extend({

    applyEmphasis: Ember.computed('level', function() {
        return (this.get('level') % 2) === 1;
    }),
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
    },

    didInsertElement() {
        this.set('parent', this);
        console.log('element inserted');
    },

    didRender() {
        Ember.$('#arg1dropdown')
        .dropdown({
            direction: 'downward',
            fullTextSearch: 'exact'
        });
        Ember.$('#opdropdown')
        .dropdown({
            direction: 'downward',
            fullTextSearch: 'exact'
        });
        Ember.$('#arg2dropdown')
        .dropdown({
            direction: 'downward',
            fullTextSearch: 'exact'
        })
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
        }
    }
});
