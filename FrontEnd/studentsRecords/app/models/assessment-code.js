import DS from 'ember-data';

export default DS.Model.extend({    
    code: DS.attr(),
    name: DS.attr(),
    adjudications: DS.hasMany('adjudication'),
    logicalExpressions: DS.belongsTo('logical-expression'),
    departments: DS.hasMany('department'),
    adjudicationCategory: DS.belongsTo('adjudication-category')
});
