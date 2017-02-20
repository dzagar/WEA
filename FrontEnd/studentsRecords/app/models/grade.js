import DS from 'ember-data';

export default DS.Model.extend({
    mark: DS.attr(),
    note: DS.attr(),
    term: DS.belongsTo('term-code'),
    course: DS.belongsTo('course-code')

});
