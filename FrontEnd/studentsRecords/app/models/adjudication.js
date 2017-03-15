import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr(),
    note: DS.attr(),
    student: DS.belongsTo('student'),
    termCode: DS.belongsTo('term-code'),
    assessmentCode: DS.belongsTo('assessment-code')
});
