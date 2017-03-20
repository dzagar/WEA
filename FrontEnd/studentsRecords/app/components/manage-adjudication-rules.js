import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,
    departmentModel: null,
    ruleFlagged: null,
    isAdding: false,
    isEditing: false,
    selectedParameterType: null,
    coursesModel: null,
    categoryModel: null,
    selectedCourse: null,
    ruleObj: null,
    ruleCategory: null,
    loadRuleObj: false,


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
        this.get('store').findAll('adjudication-category').then(function(categories){
            self.set('categoryModel', categories);
        });
        this.get('store').findAll('department').then(function(departments){
            self.set('departmentModel', departments);
        });
    },

    actions: {
        save() {
            var self = this;
            var ruleSaving = this.get('ruleObj');
            ruleSaving.set('flagForReview', this.get('ruleFlagged'));
            ruleSaving.set('name', this.get('ruleName'));
            ruleSaving.set('code', this.get('ruleCode'));
            ruleSaving.set('adjudicationCategory', this.get('store').peekRecord('adjudication-category', this.get('ruleCategory')));
            this.get('selectedDepartments').forEach(function(departmentID){
                ruleSaving.get('departments').pushObject(self.get('store').peekRecord('department', departmentID));
            });
            ruleSaving.save().then(function(){
                self.set('isEditing', false);
            });

        },
        cancel() {
            this.set('isEditing', false);
        },
        addNewRule() {  
            var self = this;
            this.set('ruleName', "");
            this.set('ruleCode', "");
            this.set('ruleParameter', "");
            this.set('isEditing', true);        
            var ruleName = this.get('ruleName');
            var ruleCode = this.get('ruleCode');
            var newRule = this.get('store').createRecord('assessment-code', {
                name: ruleName,
                code: ruleCode,
                logicalExpressions: []
            });
            newRule.save().then(function(){
                self.set('ruleObj', newRule);
                console.log(newRule);
                self.set('loadRuleObj', true);
            });         
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
