import Ember from 'ember';

export default Ember.Route.extend({
  
  beforeModel () {
    var authentication = this.get('oudaAuth');
    var self = this;
    authentication.fetch().then(
      function () {
        self.controller.set('login', true);
        self.transitionTo('home');
      },
      function (error) {
        //console.log("error -->" + error);
      });
  },
  actions: {
    willTransition(transition) {
      Ember.$('.ui.modal').remove();
    }
  }
});
