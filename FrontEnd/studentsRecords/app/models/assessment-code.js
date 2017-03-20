import DS from 'ember-data';

export default DS.Model.extend({    
    code: DS.attr(),
    name: DS.attr(),
    adjudications: DS.hasMany('adjudication'),
    logicalExpression: DS.belongsTo('logical-expression'),
    departments: DS.hasMany('department'),
    adjudicationCategory: DS.belongsTo('adjudication-category'),
    flagForReview: DS.attr('boolean')
});
