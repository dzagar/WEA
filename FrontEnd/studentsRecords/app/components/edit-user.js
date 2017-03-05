import Ember from 'ember';

export default Ember.Component.extend({
  isUserFormEditing: false,
  store: Ember.inject.service(),
  userRecord: null,
  ID: null,
  Model: null,
  selectedDate: null,
  userName: null,
  encryptedPassword: null,
  isResettingPassword: null,

  didRender() {
    this._super(...arguments);
    Ember.$('.ui.modal')
      .modal({
        closable: false,
        transition: 'horizontal flip'
      })
      .modal('show');
  },

  EU001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU001") >= 0);
    }
  }),
  EU002IsPermitted: Ember.computed(function(){ //ResetPassword
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU002") >= 0);
    }
  }),
  EU003IsPermitted: Ember.computed(function(){ //Delete user
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU003") >= 0);
    }
  }),


  actions: {
    saveUser () {
      var name = this.get('userName');
      var myStore = this.get('store');
      var self = this;

      myStore.queryRecord('password', {filter: {userName: name}}).then(function (userShadow) {
        userShadow.set('userAccountExpiryDate', new Date(self.get('selectedDate')));
        myStore.find('user',  userShadow.get('user').get('id')).then(function(user) {
          if (self.get('isResettingPassword')){
            var authentication = self.get('oudaAuth');
            userShadow.set('encryptedPassword', authentication.hash(self.get('tempPassword')));
            userShadow.set('passwordMustChanged', true);
            userShadow.set('passwordReset', true);
          }
          userShadow.set ('user', self.get('userRecord'));
          userShadow.save().then(function () {
            user.save().then(function(){
              self.set('isUserFormEditing', false);
              Ember.$('.ui.modal').modal('hide');
              Ember.$('.ui.modal').remove();
            });
          });

        });
      });
    },

    assignDate (date){
      this.set('selectedDate', date);
    },

    resetPassword (){
      this.set('isResettingPassword', true);
    },

    cancelResetPassword () {
      this.set('isResettingPassword', false);
    },

    editUser () {
      var userID = this.get('ID');
      var myStore = this.get('store');
      this.set ('userRecord', this.get('store').peekRecord('user', userID));
      var self = this;
      myStore.queryRecord('password', {filter: {user: userID}}).then(function (userShadow) {
        var date = userShadow.get('userAccountExpiryDate');
        var datestring = date.toISOString().substring(0, 10);
        self.set('selectedDate', datestring);
        self.set('userName', userShadow.get('userName'));
        self.set('isUserFormEditing', true);
      });
    },

    cancel () {
      this.set('isUserFormEditing', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },


  }
});

