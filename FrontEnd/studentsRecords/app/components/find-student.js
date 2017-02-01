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
    findResults: null,
    
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
      console.log(Ember.$('#residency').val());
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
        self.set('findResults', records);
        
    });

		},
    	exit: function () {
    		this.set('notDONE', false);
	    	Ember.$('.ui.modal').modal('hide');
	    	Ember.$('.ui.modal').remove();
    	},
      clear: function () {
        Ember.$('#studentNumber').val('');
        Ember.$('#firstName').val('');
        Ember.$('#lastName').val('');
        Ember.$('#gender').val(0);
        Ember.$('#residency').val(-1);
        Ember.$('#dobFrom').val('');
        Ember.$('#dobTo').val('');
        this.set('findResults', null);
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
