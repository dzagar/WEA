import DS from 'ember-data';

export default DS.Model.extend({
    
    booleanExpression: DS.attr(),
    logicalLink: DS.attr(),
    assessmentCode: DS.belongsTo('assessment-code'),
    logicalExpressions: DS.hasMany('logical-expression')
});
