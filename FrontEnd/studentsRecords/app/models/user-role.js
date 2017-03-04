import DS from 'ember-data';

export default DS.Model.extend({
  dateAssigned: DS.attr('date'),
  user: DS.belongsTo('user',{ async: true }),
  role: DS.belongsTo('roleCode',{ async: true })
});
