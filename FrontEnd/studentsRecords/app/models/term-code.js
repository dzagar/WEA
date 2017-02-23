import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	grades: DS.hasMany('grade'),
	programs: DS.hasMany('program-record'),
	student: DS.belongsTo('student')
	//Program Record
    // Adjudication
});
