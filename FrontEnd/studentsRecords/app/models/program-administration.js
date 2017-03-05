import DS from 'ember-data';

export default DS.Model.extend({

    name: DS.attr(),
    position: DS.attr(),
    department: DS.belongsTo('department')

});
