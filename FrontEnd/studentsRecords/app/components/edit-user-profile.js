import Ember from 'ember';

export default Ember.Component.extend({
  encryptedPassword: null,
  error: "",
  isChangingPassword: null,
  Model: null,
  routing: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  user: null,
  userName: null,
  userProfile: null,
  
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
          var authentication = self.get('oudaAuth');
          if(self.get('isChangingPassword')){
            if (authentication.hash(self.get('newPassword1'))==authentication.hash(self.get('newPassword2'))){
                userShadow.set('encryptedPassword', authentication.hash(self.get('newPassword1')));
                userShadow.set('passwordMustChanged', true);
                self.set('error',"");
            }
            else{
              self.set('error',"Passwords do not match. Please try again. ");
              if(self.get('userProfile').get('firstName')=="" || self.get('userProfile').get('lastName')=="" || self.get('userProfile').get('email')==""){
                self.set('error',self.get('error')+"Make sure every field is filled in.");
              }
              self.set('oldPassword',"");
              self.set('newPassword1',"");
              self.set('newPassword2',"");
            }
         }
         else if(self.get('userProfile').get('firstName')=="" || self.get('userProfile').get('lastName')=="" || self.get('userProfile').get('email')==""){
            self.set('error',"Make sure every field is filled in.");
         }
         else{
          self.set('error',"");
         }
          userShadow.set ('user', self.get('userProfile'));
          userShadow.save().then(function () {
            user.save().then(function(){
              if(!self.get('error')){
                self.get('routing').transitionTo('home');
                self.set('error',"");
              }
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
