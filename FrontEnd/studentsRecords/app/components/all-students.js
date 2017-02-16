import Ember from 'ember';

export default Ember.Component.extend({
  
  INDEX: null,
  limit: 10,
  notDONE: null,
  offset: 0,
  pageSize: 10,
  store: Ember.inject.service(),
  studentsModel: null,
  totalPages: 0,
  pageNumber: 0,
  desiredOffset: 0,
  desiredIndex: 0,

  actions: {
    loadNext: function () {
      this.get('changeOffset')(this.get('pageSize'), true);
    },

    loadPrevious: function () {
      this.get('changeOffset')(this.get('pageSize'), true);
    },

    getStudent: function (student) {
      console.log('get student called');
      this.set('desiredIndex', this.get('studentsModel').indexOf(student));
      this.set('desiredOffset', this.get('offset'));
    },

    exit: function () {
      this.set('notDONE', false); //This must be set first to re-enable ShowStudentData before the index and offset change
      this.set('INDEX', this.get('desiredIndex'));
      this.set('offset', this.get('desiredOffset'));
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    }
  },

  init() {
    this._super(...arguments);
    this.set('desiredOffset', this.get('offset'));
    this.set('desiredIndex', this.get('INDEX'));
  },

  didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
