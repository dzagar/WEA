import DS from 'ember-data';

export default DS.Model.extend({
	student: DS.belongsTo('student'),
	name: DS.attr(),
	description: DS.attr(),
	units: DS.attr(),
	grades: DS.attr(),
	from: DS.attr()
});
