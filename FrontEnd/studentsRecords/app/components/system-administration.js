import Ember from 'ember';

export default Ember.Component.extend({
  isUsersShowing: true,
  isFeatureEditing: false,
  isRolesEditing: false,
  isAdjudicationRulesEditing: false,
  ADM01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("ADM01") >= 0);
    }
  }),

  didInsertElement() {
    Ember.$(document).ready(function(){
      Ember.$('.ui .adminMenu .item').on('click', function() {
        Ember.$('.ui .adminMenu .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },

  actions: {
    manageUsers () {
      this.set('isUsersShowing', true);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', false);
      this.set('isAdjudicationRulesEditing', false);


    },
    manageRoles (){
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', true);
      this.set('isAdjudicationRulesEditing', false);

    },

    manageFeatures (){
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', true);
      this.set('isRolesEditing', false);
      this.set('isAdjudicationRulesEditing', false);
    },

    manageAdjudication (){
      this.set('isUsersShowing', false);
      this.set('isFeaturesEditing', false);
      this.set('isRolesEditing', false);
      this.set('isAdjudicationRulesEditing', true);
    }


  }
});
