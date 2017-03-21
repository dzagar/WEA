import Ember from 'ember';

export default Ember.Component.extend({
    
    advancedStanding: null,
    courseGroupingModel: null,
    coursesModel: null,
    groupingID: null, //set by the user when selecting manage courses in system codes
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

        this.get('store').findAll('course-grouping').then(function (courseGroup)
        {
             courseGroup.forEach(function (groups){
                 groups.get('courseCodes').forEach(function (courseCode){
                     if(courseCode.id===groupingID)
                     {
                         self.get('selectedCourses').push(groups.get('id')); //gets all the courses attached to the selected course grouping
                     }
                 });
             });
         });

    },
    

	actions: {
        selectCourses(course)
        {
            var self=this;
            var groupID=this.get('groupingID');

            this.get('store').findAll('course-grouping').then (function(groups){
                groups.forEach(function (grouping) {
                    var courseGroupings = [];
                    grouping.get('courseCodes').forEach(function(courses){
                    if(courses.id!==groupingID)
                    {
                        courseGroupings.pushObject(courses); 
                    }
                });

                grouping.set('courseCodes', courseGroupings);
                grouping.save().then(function() {
                    self.set('selectedCourses', course);
                });
                
            });
        });

        course.forEach(function(myCourse){
            console.log(myCourse);
            this.get('store').find('course-grouping', myCourse).then(function (courseGrouping) {
                this.get('store').findRecord('course-code', groupID).then(function(records){
                    courseGrouping.get('courseCodes').pushObject(records);
                    courseGrouping.save().then(function(){
                        this.get('store').query('courseGrouping',{filter: {courseCodes:groupID}}).then(function(code){
                            code.forEach(courseCodes => {
                                self.get('selectedCourses').push(grouping.get('id'));
                            });

                        });
                    });
                });

            });

        });
    },

        done()
        {
           this.set('showWindow', false);
           Ember.$('.ui.modal').modal('hide');
           Ember.$('.ui.modal').remove();
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
