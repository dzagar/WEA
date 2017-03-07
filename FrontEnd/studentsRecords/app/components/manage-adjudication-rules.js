import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('assessment-code').then(function(codes) {
            self.set('assessmentCodeModel', codes);
        });
    },

    actions: {
        save() {
            var ruleName = this.get('ruleName');
            var ruleCode = this.get('ruleCode');
            var newRule = this.get('store').createRecord('assessment-code', {
                name: ruleName,
                code: ruleCode
            });
            newRule.save();
            this.set('isEditing', false);

        },
        cancel() {
            this.set('isEditing', false);
        },
        addNewRule() {            
            this.set('ruleName', "");
            this.set('ruleCode', "");
            this.set('ruleParameter', "");
            this.set('isEditing', true);
        },
        deleteRule(rule) {
           rule.destroyRecord();
        }
    }
});
