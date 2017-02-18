import Ember from 'ember';

export default Ember.Component.extend({
  
  currentIndex: null,
  currentStudent: null,
  offset: 0,
  oldIndex: 0,
  oldOffset: 0,
  oldStudent: null,
  pageNumber: 0,
  pageSize: 10,
  showAllStudents: true,
  showMenuBar: false,
  store: Ember.inject.service(),
  studentsRecords: null,
  totalPages: 0,

  actions: {

    back() {
      this.set('offset', this.get('oldOffset'));
      this.set('index', this.get('oldIndex'));
      this.set('currentStudent', this.get('currentStudent'));
      this.set('showAllStudents', false);
      this.set('showMenuBar', true);
    },

    firstPage() {
      this.get('changeOffset')(0, false);
    },

    lastPage() {
      this.get('changeOffset')((this.get('totalPages') - 1) * this.get('pageSize'), false);
    },

    nextPage() {
      this.get('changeOffset')(this.get('pageSize'), true);
    },

    previousPage() {
      this.get('changeOffset')(-this.get('pageSize'), true);
    },

    selectStudent(student, index) {
      this.set('showAllStudents', false);
      this.set('showMenuBar', true);
      this.set('currentIndex', index);
      this.set('currentStudent', student);
    },
  },

  init() {
    this._super(...arguments);
    console.log('allStudents init triggered!')
    this.set('oldOffset', this.get('offset'));
    this.set('oldIndex', this.get('currentIndex'));
    this.set('oldStudent', this.get('currentStudent'));
  }
});
