import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: null,
    isAdding: false,
    isEditing: false,
    selectedParameterType: null,
    parameterTypes: null,

    init() {
        this._super(...arguments);
        var self = this;
        this.get('store').findAll('assessment-code').then(function(codes) {
            self.set('assessmentCodeModel', codes);
        });
        this.set('parameterTypes', [{"value": "YWA", "text": "Yearly weighted average"}, {"value": "CWA", "text": "Cumulative weighted average"}, {"value": "fails", "text": "Number of failed courses"}]);
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
			Ember.$('.ui.modal').modal('hide');
      		Ember.$('.ui.modal').remove();
            this.set('isAdding', false);
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
                    break;
                }
                case "CWA":
                {
                    Ember.$("#firstParamDesc").text("Minimum cumulative weighted Average: ");
                    Ember.$("#secondParamDesc").text("Maximum cumulative weighted Average: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    break;
                }
                case "fails":
                {
                    Ember.$("#firstParamDesc").text("Minimum number of failed courses: ");
                    Ember.$("#secondParamDesc").text("Minimum number of failed courses: ");
                    Ember.$("#firstParamValue").attr("disabled", false);
                    Ember.$("#secondParamValue").attr("disabled", false);
                    break;
                }

            }
            
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
