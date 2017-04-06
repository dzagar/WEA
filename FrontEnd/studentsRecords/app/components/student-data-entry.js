import Ember from 'ember';
import UndoManager from 'npm:undo-manager';

export default Ember.Component.extend({

  advancedStandingModel: null,
  currentAdvancedStanding: null,
  currentScholarship: null,
  currentStudent: null,
  currentIndex: null,
  courseCodeModel: null,
  filter: {studentNumber: "", firstName: "", lastName: ""},
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
  newCourseCodeID: null,
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
  selectedNewTerm: null,
  showMenuBar: false,
  showAddStudent: false,
  showAllStudents: true,
  showAdvancedStandingDeleteConfirmation: false,
  showDeleteConfirmation: false,
  studentUnselectedTermCodes: null,
  showScholarshipDeleteConfirmation: false,
  showFindStudent: false,
  store: Ember.inject.service(),
  studentAdvancedStandings: null,
  studentDataMessage: "Loading Student Data...",
  //studentCourses: [],
  studentSubjects: [],
  studentSchools: [],
  studentGrades: null,
  studentNotLoaded: false,
  studentPhoto: null,
  studentsRecords: null,
  studentScholarhips: null,
  tab: null,
  termIndex: 0,
  totalStudents: 0,
  totalPages: Ember.computed('totalStudents', 'pageSize', function() {
      let ttl = Math.ceil(this.get('totalStudents')/this.get('pageSize'));
      return ttl;
  }),
  undoManager: null,
  

  studentModel: Ember.observer('offset', function () {
    var self = this;
    this.set('studentDataMessage', "Loading Student Data...");
    //console.log('offset observer');
    this.get('store').query('student', {
      number: self.get('filter').studentNumber,
      firstName: self.get('filter').firstName,
      lastName: self.get('filter').lastName,
      limit: self.get('limit'),
      flagged: self.get('filter').flagged,
      offset: self.get('offset')
    }).then(function (records) {
      self.set('totalStudents', records.get('meta').total);
      self.set('studentsRecords', records);
      if (self.get('studentsRecords.length') === 0)
        self.set('studentDataMessage', "No Student Data Found");
      else
        self.set('studentDataMessage', "Student Data Found");

      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
      if (self.get('movingBackword') != null){
        if (self.get('movingBackword')) {
          self.set('currentIndex', records.indexOf(records.get("lastObject")));
          //self.setCurrentStudent(self.get('currentIndex'));
        } else {
          self.set('currentIndex', records.indexOf(records.get("firstObject")));
          //self.setCurrentStudent(self.get('currentIndex'));
        }
      }
    }, function (reason) {
      //console.log("Query to student records failed");
      self.set('studentDataMessage', "No Student Data Found");
    });
  }),

  currentIndexChange: Ember.observer('currentIndex', function () {
    this.get('undoManager').clear();
    //console.log('current index change');
    this.setCurrentStudent(this.get('currentIndex'));
  }),

  fetchStudent: Ember.observer('currentStudent', function () {
    this.set('studentNotLoaded', true);
    //console.log('fetch student');
    this.set('studentDataMessage', "Loading Student...");
    this.showStudentData(this.get('currentStudent'));
    var self = this;
    this.get('store').query('term-code', {
      student: self.get('currentStudent').get('id'),
      nonTerms: true
    }).then(function(nonTerms){
      self.set('studentUnselectedTermCodes', nonTerms);
      //console.log(self.get('studentUnselectedTermCodes'));
      self.set('studentNotLoaded', false);
    });
    self.set('termIndex', null);
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
    this.get('store').findAll('course-code').then(function(records){
      self.set('courseCodeModel', records);
    });

    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    this.set('studentDataMessage', "Loading Student Data...");
    var self = this;
    this.get('store').query('student', {
      number: self.get('filter').studentNumber,
      firstName: self.get('filter').firstName,
      lastName: self.get('filter').lastName,
      limit: self.get('limit'),
      offset: self.get('offset'),
      flagged: self.get('filter').flagged
    }).then(function (records) {
      self.set('totalStudents', records.get("meta").total);
      self.set('studentsRecords', records);
      if (self.get('studentsRecords.length') === 0)
        self.set('studentDataMessage', "No Student Data Found");
      else
        self.set('studentDataMessage', "Student Data Found");
      
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
      self.set('movingBackword', null);
      // Show first student data
      //self.set('currentIndex', self.get('firstIndex'));
    }, function (reason) {
      //console.log("Query to student records failed");
      self.set('studentDataMessage', "No Student Data Found");
    });

    //Set up UNDO
    this.set('undoManager', new UndoManager());
  },
  setCurrentStudent: function (index) {
    var student = this.get('studentsRecords').objectAt(index);
    //console.log('setting current student. student exists? ' + (student != null))
    if (student != null){
      this.set('currentStudent', student);
    }

  },

  showStudentData: function (student) {
    this.set('termIndex', 0);
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
          //console.log(Ember.$("#ddlGender").val());
          //console.log(this.get('store').peekRecord('gender', Ember.$("#ddlGender").val()));
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
          //console.log(grades.content.length);
          self.set('studentGrades', grades);
          for (var i = 0; i < grades.content.length; i++){
            
            var gradeSource = grades.objectAt(i).get('source');
            var gradeSourceID = gradeSource.get('id');

            // self.get('store').queryRecord('high-school-course', {grades : grades.objectAt(i).id}).then(function(course){
            //   ////console.log(course);
            //   self.get('studentCourses').push(course);
            // });
           
            self.get('store').queryRecord('high-school-subject', {course : gradeSourceID}).then(function(subject){
              self.get('studentSubjects').push(subject.name);
            });
            self.get('store').queryRecord('high-school', {course: gradeSourceID}).then(function(school){
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
    var self = this;
    if (!this.get('studentNotLoaded')&&this.get('tab')!=null){
      Ember.$(".ui.tab").removeClass("active");
      Ember.$(".ui.tab[data-tab=\"" + this.get('tab') + "\"]").addClass("active");
    }    
    var previous = $('.ui.tab.segment.active');
    Ember.$('.ui .menu .item').tab({
      'onLoad': function(tab){
        if (Ember.$(".ui.tab[data-tab='basics']").hasClass("active")){
          Ember.$('.item.save').removeClass('disabled');
          Ember.$('.item.undo').removeClass('disabled');
        } else {
          Ember.$('.item.save').addClass('disabled');
          Ember.$('.item.undo').addClass('disabled');
        }
      },
      'onVisible': function(tab){
        self.set('tab',tab);
        var current = $('.ui.tab.segment.active');
        // hide the current and show the previous, so that we can animate them
        previous.show();
        current.hide();

        // hide the previous tab - once this is done, we can show the new one
        previous.transition({
            animation: 'fade down',
            onComplete: function () {
                // finally, show the new tab again
                current.transition('fade up');
            }
        });
        // remember the current tab for next change
        previous = current;
      },
    });
  },

  actions: {
    //Calls the change offset function
    //The action is necessary for passing to all-students
    changeOffset(offsetDelta, relative) {
      this.changeOffset(offsetDelta, relative)
    },
    addNewTermToStudent(newTerm){
      var self = this;
      this.get('studentUnselectedTermCodes').removeObject(self.get('store').peekRecord('term-code', newTerm));
      var newtermAddingToStudent = this.get('store').createRecord('term', {
        termAVG: 0,
        termUnitsPassed: 0,
        termUnitsTotal: 0
      });
      newtermAddingToStudent.set('student', this.get('currentStudent'));
      newtermAddingToStudent.set('termCode', self.get('store').peekRecord('term-code', newTerm));
      newtermAddingToStudent.save();

    },
    deleteGrade(gradeOBJ){
      gradeOBJ.destroyRecord();
    },
    addNewGrade(){
      var self = this;
      var newGrade = this.get('store').createRecord('grade', {
        mark: this.get('newCourseGradeInput'),
        note: this.get('newCourseGradeNote')
      });
      this.get('store').find('course-code', self.get('newCourseCodeID')).then(function(courseCodeOBJ){
        self.get('store').queryRecord('term', {
          student: self.get('currentStudent').get('id'),
          termCode: self.get('termIndex')
        }).then(function(termOBJ){
          newGrade.set('courseCode', courseCodeOBJ);
          newGrade.set('term', termOBJ);
          newGrade.save().then(function(){
            self.set('newCourseGradeInput', "");
            self.set('newCourseGradeNote', "");
            self.set('newCourseCodeID', null);
          });
        });
      });
    },
    saveStudent () {
      //this doesnt work
      this.get('store').query('student', {
        _id: this.get('currentStudent.id')
      }).then((student)=>{
        //console.log(student);
        var self = this;
        this.get('undoManager').add({
          undo: function(){
            // THIS DOES NOT WORK I DONT THINK
            //console.log("undo save"); 
            student.save();
          }
        });
        var updatedStudent = this.get('currentStudent');
        var res = this.get('store').peekRecord('residency', this.get('selectedResidency')); 
        //console.log(res);
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
        this.set('movingBackword', null);
        this.set('currentIndex', this.get('currentIndex') + 1);
      }
      else {
        this.changeOffset(this.get('pageSize'), true);
      }
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('movingBackword', null);
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
      //console.log("on field change");
      this.set('noFieldChange', false);
    },

    onFocusOut(){
        //console.log("focus out called");
        if (this.get('noFieldChange')){   //if a field hasnt been changed
          //console.log("undid field");
          this.get('undoManager').undo();
        } else {
          this.set("noFieldChange", true);
        }
        if (!this.get('undoManager').hasUndo()){   //if there are no undos left on stack
          //console.log("no undos left");
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
            this.get('currentStudent').reload();
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
            this.get('currentStudent').reload();
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

    switchPage(pageNum)
    {
      this.changeOffset((pageNum - 1) * this.get('pageSize'), false);
    },

    selectTerm(index)
    {
      this.set('termIndex', Number(index));
      //console.log("new index = " + this.get('termIndex'));
    },
    saveGrade(grade)
    {
        grade.save();
        //console.log('save grade');
    },
    displayProgram(selectedProgram){  
        if (Ember.$("#progInfo" + selectedProgram).is(':visible')){
          Ember.$(".toggleDisplay" + selectedProgram).text(" (click to show program's plans)");
        } else {
          Ember.$(".toggleDisplay" + selectedProgram).text(" (click to hide program's plans)");
        }           
        Ember.$("#progInfo" + selectedProgram).toggle("fast");
    },
    savePlan(savedPlan){
      savedPlan.save();      
    },
    deletePlan(deletedPlan){
      var self = this;
      var programID = deletedPlan.get('programRecord.id');
      deletedPlan.destroyRecord().then(function(){
        self.get('store').find('program-record', programID);
      });   
    },
    addNewPlan(planProgram){
      var self = this;
      var newPlan = this.get('store').createRecord('plan-code', {
        name: self.get('newPlanName')
      });
      newPlan.set('programRecord', planProgram);
      newPlan.save().then(function(){
        self.set('newPlanName', "")
      });

    },
    saveProgram(savedProgram){
      savedProgram.save();      
    },
    deleteProgram(deletedProgram){
      var self = this;
      var termID = deletedProgram.get('term.id');
      deletedProgram.destroyRecord().then(function(){
        self.get('store').find('term', termID);
      });
    },
    addNewProgram(termID){
      var self = this;
      var newProgram = this.get('store').createRecord('program-record', {
        name: self.get('newProgramName'),
        level: self.get('newProgramLevel'),
        load: self.get('newProgramLoad')
      });
      
      newProgram.set('term', this.get('store').peekRecord('term', termID));
      newProgram.save().then(function(){
        self.set("newProgramName", "");
      });
    }
  }
});
