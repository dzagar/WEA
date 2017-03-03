import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  store: Ember.inject.service(),
  roleCodeModel: Ember.computed(function () {
    return this.get('store').findAll('roleCode');
  }),

  MSR01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MSR01") >= 0);
    }
  }),


  actions: {
    addNewRole(){
      this.set('isEditing', true);
    },

    save(){
      var myStore = this.get('store');
      var newRoleCode = myStore.createRecord('roleCode', {
        name: this.get('name'),
        userRoles: [],
        features: []
      });
      newRoleCode.save();

      this.set('isEditing', false);
    },

    cancel() {
      this.set('isEditing', false);
    }
  }
});
