import Ember from 'ember';

export default Ember.Component.extend({

    currentStudent: null,
    currentIndex: null,
    findResults: null,
    firstIndex: 0,
    gender: null,
    lastIndex: 0,
    limit: null,
    notDONE: null,
    offset: null,
    pageSize: null,
    residency: null,
    store: Ember.inject.service(),
    studentPhoto: null,
    studentsRecords: null,
    
    
    
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
	}
});
