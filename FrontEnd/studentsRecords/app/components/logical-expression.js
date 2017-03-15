import Ember from 'ember';

export default Ember.Component.extend({

    operator: null,
    arg1: null,
    arg2: null,
    arg1IsLogExp: false, /*Ember.computed('arg1', function() {
        return (typeof(this.get('arg1')) === 'object') && (this.get('arg1') !== null);
    }),*/
    arg2IsLogExp: false, /*Ember.computed('arg2', function() {
        return (typeof(this.get('arg2')) === 'object') && (this.get('arg2') !== null);
    }),*/

    init() {
        this._super(...arguments);
        console.log('logical-expression init');
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
            this.set(argname + 'IsLogExp', !this.get(argname + 'IsLogExp'));
        }
    }
});
