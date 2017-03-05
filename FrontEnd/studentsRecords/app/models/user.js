import DS from 'ember-data';

export default DS.Model.extend({
  // User profile
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  enabled: DS.attr('boolean'),
  userShadow: DS.belongsTo('password',{ async: true }),
  userRoles: DS.hasMany('userRole', { async: true })
});
