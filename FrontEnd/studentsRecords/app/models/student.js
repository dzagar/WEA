	import DS from 'ember-data';

export default DS.Model.extend({
  DOB: DS.attr(),
  firstName: DS.attr(),
  gender: DS.belongsTo('gender'),
  lastName: DS.attr(),
  studentNumber: DS.attr(),
  photo: DS.attr(),
  resInfo: DS.belongsTo('residency'),
  scholarships: DS.hasMany('scholarship'),
  advancedStandings: DS.hasMany('advanced-standing'),
  highSchoolCourses: DS.hasMany('high-school-grade'),
  terms: DS.hasMany('term'),
  registrationComments: DS.attr(),
  basisOfAdmission: DS.attr(),
  admissionAverage: DS.attr(),
  admissionComments: DS.attr(),
  cumAVG: DS.attr(),
  cumUnitsPassed: DS.attr(),
  cumUnitsTotal: DS.attr(),
  adjudications: DS.hasMany('adjudication')
});
