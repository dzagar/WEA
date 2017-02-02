import Ember from 'ember';

export default Ember.Component.extend({
	helpIsShowing: false,
  actions: {
    showHelp (){
      this.set('helpIsShowing', true);
    },
    hideHelp(){
      this.set('helpIsShowing', false);
    }
  }
});
