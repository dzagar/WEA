import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,
    departmentModel: null,
    ruleFlagged: null,  //flag for review
    isAdding: false,
    isEditing: false,
    selectedParameterType: null,
    coursesModel: null,
    categoryModel: null,
    selectedCourse: null,
    ruleObj: null,  //current rule object
    ruleCategory: null, //adjudication category
    loadRuleObj: false,
    ruleName: null, //code
    ruleCode: null, //name
    selectedDepartments: [],  //departments
    newRule: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('assessment-code').then(function(codes) {
            self.set('assessmentCodeModel', codes);
        });
        this.get('store').findAll('course-code').then(function(courses) {
            self.set('coursesModel', courses);
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
            if (this.get('store').peekRecord('adjudication-category', this.get('ruleCategory'))){
                ruleSaving.set('adjudicationCategory', this.get('store').peekRecord('adjudication-category', this.get('ruleCategory')));
            }
            else{
                ruleSaving.set('adjudicationCategory', null);
            }
            this.get('selectedDepartments').forEach(function(departmentID){
                ruleSaving.get('departments').pushObject(self.get('store').peekRecord('department', departmentID));
            });
            ruleSaving.save().then(function(){
                self.set('isEditing', false);
                self.set('newRule', false);
                self.set('ruleCategory', null);
                self.set('selectedDepartments', []);
                self.set('ruleName', "");
                self.set('ruleCode', "");
                self.set('ruleFlagged', false);
            });

        },
        cancel(ruleObject) {
            var self = this;
            if (this.get('newRule')){
                this.set('ruleObj', null);
                self.set('isEditing', false);
                ruleObject.destroyRecord().then(()=>{
                    self.set('ruleCategory', null);
                    self.set('selectedDepartments', []);
                    self.set('ruleName', "");
                    self.set('ruleCode', "");
                    self.set('ruleFlagged', false);
                });
            } else {
                this.set('ruleObj', null);
                self.set('isEditing', false);
                self.set('ruleCategory', null);
                self.set('selectedDepartments', []);
                self.set('ruleName', "");
                self.set('ruleCode', "");
                self.set('ruleFlagged', false);
            }
        },
        addNewRule() {  
            var self = this;
            this.set('newRule', true);
            this.set('ruleName', "");
            this.set('ruleCode', "");
            this.set('isEditing', true);        
            var ruleName = this.get('ruleName');
            var ruleCode = this.get('ruleCode');
            var newRule = this.get('store').createRecord('assessment-code', {
                name: ruleName,
                code: ruleCode
            });
            newRule.save().then(function(){
                self.set('ruleObj', newRule);
                self.set('loadRuleObj', true);
            });         
        },

        setRuleFields(ruleEditing){
            var self = this;
            this.set('newRule', false);
            this.set('ruleObj', ruleEditing);
            this.set('ruleCode', ruleEditing.get('code'));
            this.set('ruleName', ruleEditing.get('name'));
            ruleEditing.get('departments').forEach(function(dpt){
                self.get('selectedDepartments').push(dpt.get('id'));
            });
            this.set('ruleFlagged', ruleEditing.get('flagForReview'));
            if (ruleEditing.get('adjudicationCategory').get('id')){
                this.set('ruleCategory', ruleEditing.get('adjudicationCategory').get('id'));
            } else {
                this.set('ruleCategory', 123);
            }
            this.set('loadRuleObj', true);
            this.set('isEditing', true);
        },


        deleteRule(rule) {
           rule.destroyRecord();
        },
        addFirstRule(){
            this.set('isAdding', true);
        },
        cancelRuleAdd() {
            this.set('isAdding', false);

        },
        selectCourse(newCourse) {
            this.set('selectCourse', newCourse);
        }
    }
});
