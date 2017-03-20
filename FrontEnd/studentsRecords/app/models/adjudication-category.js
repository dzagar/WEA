import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    programYear: DS.attr(),
    assessmentCodes: DS.hasMany('assessment-code')
});
