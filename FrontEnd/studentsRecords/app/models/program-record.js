import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    level: DS.attr(),
    load: DS.attr(),
    term: DS.belongsTo('term'),
    planCodes: DS.hasMany('plan-code')
});
