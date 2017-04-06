import Ember from 'ember';

export default Ember.Component.extend({
    
    courseGroup: null,
    coursesModel: null,
    isLoaded: false,
    selectedCourses: [],
	showWindow: null,
    donePopulating: false,
	store: Ember.inject.service(),

    init()
    {
        this._super(...arguments);
        var self=this;
        this.set('selectedCourses', []);
        this.get('store').findAll('course-code').then(function (records) {
            self.set('coursesModel', records);
            self.get('courseGroup').get('courseCodes').forEach(function(courseCode){
                //console.log(courseCode.get('id'));
                self.get('selectedCourses').push(courseCode.get('id'));
            });
            self.set('donePopulating', true);
        });
        //console.log(this.get('selectedCourses'));
    },
    

	actions: {
       
        done()
        {
            var self=this;
            var currentGroup=this.get('courseGroup'); //current group is the courseGrouping object
            currentGroup.set('courseCodes', []);
            this.get('selectedCourses').forEach(function(courseID){
                currentGroup.get('courseCodes').pushObject(self.get('store').peekRecord('course-code', courseID));
            });


            currentGroup.save().then(function(){
                self.set('showWindow', false);
                Ember.$('.ui.modal').modal('hide');
                Ember.$('.ui.modal').remove();
            });
            
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
