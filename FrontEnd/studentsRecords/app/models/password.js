import DS from 'ember-data';

export default DS.Model.extend({
  userName: DS.attr(),
  encryptedPassword: DS.attr(),
  salt: DS.attr(),
  userAccountExpiryDate: DS.attr('date'),
  passwordMustChanged : DS.attr('boolean'),
  passwordReset: DS.attr('boolean'),
  user: DS.belongsTo('user',{ async: true })
});
