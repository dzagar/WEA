import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,
    isAdding: false,
    isEditing: false,
    selectedParameterType: null,
    coursesModel: null,
    selectedCourse: null,
    ruleObj: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('assessment-code').then(function(codes) {
            self.set('assessmentCodeModel', codes);
        });
        this.get('store').findAll('course-code').then(function(courses) {
            self.set('coursesModel', courses);
            console.log(courses);
        });
        var ruleName = this.get('ruleName');
        var ruleCode = this.get('ruleCode');
        var newRule = this.get('store').createRecord('assessment-code', {
            name: ruleName,
            code: ruleCode
        });
        newRule.save().then(function(){
            self.set('ruleObj', newRule);
            console.log(newRule);
        });
    },

    actions: {
        save() {
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
        },
        addFirstRule(){
            this.set('isAdding', true);
        },
        cancelRuleAdd() {
			// Ember.$('.ui.modal').modal('hide');
            // Ember.$('.ui.modal').remove();
            this.set('isAdding', false);
        },
        selectCourse(newCourse) {
            this.set('selectCourse', newCourse);
        }
    }
});
