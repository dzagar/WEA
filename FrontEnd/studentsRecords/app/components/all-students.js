import Ember from 'ember';

export default Ember.Component.extend({
  
  currentIndex: null,
  currentStudent: null,
  filter: null,
  limit: 0,
  message: null,
  offset: 0,
  pageNumber: 0,
  showAllStudents: true,
  showFilters: false,
  showMenuBar: false,
  store: Ember.inject.service(),
  studentsRecords: null,
  totalPages: 0,
  totalStudents: 0,

  actions: {

    firstPage() {
      this.get('changeOffset')(0, false);
    },

    lastPage() {
      this.get('changeOffset')((this.get('totalPages') - 1) * this.get('limit'), false);
    },

    nextPage() {
      this.get('changeOffset')(this.get('limit'), true);
    },

    previousPage() {
      this.get('changeOffset')(-this.get('limit'), true);
    },

    selectStudent(student, index) {
      this.set('showAllStudents', false);
      this.set('showMenuBar', true);
      this.set('currentIndex', index);
      this.set('currentStudent', student);
    },

    toggleShowFilters() {
      this.set('showFilters', !this.get('showFilters'));
    },

    applyFilters() {
      let self = this;
      this.set('filter', {studentNumber: Ember.$('#studentNumber').val(), firstName: Ember.$('#firstName').val(), lastName: Ember.$('#lastName').val()});

      this.get('store').query('student', {
        number: self.get('filter').studentNumber,
        firstName: self.get('filter').firstName,
        lastName: self.get('filter').lastName,
        limit: self.get('limit'),
        offset: 0
      }).then(function (records) {
        self.set('offset', 0);
        self.set('studentsRecords', records);
        self.set('totalStudents', records.get('meta').total);
      });
    },

    clearFilters() {
      let self = this;
      this.set('filter', {studentNumber: "", firstName: "", lastName: ""});
      
      Ember.$('#studentNumber').val("");
      Ember.$('#firstName').val("");
      Ember.$('#lastName').val("");

      this.get('store').query('student', {
        number: self.get('filter').studentNumber,
        firstName: self.get('filter').firstName,
        lastName: self.get('filter').lastName,
        limit: self.get('limit'),
        offset: 0
      }).then(function (records) {
        self.set('offset', 0);
        self.set('studentsRecords', records);
        self.set('totalStudents', records.get('meta').total);
      });
    }
  },

  init() {
    this._super(...arguments);
  }
});
