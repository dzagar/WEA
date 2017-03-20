import Ember from 'ember';

export default Ember.Component.extend({
    
    advancedStanding: null,
    courseGroupingModel: null,
    coursesModel: null,
    isAddGrouping: false,
    selectedCourses: [],
	showWindow: null,
	store: Ember.inject.service(),

    init()
    {
        this._super(...arguments);
        var self=this;
        this.get('store').findAll('course-code').then(function (records) {
            self.set('coursesModel', records);
        });

        this.get('store').findAll('course-grouping').then(function (records) {
            self.set('courseGroupingModel', records);
        });

        this.set('selectedCourses', []);

        // this.get('store').findAll('course-grouping').then(function (courseGroup)
        // {
        //     courseGroup.forEach(function (groups){
        //         groups.get('courseCodes').forEach(function (courseCode){
        //             if(courseCode.id==)
        //         });
        //     });
        // });
    },
    

	actions: {
        selectCourses(courses)
        {
            var self=this;
            this.get('store').createRecord('')
        },

        done()
        {
           this.set('showWindow', false);
           Ember.$('.ui.modal').modal('hide');
           Ember.$('.ui.modal').remove();
        },

        manageGrouping()
        {
            this.set('isAddGrouping', true);
        },

	},

    didRender() {
    this._super(...arguments);
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
