import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  usersModel: Ember.computed('isUsersShowing', function(){
    return this.get('store').findAll('user');
  }),

  actions: {
    view: function (id) {
      this.$('.ui.view.modal').modal('show');
      this.set('firstName', this.get('user').get('firstName'));
      this.set('lastName', this.get('user').get('lastName'));
      this.set('email', this.get('user').get('email'));
      this.$('.popup.visible').removeClass('visible').addClass('hidden');
      this.set('isViewing', true);

      var self = this;
      var user = this.get('store').peekRecord('user', id);
      user.get('userShadow').then(function (userShadow) {
        self.set('username', userShadow.get('userName'));
        var now = userShadow.get('userAccountExpiryDate');
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var date = now.getFullYear() + "-" + (month) + "-" + (day);
        self.set('expiry', date);
      });
      this.$('.popup.visible').removeClass('visible').addClass('hidden');

      self.set('userRoleCodes', []);
      self.set('userRoles', []);
      this.get('store').query('userRole', {filter: {user: id}}).then(function (roles) {
        roles.forEach(function (oneRole) {
          var roleID = oneRole.get('role').get('id');
          self.get('store').findRecord('roleCode', roleID).then(function (role) {
            self.get('userRoleCodes').pushObject(role);
            self.get('userRoles').pushObject(oneRole);
          });
        });
      });
    }
  }
});
