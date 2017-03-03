import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  userRecord: null,
  ID: null,

  EU003IsPermitted: Ember.computed(function(){ //Delete user
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU003") >= 0);
    }
  }),

  didRender() {
        Ember.$('.button').popup();
  },



  actions: {
    deleteUser(){
      var myStore = this.get('store');
      var userID = this.get('ID');
      if (confirm ('Are you sure you need to delete this user?')) {
        myStore.find('user',  userID).then(function(user) {
          user.set('userRoles', []);
          user.set('userShadow', null);
          user.save().then(function(){
            user.destroyRecord();
          });
        });
        // delete the related password file
        myStore.queryRecord('password', {filter: {user: userID}}).then(function (userShadow) {
          userShadow.set('user', null);
          userShadow.save().then(function(){
            userShadow.destroyRecord();
          });
        });
        // delete the associated user roles
        myStore.query('userRole', {filter: {user: userID}}).then(function (userRoles) {
          userRoles.forEach(function (userRole){
            userRole.user = null;
            userRole.role = null;
            userRole.save().then(function(){
              userRole.destroyRecord();
            });
          });
        });
      }
    }
  }
});
