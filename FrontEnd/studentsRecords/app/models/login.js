import DS from 'ember-data';

export default DS.Model.extend({
  userName: DS.attr(),
  password: DS.attr(),
  nonce: DS.attr(),
  response: DS.attr(),
  token: DS.attr(),
  requestType: DS.attr(),
  wrongUserName: DS.attr('boolean'),
  wrongPassword: DS.attr('boolean'),
  passwordMustChanged: DS.attr('boolean'),
  passwordReset: DS.attr('boolean'),
  loginFailed: DS.attr('boolean'),
  sessionIsActive: DS.attr('boolean')
});
