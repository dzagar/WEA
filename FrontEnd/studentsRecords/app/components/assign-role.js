//
// This controller is responsible to assign system roles
// to existing users
//
import Ember from 'ember';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  isManagingUserRole: false,
  ID: null,
  userRecord: null,
  selectedRole: null,
  userRoleModel: null,
  userRoles: [],

  MR001IsPermitted: Ember.computed(function(){
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MR001") >= 0);
    }
  }),


  roleCodeModel: Ember.computed(function () {
    return this.get('store').findAll('roleCode');
  }),

  didRender() {
    this._super(...arguments);
    Ember.$('.ui.modal')
      .modal({
        closable: false,
        transition: 'horizontal flip',
      })
      .modal('show');


  },



  actions: {
    manageRoles() {

      var userID = this.get('ID');
      var myStore = this.get('store');
      this.set ('userRecord', this.get('store').peekRecord('user', userID));
      var self = this;

      self.set('userRoleModel',  []);
      myStore.query('userRole', {filter: {user: userID}}).then(function (roles) {
        roles.forEach(function (oneRole) {
          var roleID = oneRole.get('role').get('id');
          self.get('store').findRecord('roleCode', roleID).then(function(role){
            self.get('userRoleModel').pushObject(role);
          });
        });
        self.set('isManagingUserRole', true);
      });
    },


    done () {
      this.set('isManagingUserRole', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    selectRole(role) {
      this.$('.ui.floating.dropdown .text').val('Add User Role');

      var myStore = this.get('store');
      var roleCode = myStore.peekRecord('roleCode', role);

      var roleNotAssigned = this.get('userRoleModel').every(function (oneRole) {
     //   return (role !== oneRole.id);
        return (roleCode.get('id') !== oneRole.id);
      });

      if (roleNotAssigned) {
        this.get('userRoleModel').pushObject(roleCode);
        myStore.createRecord('userRole', {
          dateAssigned: new Date(),
          user: myStore.peekRecord('user', this.get('userRecord').get('id')),
          role: roleCode
        }).save();
      }
    },

    deleteRole: function(id, userID){
      var myStore = this.get('store');
      if (confirm ('Are you sure?')) {


        var roles = [];

        this.get('userRoleModel').forEach(function(userrole) {
          if (userrole.id !== id) {
            roles.pushObject(userrole);
          }
        });
        this.set('userRoleModel', roles);

        myStore.queryRecord('userRole', {filter: {user: userID, role: id}}).then(function (userRole) {
          userRole.user = null;
          userRole.role = null;
          userRole.save().then(function(toDelete){
            toDelete.destroyRecord();
          });
        });
      }
    }
  }
});
