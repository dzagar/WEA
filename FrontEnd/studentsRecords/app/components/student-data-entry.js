import Ember from 'ember';

export default Ember.Component.extend({

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
  newASName:"",
  newASObj: null,
  newHighSchoolName:"",
  newHighSchoolObj: null,
  newScholarshipName:"",
  newScholarshipObj: null,
  offset: null,
  pageNumber: Ember.computed('offset', 'pageSize', function() {
      let num = this.get('offset')/this.get('pageSize')+1;
      return num;
  }),
  pageSize: null,
  residencyModel: null,
  selectedDate: null,
  selectedGender: null,
  selectedResidency: null,
  showAddStudent: false,
  showAllStudents: false,
  showAdvancedStandingDeleteConfirmation: false,
  showDeleteConfirmation: false,
  showHighSchoolDeleteConfirmation: false,
  showScholarshipDeleteConfirmation: false,
  showFindStudent: false,
  showHelp: false,
  showDataEntry: false,
  store: Ember.inject.service(),
  studentAdvancedStandings: null,
  studentPhoto: null,
  studentsRecords: null,
  studentScholarhips: null,
  totalStudents: 0,
  totalPages: Ember.computed('totalStudents', 'pageSize', function() {
      let ttl = Math.ceil(this.get('totalStudents')/this.get('pageSize'));
      return ttl;
  }),
  

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
  },

  setCurrentStudent: function (index) {
    var student = this.get('studentsRecords').objectAt(index);
    if (student != null)
      this.set('currentStudent', student);
  },

  showStudentData: function (student) {
    if (!this.get('showAllStudents')) { //Disables showStudentData while the all students window is showing to speed things up
      this.set("showHelp", false);
      this.set("showFindStudent",false);
      if (student != null) {
        this.set('studentPhoto', this.get('currentStudent').get('photo'));
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
        //loads student scholarships
        var scholarshipStudent = this.get('currentStudent.id');
        this.get('store').query('scholarship', {student : scholarshipStudent}).then(function(scholarships){
          self.set('studentScholarhips', scholarships);
        });
        this.get('store').query('advancedStanding', {student : scholarshipStudent}).then(function(advancedStandings){
          self.set('studentAdvancedStandings', advancedStandings);
        });
      }
    } //end if(!showAllStudents)
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
      var updatedStudent = this.get('currentStudent');
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency')); 
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      //updatedStudent.set('gender', this.get('selectedGender'));
      updatedStudent.set('DOB', this.get('selectedDate'));
      updatedStudent.set('gender', gen);
      updatedStudent.set('resInfo', res);
      updatedStudent.save().then(() => {
        //     this.set('isStudentFormEditing', false);
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
      this.set('showDeleteConfirmation', false);
    },

    selectGender (gender){
      this.set('selectedGender', gender);
    },

    selectResidency (residency){
      console.log(residency);
      this.set('selectedResidency', residency);
    },

    assignDate (date){
      this.set('selectedDate', date);
    },
    undoSave(){
      //Reset all text fields (number, first name, last name)
      this.get('currentStudent').rollbackAttributes();
      //Reset date
      var date = this.get('currentStudent').get('DOB');
      var datestring = date.toISOString().substring(0, 10);
      this.set('selectedDate', datestring);
      
      //Reset gender
      var gender = this.get('currentStudent').get('gender.id');
      Ember.$("#ddlGender").val(gender);
      this.set('selectedGender', this.get('currentStudent').get('gender'));

      //Reset residency
      var resInfo = this.get('currentStudent').get('resInfo').get('id');
      Ember.$("#ddlResidency").val(resInfo);
      this.set('selectedResidency', this.get('currentStudent').get('resInfo'));

    },
    findStudent(){
      this.set("showAllStudents", false);
      this.set("showDeleteConfirmation", false);
      this.set("showHelp", false);
      this.set("showFindStudent",true);
      // var self = this;
      // this.get('store').query('student', {
      //   firstName: "a",
      //   lastName: "a"
      // }).then(function (records) {
      //   console.log("did things");
      //   self.set('studentsRecords', records);
      //   self.set('firstIndex', records.indexOf(records.get("firstObject")));
      //   self.set('lastIndex', records.indexOf(records.get("lastObject")));
      //   // Show first student data
      //   self.set('currentIndex', self.get('firstIndex'));
      //   self.set('offset', 0);
    //});


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
    selectStudent(student) {
      this.set('currentStudent', student);
      this.set('showDataEntry', true);
    },
    helpInfo(){
      this.set("showAllStudents", false);
      this.set("showHelp", true);
      this.set("showFindStudent",false);
      this.set("showDeleteConfirmation", false);
    },
    toggleDataEntry() {
      this.set("showDataEntry", !this.get("showDataEntry"));
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
        if (this.get('newASName').trim() != "")
        {
            this.set('newASObj', this.get('store').createRecord('advancedStandings', {
                name: this.get('newASName').trim()
            }));
            this.get('newASObj').save();
            this.set('newASName', "");
        }
    },

    deleteAS(AdvancedStanding)
    {
      this.set('currentAdvancedStanding',AdvancedStanding);
      this.set('showAdvancedStandingDeleteConfirmation', false);
      this.set('showHighSchoolDeleteConfirmation', false); 
      this.set('showScholarshipDeleteConfirmation',true);
      this.set('showDeleteConfirmation',false);
    },

    saveAS(AdvancedStanding)
    {
      AdvancedStanding.save();
    },

    addScholarship()
    {
      if (this.get('newScholarshipName').trim() != "")
        {
            this.set('newScholarshipObj', this.get('store').createRecord('scholarship', {
                name: this.get('newScholarshipName').trim()
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
    }
  }
});
