import DS from 'ember-data';

export default DS.Model.extend({
	grade: DS.hasMany('high-school-grade'),
	level: DS.attr(),
	source: DS.attr(),
	unit: DS.attr(),
	school: DS.belongsTo('high-school'),
	subject: DS.belongsTo('high-school-subject')
});
