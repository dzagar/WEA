import DS from 'ember-data';

export default DS.Model.extend({
  // name of the system functionality to be assign to a user
  code: DS.attr(),
  sysFeature: DS.attr(),
  roleCodes: DS.hasMany('roleCode',{ async: true })
});
