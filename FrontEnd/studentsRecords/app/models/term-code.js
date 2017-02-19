import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	courses: DS.hasMany('grade'),
	programs: DS.hasMany('program-record')
	//Program Record
    // Adjudication
});
