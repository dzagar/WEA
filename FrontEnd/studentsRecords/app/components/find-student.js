import Ember from 'ember';

export default Ember.Component.extend({

  	store: Ember.inject.service(),
  	notDONE: null,
  	residency: null,
    studentsRecords: null,
    currentStudent: null,
    currentIndex: null,
    firstIndex: 0,
    lastIndex: 0,
    studentPhoto: null,
    limit: null,
    offset: null,
    pageSize: null,
    
	actions: {

		search: function () {
    		
      var self = this;
      var dobFrom;
      var dobTo;
      if (Ember.$('#dobFrom').val()==null)
        dobFrom=new Date(-8640000000000000);
      else
        dobFrom=(Ember.$('#dobFrom').val());
      if (Ember.$('#dobTo').val()==null)
        dobTo=new Date(8640000000000000);
      else
        dobTo=(Ember.$('#dobTo').val());

      this.get('store').query('student', {
        number: Ember.$('#studentNumber').val(),
        firstName: Ember.$('#firstName').val(),
        lastName: Ember.$('#lastName').val(),
        gender: Ember.$('#gender').val(),
        DOBFrom: dobFrom,
        DOBTo: dobTo,
        resInfo: Ember.$('#residency').val()

      }).then(function (records) {
        console.log("did things");
        self.set('studentsRecords', records);
        self.set('firstIndex', records.indexOf(records.get("firstObject")));
        self.set('lastIndex', records.indexOf(records.get("lastObject")));
        // Show first student data
        self.set('currentIndex', self.get('firstIndex'));
        self.set('offset', 0);
        self.set('notDONE', false);
    });

		},
    	exit: function () {
    		this.set('notDONE', false);
	    	Ember.$('.ui.modal').modal('hide');
	    	Ember.$('.ui.modal').remove();
    	}
	},
	didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
