import Ember from 'ember';

export default Ember.Component.extend({


    store: Ember.inject.service(),
    assessmentCodeModel: Ember.computed(function() {
        return this.get('store').query('assessment-code',  {});
    }),

    actions: {
        save() {

        },
        cancel() {
            this.set('isEditing', false);
        },
        addNewRule() {            
            this.set('code', "");
            this.set('ruleDescription', "");
            this.set('ruleParameter', "");
            this.set('isEditing', true);
        }
    }
});
