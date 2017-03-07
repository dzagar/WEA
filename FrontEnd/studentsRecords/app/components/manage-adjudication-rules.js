import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,
    isAdding: false,
    isEditing: false,
    selectedParameterType: null,
    parameterTypes: null,
    coursesModel: null,
    selectedCourse: null,

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
        this.set('parameterTypes', [{"value": "YWA", "text": "Yearly weighted average"}, {"value": "CWA", "text": "Cumulative weighted average"}, {"value": "fails", "text": "Number of failed courses"}, {"value": "course", "text": "Courses completed"}]);
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
        },
        addFirstRule(){
            Ember.$("#addFirst").hide();
            this.set('isAdding', true);
        },
        addParameter() {
            
            var newRuleParameter = this.get('store').createRecord('logical-expression');
            switch (this.get('selectedParameterType')){
                case "YWA":
                {
                    newRuleParameter.set('booleanExpression', "Student's YWA is greater than " + this.get("firstParamValue") + " and less than " + this.get("secondParamValue"));
                    break;
                }
                case "CWA":
                {
                    newRuleParameter.set('booleanExpression', "Student's CWA is greater than " + this.get("firstParamValue") + " and less than " + this.get("secondParamValue"));
                    break;
                }
                case "fails":
                {
                    newRuleParameter.set('booleanExpression', "Student has at least " + this.get("firstParamValue") + "failed courses and at most " + this.get("secondParamValue") + "failed courses");
                    break;
                }
                case "course":
                {
                    break;
                }
            }
            var self = this;
            newRuleParameter.save().then(function() {
                Ember.$('.ui.modal').modal('hide');
                Ember.$('.ui.modal').remove();
                self.set('isAdding', false);
            });  
        },
        cancelRuleAdd() {
			Ember.$('.ui.modal').modal('hide');
      		Ember.$('.ui.modal').remove();
            this.set('isAdding', false);
        },
        selectParameterType(newParameterType) {
            this.set('selectedParameterType', newParameterType)
            switch (newParameterType){
                case "YWA":
                {
                    Ember.$("#firstParamDesc").text("Minimum yearly weighted Average: ");
                    Ember.$("#secondParamDesc").text("Maximum yearly weighted Average: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    Ember.$("#firstDropDown").addClass("disabled");
                    break;
                }
                case "CWA":
                {
                    Ember.$("#firstParamDesc").text("Minimum cumulative weighted Average: ");
                    Ember.$("#secondParamDesc").text("Maximum cumulative weighted Average: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    Ember.$("#firstDropDown").addClass("disabled");
                    break;
                }
                case "fails":
                {
                    Ember.$("#firstParamDesc").text("Minimum number of failed courses: ");
                    Ember.$("#secondParamDesc").text("Maximum number of failed courses: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    Ember.$("#firstDropDown").addClass("disabled");
                    break;
                }
                case "course":
                {
                    Ember.$("#firstParamDesc").text("Minimum grade in course: ");
                    Ember.$("#secondParamDesc").text("Maximum grade in course: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    Ember.$("#firstDropDown").removeClass("disabled");
                    break;
                }            
            }            
        },
        selectCourse(newCourse) {
            this.set('selectCourse', newCourse);

        }
    },
    didRender() {
        Ember.$('.ui.modal')
        .modal({
            closable: false
        })
        .modal('show');
    }
});
