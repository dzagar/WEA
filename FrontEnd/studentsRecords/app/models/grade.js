import DS from 'ember-data';

export default DS.Model.extend({
    mark: DS.attr(),
    note: DS.attr(),
    courseCode: DS.belongsTo('course-code'),
    term: DS.belongsTo('term')
});
