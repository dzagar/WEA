import DS from 'ember-data';

export default DS.Model.extend({
	schoolName: DS.attr(),
	courses: DS.hasMany('high-school-course')
});
