import Ember from 'ember';

export default Ember.Component.extend({
	showingAdjudication: true,

	actions: {
		showAdjudication(){
            this.set('showingAdjudication', true);
        },
        showReports(){
            this.set('showingAdjudication', false);
        },
	},

	didRender() {
      Ember.$('.ui .menu .item').on('click', function() {
	      $('.ui .menu .item').removeClass('active');
	      $(this).addClass('active');
	   });
    }
});
