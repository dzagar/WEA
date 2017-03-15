import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    courseCodes: DS.hasMany('course-code')

});
