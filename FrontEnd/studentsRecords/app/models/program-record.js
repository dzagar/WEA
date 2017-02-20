import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    level: DS.attr(),
    load: DS.attr(),
    termCode: DS.belongsTo('term-code'),
    planCodes: DS.hasMany('plan-code')

});
