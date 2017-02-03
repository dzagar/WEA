import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  showFindStudent: false,
  showDeleteConfirmation: false,
  showAddStudent: false,
  showHelp: false,
  residencyModel: null,
  genderModel: null,
  studentScholarhips: null,
  selectedResidency: null,
  selectedGender: null,
  selectedDate: null,
  studentsRecords: null,
  currentStudent: null,
  currentIndex: null,
  firstIndex: 0,
  lastIndex: 0,
  studentPhoto: null,
  limit: null,
  offset: null,
  pageSize: null,
  movingBackword: false,

  studentModel: Ember.observer('offset', function () {
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));
      if (self.get('movingBackword')) {
        self.set('currentIndex', records.indexOf(records.get("lastObject")));
      } else {
        self.set('currentIndex', records.indexOf(records.get("firstObject")));
      }
    });
  }),

  fetchStudent: Ember.observer('currentIndex', function () {
    this.showStudentData(this.get('currentIndex'));

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
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));

      // Show first student data
      self.set('currentIndex', self.get('firstIndex'));
    });
  },

  showStudentData: function (index) {
    this.set("showHelp", false);
    this.set("showFindStudent",false);
    var record = this.get('studentsRecords').objectAt(index);
    if (record != null) {
      this.set('currentStudent',record );
      this.set('studentPhoto', this.get('currentStudent').get('photo'));
      var date = this.get('currentStudent').get('DOB');
      var datestring = date.substring(0, 10);
      this.set('selectedDate', datestring);
      //this.set('selectedGender', this.get('currentStudent').get('gender'));
      if (this.get('currentStudent.resInfo.id') == null)
      {
        this.get('currentStudent').set('resInfo', this.get('store').peekRecord('residency', Ember.$("#ddlResidency").val()));
      }
      if(this.get('currentStudent.gender.id') == null || this.get('currentStudent.gender.id') == 1 || this.get('currentStudent.gender.id') == 2)
      {
        this.get('currentStudent').set('gender',this.get('store').peekRecord('gender'), Ember.$("#ddlGender").val());
        this.get('currentStudent').save();
      }
      this.set('selectedResidency', this.get('currentStudent.resInfo.id'));
      this.set('selectGender', this.get('currentStudent.gender.id'));

      //loads student scholarships
      this.set('studentScholarships', this.get('currentStudent.scholarships'));

    }
    else
    {
       this.set('offset',0);
    }
  },

  didRender() {
    Ember.$('.menu .item').tab();
  },


  actions: {
    saveStudent () {
      var updatedStudent = this.get('currentStudent');
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency')); 
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      //updatedStudent.set('gender', this.get('selectedGender'));
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
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
        //     console.log(JSON.stringify(this.get('currentStudent')));
      }
      else {
        this.set('offset', this.get('offset') + this.get('pageSize'));
      }
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else if (this.get('offset') > 0) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
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
    helpInfo(){
      this.set("showAllStudents", false);
      this.set("showHelp", true);
      this.set("showFindStudent",false);
      this.set("showDeleteConfirmation", false);
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
    }
  }
});
