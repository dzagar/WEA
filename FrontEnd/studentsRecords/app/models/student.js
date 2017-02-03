	import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  DOB: DS.attr(),
  photo: DS.attr(),
  resInfo: DS.belongsTo('residency'),
  gender: DS.belongsTo('gender'),
  scholarships: DS.hasMany('scholarship'),
  advancedStandings: DS.hasMany('advanced-standing')

});
