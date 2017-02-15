import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
//    Ember.$('.tabular.menu .item').tab();
    Ember.$(document).ready(function(){
      Ember.$('.ui .item').on('click', function() {
        Ember.$('.ui .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },

  isAboutShowing: false,
  isHomeShowing: true,
  isStudentsRecordsDataEntry: false,
  isSystemCodesShowing: false,
  isStudentsRecordsShowing: false,

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isStudentsRecordsShowing', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isStudentsRecordsShowing', false);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', true);
      this.set('isSystemCodesShowing', false);
      this.set('isStudentsRecordsShowing', false);
    },
    SystemCodes (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', true);
      this.set('isStudentsRecordsShowing', false);
    },
    studentsRecords () {
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isStudentsRecordsShowing', true);
    }
  }
});
