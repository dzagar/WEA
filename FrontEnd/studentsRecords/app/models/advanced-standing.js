import DS from 'ember-data';

export default DS.Model.extend({
	student: DS.belongsTo('student'),
	course: DS.attr(),
	description: DS.attr(),
	units: DS.attr('number'),
	grade: DS.attr(),
	from: DS.attr()
});
