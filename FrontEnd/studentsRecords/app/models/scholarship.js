import DS from 'ember-data';

export default DS.Model.extend({
	student: DS.belongsTo('student'),
	name: DS.attr(),
	note: DS.attr()
});
