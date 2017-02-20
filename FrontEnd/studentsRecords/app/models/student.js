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
  termCodes: DS.hasMany('term-code'),
  registrationComments: DS.attr(),
  basisOfAdmission: DS.attr(),
  admissionAverage: DS.attr(),
  admissionComments: DS.attr()
});
