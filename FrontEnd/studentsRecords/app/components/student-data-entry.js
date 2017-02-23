import Ember from 'ember';
import UndoManager from 'npm:undo-manager';

export default Ember.Component.extend({

  advancedStandingModel: null,
  currentAdvancedStanding: null,
  currentHighSchool: null,
  currentScholarship: null,
  currentStudent: null,
  currentIndex: null,
  firstIndex: 0,
  genderModel: null,
  lastIndex: 0,
  limit: null,
  movingBackword: false,
  newAdvancedStandingCourse:"",
  newAdvancedStandingDescription:"",
  newAdvancedStandingFrom:"",
  newAdvancedStandingGrade:"",
  newAdvancedStandingObj: null,
  newAdvancedStandingUnits:"",
  newHighSchoolName:"",
  newHighSchoolObj: null,
  newScholarshipName:"",
  newScholarshipObj: null,
  noFieldChange: true,
  offset: null,
  pageNumber: Ember.computed('offset', 'pageSize', function() {
      let num = this.get('offset')/this.get('pageSize')+1;
      return num;
  }),
  pageSize: null,
  residencyModel: null,
  scholarshipModel: null,
  selectedDate: null,
  selectedGender: null,
  selectedResidency: null,
  showMenuBar: false,
  showAddStudent: false,
  showAllStudents: true,
  showAdvancedStandingDeleteConfirmation: false,
  showDeleteConfirmation: false,
  showHighSchoolDeleteConfirmation: false,
  showScholarshipDeleteConfirmation: false,
  showFindStudent: false,
  store: Ember.inject.service(),
  studentAdvancedStandings: null,
  //studentCourses: [],
  studentSubjects: [],
  studentSchools: [],
  studentGrades: null,
  studentPhoto: null,
  studentsRecords: null,
  studentScholarhips: null,
  totalStudents: 0,
  totalPages: Ember.computed('totalStudents', 'pageSize', function() {
      let ttl = Math.ceil(this.get('totalStudents')/this.get('pageSize'));
      return ttl;
  }),
  undoManager: null,
  

  studentModel: Ember.observer('offset', function () {
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('totalStudents', records.get('meta').total);
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
      if (self.get('movingBackword')) {
        self.set('currentIndex', records.indexOf(records.get("lastObject")));
        self.setCurrentStudent(self.get('currentIndex'));
      } else {
        self.set('currentIndex', records.indexOf(records.get("firstObject")));
        self.setCurrentStudent(self.get('currentIndex'));
      }
    });
  }),

  currentIndexChange: Ember.observer('currentIndex', function () {
    this.get('undoManager').clear();
    this.setCurrentStudent(this.get('currentIndex'));
  }),

  fetchStudent: Ember.observer('currentStudent', function () {
    this.showStudentData(this.get('currentStudent'));
  }),

  init() {
    this._super(...arguments);
    // load Residency data model
    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });

    // load Gender data model 
    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel',records);
    });

    this.get('store').findAll('scholarship').then(function (records) {
      self.set('scholarshipModel',records);
    });

    this.get('store').findAll('advanced-standing').then(function (records) {
      self.set('advancedStandingModel',records);
    });

    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('totalStudents', records.get("meta").total);
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));

      // Show first student data
      self.set('currentIndex', self.get('firstIndex'));
    });

    //Set up UNDO
    this.set('undoManager', new UndoManager());
  },
  setCurrentStudent: function (index) {
    var student = this.get('studentsRecords').objectAt(index);
    if (student != null)
      this.set('currentStudent', student);
  },

  showStudentData: function (student) {
      this.set("showHelp", false);
      this.set("showFindStudent",false);
      if (student != null) {
        if (this.get('currentStudent.photo'))
        {
          this.set('studentPhoto', this.get('currentStudent').get('photo'));
        }
        else
        {
          this.set('studentPhoto', "/assets/studentsPhotos/noImageFound.png");
        }
        var date = this.get('currentStudent').get('DOB');
        var datestring = date.substring(0, 10);
        this.set('selectedDate', datestring);
        //this.set('selectedGender', this.get('currentStudent').get('gender'));
        if (this.get('currentStudent.resInfo') == null || this.get('currentStudent.resInfo.id') == null)
        {
          this.get('currentStudent').set('resInfo', this.get('store').peekRecord('residency', Ember.$("#ddlResidency").val()));
          this.get('currentStudent').save(); 
        }
        if(this.get('currentStudent.gender') == null || this.get('currentStudent.gender.id') == null || this.get('currentStudent.gender.id') == 1 || this.get('currentStudent.gender.id') == 2)
        {
          console.log(Ember.$("#ddlGender").val());
          console.log(this.get('store').peekRecord('gender', Ember.$("#ddlGender").val()));
          this.get('currentStudent').set('gender',this.get('store').peekRecord('gender', Ember.$("#ddlGender").val()));
          this.get('currentStudent').save();
        }
        this.set('selectedResidency', this.get('currentStudent.resInfo.id'));
        this.set('selectedGender', this.get('currentStudent.gender.id'));
        
        var self = this;


        //NOTE -- THIS SHOULD WORK WITH PROPERLY SET UP DB....

        
        var studentID = this.get('currentStudent.id');
        //loads student scholarships
        this.get('store').query('scholarship', {student : studentID}).then(function(scholarships){
          self.set('studentScholarhips', scholarships);
        });
        //loads student advanced standings
        this.get('store').query('advanced-standing', {student : studentID}).then(function(advancedStandings){
          self.set('studentAdvancedStandings', advancedStandings);
        });
        //loads student high school information
        this.get('store').query('high-school-grade', {student : studentID}).then(function(grades){
          console.log(grades.content.length);
          self.set('studentGrades', grades);
          for (var i = 0; i < grades.content.length; i++){
            //console.log(grades.objectAt(i));
            // self.get('store').queryRecord('high-school-course', {grades : grades.objectAt(i).id}).then(function(course){
            //   //console.log(course);
            //   self.get('studentCourses').push(course);
            // });
            console.log(grades.objectAt(i).source);
            self.get('store').queryRecord('high-school-subject', {course : grades.objectAt(i).source}).then(function(subject){
              self.get('studentSubjects').push(subject.name);
            });
            self.get('store').queryRecord('high-school', {course: grades.objectAt(i).source}).then(function(school){
              self.get('studentSchools').push(school.name);
            });
          }
        });

      }
  },

  //Changes the offset based on offsetDelta and relative.
  //If relative is true, the offsetDelta is added to offset
  //If relative is false, the offsetDelta becomes the new offset
  //Checks and deals with the edge of the set
  changeOffset: function (offsetDelta, relative) {
    if (relative) {
      if (this.get('offset') + offsetDelta >= this.get('totalStudents'))
        this.set('offset', (this.get('totalPages') - 1) * this.get('pageSize'));
      else if (this.get('offset') + offsetDelta < 0)
        this.set('offset', 0);
      else
        this.set('offset', this.get('offset') + offsetDelta);
    } else {
      this.set('offset', offsetDelta);
    }
  },

  didRender() {
    Ember.$('.menu .item').tab();
  },

  actions: {

    //Calls the change offset function
    //The action is necessary for passing to all-students
    changeOffset(offsetDelta, relative) {
      this.changeOffset(offsetDelta, relative)
    },

    saveStudent () {
      //this doesnt work
      this.get('store').query('student', {
        _id: this.get('currentStudent.id')
      }).then((student)=>{
        console.log(student);
        var self = this;
        this.get('undoManager').add({
          undo: function(){
            // THIS DOES NOT WORK I DONT THINK
            console.log("undo save"); 
            student.save();
          }
        });
        var updatedStudent = this.get('currentStudent');
        var res = this.get('store').peekRecord('residency', this.get('selectedResidency')); 
        console.log(res);
        var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
        //updatedStudent.set('gender', this.get('selectedGender'));
        updatedStudent.set('DOB', this.get('selectedDate'));
        updatedStudent.set('gender', gen);
        updatedStudent.set('resInfo', res);
        updatedStudent.save().then(() => {
          //     this.set('isStudentFormEditing', false);
        });
      });
    },

    firstStudent() {
      this.set('currentIndex', this.get('firstIndex'));
    },

    nextStudent() {
      this.set('movingBackword' , false);
      if (this.get('currentIndex') < this.get('lastIndex')) {
        this.set('currentIndex', this.get('currentIndex') + 1);
      }
      else {
        this.changeOffset(this.get('pageSize'), true);
      }
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else {
        this.changeOffset(-this.get('pageSize'), true);
      }
    },

    lastStudent() {
      this.set('currentIndex', this.get('lastIndex'));
    },

    allStudents() {
      this.set('showAllStudents', true);
      this.set('showMenuBar', false);
      this.set('showDeleteConfirmation', false);
    },

    onFieldChange(){
      console.log("on field change");
      this.set('noFieldChange', false);
    },

    onFocusOut(){
        console.log("focus out called");
        if (this.get('noFieldChange')){   //if a field hasnt been changed
          console.log("undid field");
          this.get('undoManager').undo();
        } else {
          this.set("noFieldChange", true);
        }
        if (!this.get('undoManager').hasUndo()){   //if there are no undos left on stack
          console.log("no undos left");
          this.set('noFieldChange', true);
        }
    },

    textFocusIn(field){
      var oldVal = this.get('currentStudent').get(field);
      var self = this;
      this.get('undoManager').add({
        undo: function(){
          self.set('currentStudent.' + field, oldVal);
        }
      });
    },

    dobFocusIn(){
        var dob = this.get('currentStudent.DOB');
        var self = this;
        this.get('undoManager').add({
          undo: function(){
            self.set('currentStudent.DOB', dob);
            self.send('assignDate', dob);
          }
        });
    },

    genderFocusIn(){
      var gender = this.get('currentStudent.gender.id');
      var self = this;
      this.get('undoManager').add({
        undo: function(){
          self.set('selectedGender', gender);
          Ember.$("#ddlGender").val(gender);
        }
      });
    },

    residencyFocusIn(){
      var res = this.get('currentStudent.resInfo.id');
      var self = this;
      this.get('undoManager').add({
        undo: function(){
          self.set('selectedResidency', res);
          Ember.$('#ddlResidency').val(res);
        }
      });
    },

    selectGender (gender){
      this.send('onFieldChange');
      this.set('selectedGender', gender);
    },

    selectResidency (residency){
      this.send('onFieldChange');
      this.set('selectedResidency', residency);
    },

    assignDate (date){
      this.set('selectedDate', date);
    },
    undoSave(){
      this.get('undoManager').undo();
    },
    findStudent(){
      this.set("showAllStudents", false);
      this.set("showDeleteConfirmation", false);
      this.set("showHelp", false);
      this.set("showFindStudent",true);
    },
    deleteCurrentStudent(){
      //Spawn confirmation modal window
      this.set("showDeleteConfirmation", true);
      this.set("showAllStudents", false);
    },
    createStudent(){
      //Spawn add student modal window
      this.set("showAddStudent", true);
      this.set("showAllStudents", false);
    },
    toggleProgramInfo() {
      if ($("#programInfoTab").is(":visible"))
      {
        $("#programInfoTab").hide(200);
      }
      else
      {
        $("#programInfoTab").show(200);
        $("#advancedInfoTab").hide(200);
        $("#hsInfoTab").hide(200);
      }
    },
    toggleAdvancedInfo() {
      if ($("#advancedInfoTab").is(":visible"))
      {
        $("#advancedInfoTab").hide(200);
      }
      else
      {
        $("#programInfoTab").hide(200);
        $("#advancedInfoTab").show(200);
        $("#hsInfoTab").hide(200);
      }
    },
    toggleHSInfo() {
      if ($("#hsInfoTab").is(":visible"))
      {
        $("#hsInfoTab").hide(200);
      }
      else
      {
        $("#programInfoTab").hide(200);
        $("#advancedInfoTab").hide(200);
        $("#hsInfoTab").show(200);
      }
    },
    
    addAS()
    {
        if ((this.get('newAdvancedStandingCourse').trim() != "") && (this.get('newAdvancedStandingDescription').trim() != "") && (this.get('newAdvancedStandingUnits').trim() != "") && (this.get('newAdvancedStandingFrom').trim() != "") && (this.get('newAdvancedStandingGrade').trim() != ""))
        {
            this.set('newAdvancedStandingObj', this.get('store').createRecord('advanced-standing', {
                student: this.get('currentStudent'),
                course: this.get('newAdvancedStandingCourse').trim(),
                description: this.get('newAdvancedStandingDescription').trim(),
                grade: this.get('newAdvancedStandingGrade').trim(),
                units: this.get('newAdvancedStandingUnits').trim(),
                from: this.get('newAdvancedStandingFrom').trim()
            }));
            this.get('newAdvancedStandingObj').save();
            this.set('newAdvancedStandingCourse', "");
            this.set('newAdvancedStandingDescription',"");
            this.set('newAdvancedStandingGrade',"");
            this.set('newAdvancedStandingUnits',"");
            this.set('newAdvancedStandingFrom',"");
        }
    },

    deleteAS(advancedStanding)
    {
      this.set('currentAdvancedStanding',advancedStanding);
      this.set('showAdvancedStandingDeleteConfirmation', true);
      this.set('showHighSchoolDeleteConfirmation', false); 
      this.set('showScholarshipDeleteConfirmation',false);
      this.set('showDeleteConfirmation',false);
    },

    saveAS(advancedStanding)
    {
      advancedStanding.save();
    },

    addScholarship()
    {
      if (this.get('newScholarshipName').trim() != "")
        {
            this.set('newScholarshipObj', this.get('store').createRecord('scholarship', {
                student: this.get('currentStudent'),
                note: this.get('newScholarshipName').trim()
            }));
            this.get('newScholarshipObj').save();
            this.set('newScholarshipName', "");
        }
    },

    deleteScholarship(scholarship)
    {
      this.set('currentScholarship',scholarship);
      this.set('showAdvancedStandingDeleteConfirmation', false);
      this.set('showHighSchoolDeleteConfirmation', false); 
      this.set('showScholarshipDeleteConfirmation',true);
      this.set('showDeleteConfirmation',false);
    },

    saveScholarship(scholarship)
    {
      scholarship.save();
    },

    addHighSchool()
    {
      if (this.get('newHighSchoolName').trim() != "")
        {
            this.set('newHighSchoolObj', this.get('store').createRecord('highSchool', {
                name: this.get('newHighSchoolName').trim()
            }));
            this.get('newHighSchoolObj').save();
            this.set('newHighSchoolName', "");
        }
    },

    deleteHighSchool(highSchool)
    {
      this.set('currentHighSchool',highschool);
      this.set('showAdvancedStandingDeleteConfirmation', false);
      this.set('showHighSchoolDeleteConfirmation', true); 
      this.set('showScholarshipDeleteConfirmation',false);
      this.set('showDeleteConfirmation',false);
    },

    saveHighSchool(highSchool)
    {
      highSchool.save();
    },

    switchPage(pageNum)
    {
      this.changeOffset((pageNum - 1) * this.get('pageSize'), false);
    },

    selectTerm(index)
    {
      console.log('select term ' + index);
    }
  }
});
