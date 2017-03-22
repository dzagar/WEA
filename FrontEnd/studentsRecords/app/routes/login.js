import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    var cssClass = this.toCssClass();
    // you probably don't need the application class
    // to be added to the body
    if (cssClass !== 'application') {
      Ember.$('body').addClass(cssClass);
    }
  },
  deactivate: function() {
    Ember.$('body').removeClass(this.toCssClass());
  },
  toCssClass: function() {
    return this.routeName.replace(/\./g, '-').dasherize();
  },
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
