import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    faculty: DS.belongsTo('faculty'),
    programAdministrations: DS.hasMany('program-administration'),
    assessmentCodes: DS.hasMany('assessment-code')
});
