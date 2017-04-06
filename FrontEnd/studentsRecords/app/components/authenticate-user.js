// Manage the behaviour of the login screen
import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  isPasswordChanging: null,
  tempPassword: null,
  error: null,

  errorMessage: Ember.computed ('error', function(){
    return this.get('error');
  }),

  actions: {
    login(){
      var authentication = this.get('oudaAuth');
      var self = this;
      if (this.get('name') === "root"){
        authentication.openRoot(this.get('password')).then(function (name) {
          authentication.set('getName', name);
          self.get('routing').transitionTo('home');
        }, function (error) {
          //console.log(error);
        });
      } else {
        authentication.open(this.get('name'), this.get('password')).then(function () {
          authentication.set('getName', self.get('name'));
          self.set('error', null);
          self.get('routing').transitionTo('home');
        }, function (error) {
          if (error === "passwordReset") {
            self.set('isPasswordChanging', true);
          } else {
            if (error === "wrongUserName") {
              Ember.$("#err").addClass("ui error message");
              self.set('error', 'Please enter a correct username');
            } else {
              if (error === "wrongPassword") {
                Ember.$("#err").addClass("ui error message");
                self.set('error', 'Please enter a correct password');
              } else {
                if (error === "loginFailed") {
                  Ember.$("#err").addClass("ui error message");
                  self.set('error', 'Login Failed ...');
                }
              }
            }
          }
        });
      }
    },

    save(){
      var authentication = this.get('oudaAuth');
      var myStore = this.get('store');
      var userName = this.get('name');
      var hashedPassword = authentication.hash(this.get('firstPassword'));
      var self = this;
      myStore.queryRecord('password', {filter: {userName: userName}}).then(function (userShadow) {
        userShadow.set('encryptedPassword', hashedPassword);
        userShadow.set('passwordMustChanged', true);
        userShadow.set('passwordReset', false);
        userShadow.save().then(function () {
          self.get('oudaAuth').close();
          self.set('isPasswordChanging', false);
          //self.get('routing').transitionTo('login');
        });
      });
    }
  }
});
