import DS from 'ember-data';

export default DS.Model.extend({
    mark: ds.attr(),
    note: ds.attr(),
    term: ds.belongsTo('term-code'),
    course: ds.belongsTo('course-code')

});
