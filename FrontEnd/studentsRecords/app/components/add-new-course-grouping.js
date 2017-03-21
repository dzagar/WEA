import Ember from 'ember';

export default Ember.Component.extend({
    
    courseGroup: null,
    courseGroupingModel: null,
    coursesModel: null,
    isLoaded: false,
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

    },
    

	actions: {
       
        done()
        {
            var self=this;
            var currentGroup=this.get('courseGroup'); //current group is the courseGrouping object

            this.get('selectedCourses').forEach(function(courseID){
                currentGroup.get('courseCodes').pushObject(self.get('store').peekRecord('course-code', courseID));
            });


            currentGroup.save().then(function(){
                self.set('selectedCourses', []);
            });
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
