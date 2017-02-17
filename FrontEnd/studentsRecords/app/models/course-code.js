import DS from 'ember-data';

export default DS.Model.extend({
	//Program Record
	courseLetter: DS.attr(),
	courseNumber: DS.attr(),
	name: DS.attr(),
	unit: DS.attr()
});
