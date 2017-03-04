import DS from 'ember-data';

export default DS.Model.extend({
  // name can be: Admin, Faculty, Staff, etc
  name: DS.attr(),
  userRoles: DS.hasMany('userRole', { async: true }),
  features: DS.hasMany('rolePermission', { async: true })
});
