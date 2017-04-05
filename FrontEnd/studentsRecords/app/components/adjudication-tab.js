import Ember from 'ember';

export default Ember.Component.extend({

	termID: null,

	init() {
    this._super(...arguments);
    Ember.$('.menu .item').tab();
  },

  actions: {
  	quickGenerateReport: function(termCodeID){
  		this.set('termID', termCodeID);
			Ember.$(".ui.tab").removeClass("active");
			Ember.$(".menu .item").removeClass("active");
			Ember.$(".ui.tab[data-tab='Reports']").addClass("active");
			Ember.$(".menu .item[data-tab='Reports']").addClass("active");
  	}
  }
});
