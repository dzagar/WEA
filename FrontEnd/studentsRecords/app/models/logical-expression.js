import DS from 'ember-data';

export default DS.Model.extend({
    
    booleanExpression: DS.attr(),
    logicalLink: DS.attr(),
    assessmentCode: DS.belongsTo('assessment-code'),
    ownerExpression: DS.belongsTo('logical-expression', {async: true, inverse: 'logicalExpressions'}),
    logicalExpressions: DS.hasMany('logical-expression', {async: true, inverse: 'ownerExpression'})
});
