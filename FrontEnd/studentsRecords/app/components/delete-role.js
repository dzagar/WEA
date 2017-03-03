import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  actions: {

    deleteRole: function (roleID) {
      var myStore = this.get('store');
      if (confirm('This will delete the role among all users!. Are you sure?')) {

        // first remove all features  from the role
        myStore.findAll('rolePermission').then(function (features) {
          features.forEach(function (feature) {
            var roles = [];
            feature.get('roleCodes').forEach(function (rolecode) {
              if (rolecode.id !== roleID) {
                roles.pushObject(rolecode);
              }
            });
            feature.set('roleCodes', roles);
            feature.save();
          });
        });

        // second remove users from the role
        myStore.query('userRole', {filter: {role: roleID}}).then(function (userRole) {
          userRole.forEach(function (oneRole) {
            oneRole.user = null;
            oneRole.role = null;
            oneRole.save().then(function (toDelete) {
              toDelete.destroyRecord();
            });
          });
        });


        // now delete the role
        myStore.find('roleCode', roleID).then(function (role) {
          role.set('userRoles', []);
          role.set('features', []);
          role.save().then(function (toDelete) {
            toDelete.destroyRecord();
          });
        });
      }
    }
  }
});
