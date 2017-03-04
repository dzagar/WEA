import Ember from 'ember';

export default Ember.Component.extend({

    currentStudent: null,
    currentIndex: null,
    findResults: null,
    firstIndex: 0,
    lastIndex: 0,
    limit: null,
    notDONE: null,
    offset: null,
    pageSize: null,
    store: Ember.inject.service(),
    studentPhoto: null,
    studentsRecords: null,
    
    
	actions: {

		search: function () {
    		
      var self = this;
      this.get('store').query('student', {
        number: Ember.$('#studentNumber').val(),
        firstName: Ember.$('#firstName').val(),
        lastName: Ember.$('#lastName').val(),
        limit: self.get('limit'),
        offset: 0
      }).then(function (records) {
        console.log("did things");
        console.log(records);
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
        this.set('findResults', null);
      }
	}
});
