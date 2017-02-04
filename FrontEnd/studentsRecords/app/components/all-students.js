import Ember from 'ember';

export default Ember.Component.extend({
  
  INDEX: null,
  limit: 10,
  notDONE: null,
  offset: 0,
  pageSize: 10,
  store: Ember.inject.service(),
  studentsModel: null,

  actions: {
    loadNext: function () {
      Ember.$('.ui.modal').modal('hide');
      this.set('offset', this.get('offset') + this.get('pageSize'));
      Ember.$('.ui.modal').modal('show');
    },

    loadPrevious: function () {
      if (this.get('offset') >= this.get('pageSize')) {
        Ember.$('.ui.modal').modal('hide');
        this.set('offset', this.get('offset') - this.get('pageSize'));
        Ember.$('.ui.modal').modal('show');
      }
    },

    getStudent: function (student) {
      var index = this.get('studentsModel').indexOf(student);
      this.set('INDEX', index);

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
