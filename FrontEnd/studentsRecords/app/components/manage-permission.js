//
// This controller is responsible to assign system features
// (i.e., system functionality) to the pre-defined system roles
//
import Ember from 'ember';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  isManagingPermission: false,
  roleID: null, // set by the caller

  sysFeatureModel: null,
  selectedFeatures: [],

  roleName: Ember.computed(function () {
    var roleCode = this.get('store').peekRecord('roleCode', this.get('roleID'));
    return roleCode.get('name');
  }),

  rolePermissionModel: Ember.computed(function () {
    return this.get('store').findAll('rolePermission');
  }),

  init() {
    this._super(...arguments);

    this.set('selectedFeatures', []);
    var code = this.get('roleID');
    var myStore = this.get('store');
    var self = this;


    myStore.findAll('rolePermission').then(function (features) {
      features.forEach(function (feature) {
        feature.get('roleCodes').forEach(function (rolecode) {
          if (rolecode.id === code) {
            self.get('selectedFeatures').push(feature.get('id'));
          }
        });

      });
    });


    // myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
    //   self.set('sysFeatureModel', codes);
    //   codes.forEach(feature => {
    //     self.get('selectedFeatures').push(feature.get('id'));
    //   });
    //
    // });
  },

  didRender() {
    this._super(...arguments);
    Ember.$('.ui.modal')
      .modal({
        closable: false,
        transition: 'horizontal flip',
      });
    Ember.$('.ui.modal').modal('show');

  },

  actions: {
    managePermission() {
      this.set('isManagingPermission', true);
    },

    //
    // deleteRoleCode (id) {
    //   var myStore = this.get('store');
    //   var self = this;
    //   if (confirm('Are you sure?')) {
    //     var code = this.get('roleID');
    //     var roles = [];
    //     myStore.find('rolePermission', id).then(function (feature) {
    //       feature.get('roleCodes').forEach(function (rolecode) {
    //         if (rolecode.id !== code) {
    //           roles.pushObject(rolecode);
    //         }
    //       });
    //       feature.set('roleCodes', roles);
    //       feature.save().then(function () {
    //         myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
    //           self.set('sysFeatureModel', codes);
    //         });
    //       });
    //     });
    //   }
    // },

    done () {
      this.set('isManagingPermission', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    selectPermission(permissions) {
      var myStore = this.get('store');
      var code = this.get('roleID');
      var self = this;

      myStore.findAll('rolePermission').then(function (features) {
        features.forEach(function (feature) {
          var roles = [];
          feature.get('roleCodes').forEach(function (rolecode) {
            if (rolecode.id !== code) {
              roles.pushObject(rolecode);
            }
          });
          feature.set('roleCodes', roles);
          feature.save().then(function () {
            self.set('selectedFeatures', permissions);

          });
        });
      });

      permissions.forEach(function (onePermission) {
        myStore.findRecord('rolePermission', onePermission).then(function (rolePermission) {
          myStore.findRecord('roleCode', code).then(function (roleCode) {
            rolePermission.get('roleCodes').pushObject(roleCode);
            rolePermission.save().then(function () {
              myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
                self.set('sysFeatureModel', codes);
                codes.forEach(feature => {
                  self.get('selectedFeatures').push(feature.get('id'));
                });
              });
            });
          });
        });
      });
    }
  }
});
