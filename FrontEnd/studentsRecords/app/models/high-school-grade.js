import DS from 'ember-data';

export default DS.Model.extend({
	student: DS.belongsTo('student'),
	mark: DS.attr(),
	source: DS.belongsTo('high-school-course')
});
