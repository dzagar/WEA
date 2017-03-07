import DS from 'ember-data';

export default DS.Model.extend({
  password: DS.attr(),
  nonce: DS.attr(),
  response: DS.attr(),
  wrongPassword: DS.attr('boolean'),
  sessionIsActive: DS.attr('boolean')
});
