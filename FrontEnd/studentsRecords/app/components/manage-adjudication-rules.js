import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        save() {

        },
        cancel() {

        },
        addNewRule() {            
            this.set('code', "");
            this.set('ruleDescription', "");
            this.set('ruleParameter', "");
            this.set('isEditing', true);
        }
    }
});
