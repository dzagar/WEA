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
  isImportShowing: false,
  routing: Ember.inject.service('-routing'),

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isImportShowing', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isImportShowing', false);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', true);
      this.set('isSystemCodesShowing', false);
      this.set('isImportShowing', false);
    },
    SystemCodes (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', true);
      this.set('isImportShowing', false);
    },
    import (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isImportShowing', true);
    },
    studentsRecords () {
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isSystemCodesShowing', false);
      this.set('isImportShowing', true);
    },
    admin () {
      this.get('routing').transitionTo('admin-portal');
    },
    logout () {
      this.get('oudaAuth').close();
      this.get('routing').transitionTo('login');
    }
  }
});
