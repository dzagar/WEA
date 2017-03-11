import DS from 'ember-data';

export default DS.Model.extend({
	grades: DS.hasMany('grade'),
	programRecords: DS.hasMany('program-record'),
	student: DS.belongsTo('student'),
    termCode: DS.belongsTo('term-code'),
	termAVG: DS.attr(),
	termUnitsPassed: DS.attr(),
	termUnitsTotal: DS.attr()
});
