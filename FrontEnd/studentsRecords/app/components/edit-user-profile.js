import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  userProfile: null,
  user: null,
  Model: null,
  userName: null,
  encryptedPassword: null,
  isChangingPassword: null,

  getUser: Ember.computed (function () {
    var userID = this.get('user');
    var myStore = this.get('store');
    var self = this;
    myStore.queryRecord('password', {filter: {userName: userID}}).then(function (userShadow) {
      myStore.find('user',  userShadow.get('user').get('id')).then(function(user) {
        self.set('userProfile', user);
        return self.get('userProfile');
      });
    });

  }),

  EUP01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EUP01") >= 0);
    }
  }),

  actions: {
    saveUser () {
      var userID = this.get('user');
      var myStore = this.get('store');
      var self = this;

      myStore.queryRecord('password', {filter: {userName: userID}}).then(function (userShadow) {
        myStore.find('user',  userShadow.get('user').get('id')).then(function(user) {
          if (self.get('isChangingPassword')){
            var authentication = self.get('oudaAuth');
            userShadow.set('encryptedPassword', authentication.hash(self.get('newPassword1')));
            userShadow.set('passwordMustChanged', true);
          }
          userShadow.set ('user', self.get('userProfile'));
          userShadow.save().then(function () {
            user.save().then(function(){
              self.get('routing').transitionTo('home');
            });
          });

        });
      });
    },

    changePassword (){
      this.set('isChangingPassword', true);
    },

    cancelChangePassword () {
      this.set('isChangingPassword', false);

    },


    cancel () {
      this.get('routing').transitionTo('home');
    }
  }
});
