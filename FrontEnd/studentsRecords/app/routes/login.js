import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    if (this.get('oudaAuth').get('isAuthenticated')) { //This is to disable the effect of back button in the browser
      //     location.replace(location.origin+'/home');
      this.get('oudaAuth').close();
      this.render('login', {  // the template to render
        into: 'application' ,  // the template to render into
        outlet: 'login'
      });
    }else {
      this.render('login', {  // the template to render
        into: 'application' ,  // the template to render into
        outlet: 'login'
      });
    }
  }
});
