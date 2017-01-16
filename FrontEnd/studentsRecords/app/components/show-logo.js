import Ember from 'ember';

export default Ember.Component.extend({

  logoIsShowing: false,
  actions: {
    showLogo (){
      this.set('logoIsShowing', true);
    },
    hideLogo(){
      this.set('logoIsShowing', false);
    }
  }

});
