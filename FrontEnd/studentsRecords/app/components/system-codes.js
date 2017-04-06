import Ember from 'ember';

export default Ember.Component.extend({
    
    courseArray: [],
    courseCodeOffset: null,
    courseCodePageSize: null,
    courseCodeRecords: null,
    courseGroupingModel: null,
    courseGroupingOutput: "",
    currentCourseCode: null,
    currentCourseGrouping: null,
    currentGender: null,
    currentHighSchool: null,
    currentHighSchoolSubject: null,
    currentResidency: null,
    currentTermCode: null,
    departmentModel: null,
    facultyModel: null,
    genderModel: null,
    genderOutput: "",
    highSchoolModel: null,
    highSchoolOffset: null,
    highSchoolOutput: "",
    highSchoolPageSize: null,
    highSchoolRecords: null,
    highSchoolSubjectModel: null,
    highSchoolSubjectOffset: null,
    highSchoolSubjectPageSize: null,
    limit: null,
    newCourseCodeCourseLetter: "",
    newCourseCodeCourseNumber: "",
    newCourseCodeName: "",
    newCourseCodeUnit: "",
    newCourseCodeObj: null,
    newCourseGroupingName: "",
    newCourseGroupingObj: null,
    newGenderName: "",
    newGenderObj: null,
    newHighSchoolName: "",
    newHighSchoolObj: null,
    newHighSchoolSubjectName: "",
    newHighSchoolSubjectDescriptionName: "",
    newHighSchoolSubjectObj: null,
    newResidencyName: "",
    newResidencyObj: null,
    newTermCodeName: "",
    newTermCodeObj: null,
    programAdminsModel: null,
    residencyModel: null,
    residencyOutput: "",
    showAddCoursesModal: false,
    showCourseCodeDeleteConfirmation: false,
    showDeleteCourseGroupingConfirmation: false,
    showDeleteHighSchoolSubjectConfirmation: false,
    showDeleteGenderConfirmation: false,
    showDeleteHighSchoolConfirmation: false,
    showDeleteResidencyConfirmation: false,
    showDeleteTermCodeConfirmation: false,
    termCodeModel: null,
    termCodeOffset: null,
    termCodeOutput: "",
    termCodePageSize: null,
    termCodeRecords: null,
    totalCourseCodes: null,
    totalHighSchools: null,
    totalHighSchoolSubjects:  null,
    totalTermCodes: null,
    
    
    courseCodePageNumber: Ember.computed('courseCodeOffset', 'courseCodePageSize', function() {
    let num = this.get('courseCodeOffset')/this.get('courseCodePageSize')+1;
    return num;
    }),

    highSchoolPageNumber: Ember.computed('highSchoolOffset', 'highSchoolPageSize', function() {
    let num = this.get('highSchoolOffset')/this.get('highSchoolPageSize')+1;
    return num;
    }),

    highSchoolSubjectPageNumber: Ember.computed('highSchoolSubjectOffset', 'highSchoolSubjectPageSize', function () {
    let num = this.get('highSchoolSubjectOffset')/this.get('highSchoolSubjectPageSize')+1;
    return num;
    }),

    termCodePageNumber: Ember.computed('termCodeOffset', 'termCodePageSize', function() {
    let num = this.get('termCodeOffset')/this.get('termCodePageSize')+1;
    return num;
    }),

    totalCourseCodePages: Ember.computed('totalCourseCodes', 'courseCodePageSize', function() {
    let ttl = Math.ceil(this.get('totalCourseCodes')/this.get('courseCodePageSize'));
    return ttl; 
    }),

    totalHighSchoolPages: Ember.computed('totalHighSchools', 'highSchoolPageSize', function() {
    let ttl = Math.ceil(this.get('totalHighSchools')/this.get('highSchoolPageSize'));
    return ttl;
    }),

    totalHighSchoolSubjectPages: Ember.computed('totalHighSchoolSubjects', 'highSchoolSubjectPageSize', function () {
    let ttl = Math.ceil(this.get('totalHighSchoolSubjects')/this.get('highSchoolSubjectPageSize'));
    return ttl;
    }),

    totalTermCodePages: Ember.computed('totalTermCodes','termCodePageSize', function() {
    let ttl = Math.ceil(this.get('totalTermCodes')/this.get('termCodePageSize'));
    return ttl;
    }),

    store: Ember.inject.service(),

    setCourseGroupingOutput: function(newOutput) {
        this.set('courseGroupingOutput', newOutput);
    },

    setGenderOutput: function(newOutput) {
        this.set('genderOutput',newOutput);
    },

    setHighSchoolOutput: function(newOutput) {
        this.set('highSchoolOutput',newOutput);
    },

    setHighSchoolSubjectOutput: function(newOutput) {
        this.set('highSchoolSubjectOutput', newOutput);
    },

    setResidencyOutput: function(newOutput) {
		this.set('residencyOutput', newOutput);	
	},

    setTermCodeOutput: function(newOutput) {
        this.set('termCodeOutput', newOutput);
    },

     checkUniqueCourseInfo: function (sourceArray, newName, newDescription, newSource, newLevel, newUnit) {
        for (var i = 0; i < sourceArray.length; i++)
	    {
		    if (sourceArray[i] && sourceArray[i].name === newName && sourceArray[i].description === newDescription && sourceArray[i].source === newSource && sourceArray[i].level === newLevel && sourceArray[i].unit === newUnit)
		    {
			    return true;
		    }
	    }
	        return false;
    },

    init() {
        
        this._super(...arguments);
        var self = this;
        this.set('limit', 10);
        this.set('termCodeOffset', 0);
        this.set('courseCodeOffset', 0);
        this.set('highSchoolOffset', 0);
        this.set('highSchoolSubjectOffset', 0);
        this.set('termCodePageSize', 10);
        this.set('courseCodePageSize', 10);
        this.set('highSchoolPageSize', 10);
        this.set('highSchoolSubjectPageSize', 10);

        this.send('loadGenders');
        
        this.set('currentCourseCode', null);
        this.set('currentGender', null);
        this.set('currentResidency', null);
        this.set('currentHighSchool', null);
        this.set('currentHighSchoolSubject', null);
        this.set('currentTermCode', null);
        this.set('currentCourseGrouping', null);
        
    },

    courseCodeModel: Ember.observer('courseCodeOffset', function () {
        this.set('courseCodeRecords', null);
      var self = this;
      this.get('store').query('course-code', {
        limit: self.get('limit'),
        offset: self.get('courseCodeOffset')
      }).then(function (records) {
        self.set('totalCourseCodes', records.get('meta').total);
        self.set('courseCodeRecords', records);
      });
    }),

    termCodeModel: Ember.observer('termCodeOffset', function () {
        this.set('termCodeRecords', null);
      var self = this;
      this.get('store').query('term-code', {
        limit: self.get('limit'),
        offset: self.get('termCodeOffset')
      }).then(function (records) {
        self.set('totalTermCodes', records.get('meta').total);
        self.set('termCodeRecords', records);
      });
    }),

    highSchoolModel: Ember.observer('highSchoolOffset', function () {
        this.set('highSchoolRecords', null);
        var self=this;
        this.get('store').query('high-school', {
            limit: self.get('limit'),
            offset: self.get('highSchoolOffset')
        }).then(function (records) {
            self.set('totalHighSchools', records.get('meta').total);
            self.set('highSchoolRecords', records);
        });
    }),

    highSchoolSubjectModel: Ember.observer('highSchoolSubjectOffset', function () {
        this.set('highSchoolSubjectRecords', null);
        var self=this;
        this.get('store').query('high-school-subject', {
            limit: self.get('limit'),
            offset: self.get('highSchoolSubjectOffset')
        }).then(function(records){
            self.set('totalHighSchoolSubjects', records.get('meta').total);
            self.set('highSchoolSubjectRecords', records);
        });
    }),
    
    didRender() {
        var self = this;
        var previous = $('.ui.tab.segment.active');
        Ember.$('.menu .item').tab({
            'onVisible': function(tab){
                self.send('load'+tab);
                var current = $('.ui.tab.segment.active');
                // hide the current and show the previous, so that we can animate them
                previous.show();
                current.hide();

                // hide the previous tab - once this is done, we can show the new one
                previous.transition({
                    animation: 'fade left',
                    onComplete: function () {
                        // finally, show the new tab again
                        current.transition('fade right');
                    }
                });
                // remember the current tab for next change
                previous = current;
            }
        });
        Ember.$('.ui.menu').find('.item').tab('change tab', 'second');
    },

    //Changes the offset based on offsetDelta and relative.
    //If relative is true, the offsetDelta is added to offset
    //If relative is false, the offsetDelta becomes the new offset
    //Checks and deals with the edge of the set
    changeCourseCodeOffset: function (offsetDelta, relative) {
      if (relative) {
        if (this.get('courseCodeOffset') + offsetDelta >= this.get('totalCourseCodes'))
          this.set('courseCodeOffset', (this.get('totalCourseCodePages') - 1) * this.get('courseCodePageSize'));
        else if (this.get('courseCodeOffset') + offsetDelta < 0)
          this.set('courseCodeOffset', 0);
        else
          this.set('courseCodeOffset', this.get('courseCodeOffset') + offsetDelta);
      } else {
        this.set('courseCodeOffset', offsetDelta);
      }
    },

    changeHighSchoolOffset: function (offsetDelta, relative) {
        if (relative) {
        if (this.get('highSchoolOffset') + offsetDelta >= this.get('totalHighSchools'))
          this.set('highSchoolOffset', (this.get('totalHighSchools') - 1) * this.get('highSchoolPageSize'));
        else if (this.get('highSchoolOffset') + offsetDelta < 0)
          this.set('highSchoolOffset', 0);
        else
          this.set('highSchoolOffset', this.get('highSchoolOffset') + offsetDelta);
      } else {
        this.set('highSchoolOffset', offsetDelta);
      }
    },

    changeHighSchoolSubjectOffset: function (offsetDelta, relative) {
        if (relative) {
        if (this.get('highSchoolSubjectOffset') + offsetDelta >= this.get('totalHighSchoolSubjects'))
          this.set('highSchoolSubjectOffset', (this.get('totalHighSchoolSubjects') - 1) * this.get('highSchoolSubjectPageSize'));
        else if (this.get('highSchoolSubjectOffset') + offsetDelta < 0)
          this.set('highSchoolSubjectOffset', 0);
        else
          this.set('highSchoolSubjectOffset', this.get('highSchoolSubjectOffset') + offsetDelta);
      } else {
        this.set('highSchoolSubjectOffset', offsetDelta);
      }
    },

    changeTermCodeOffset: function (offsetDelta, relative) {
        if (relative) {
        if (this.get('termCodeOffset') + offsetDelta >= this.get('totalTermCodes'))
          this.set('termCodeOffset', (this.get('totalTermCodePages') - 1) * this.get('termCodePageSize'));
        else if (this.get('termCodeOffset') + offsetDelta < 0)
          this.set('termCodeOffset', 0);
        else
          this.set('termCodeOffset', this.get('termCodeOffset') + offsetDelta);
      } else {
        this.set('termCodeOffset', offsetDelta);
      }

    },

    actions:
    {
        loadGenders(){
            if ((this.get('genderModel') == null) || (this.get('genderModel').length <= 0)){
                var self = this;
                // load Gender data model 
                this.get('store').findAll('gender').then(function (records) {
                    self.set('genderModel',records);
                });
            }
        },
        addGender()
        {
            var genderArray=this.get('genderModel');
            var genderName=this.get('newGenderName');
            var isGenderCreated=true;

            for(var i=0;i<genderArray.content.length;i++)
            {
                if(genderName.toUpperCase()==genderArray.content[i]._data.name.toUpperCase())
                {
                    this.setGenderOutput("The gender entered is already created! Please enter a new gender name!");
                    isGenderCreated=false;
                }
            }
            
            if(isGenderCreated)
            {
                this.setGenderOutput("");
                if (this.get('newGenderName').trim() != "")
                {
                    this.set('newGenderObj', this.get('store').createRecord('gender', {
                     name: this.get('newGenderName').trim()
                    }));
                    this.get('newGenderObj').save();
                    this.set('newGenderName', "");
                }
            }
        },

        saveGender(gender)
        {
            gender.save();
        },

        deleteGender(gender)
        {
            this.set('currentGender', gender);
            this.set('showDeleteGenderConfirmation', true);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },
        loadResidencies(){
            if ((this.get('residencyModel') == null) || (this.get('residencyModel').length <= 0)){
                var self = this;
                // load Residency data model
                this.get('store').findAll('residency').then(function (records) {
                    self.set('residencyModel', records);
                });
            }
        },
        addResidency()
        {   
            var residencyArray=this.get('residencyModel');
            var residencyName=this.get('newResidencyName');
            var isResidencyCreated=true;

             for(var i=0;i<residencyArray.content.length;i++)
            {
                if(residencyName.toUpperCase()==residencyArray.content[i]._data.name.toUpperCase())
                {
                    this.setResidencyOutput("The residency entered is already created! Please enter a new residency name!");
                    isResidencyCreated=false;
                }
            }

            if(isResidencyCreated)
            {
                this.setResidencyOutput("");
                if (this.get('newResidencyName').trim() != "")
                {
                    this.set('newResidencyObj',this.get('store').createRecord('residency',{
                        name: this.get('newResidencyName').trim()
                    }));
                    this.get('newResidencyObj').save();
                    this.set('newResidencyName',"");
                }
            }
        },

        saveResidency(residency)
        {
            residency.save();
        },

        deleteResidency(residency)
        {
            this.set('currentResidency',residency);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', true);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        loadCourseCodes(){
            if ((this.get('courseCodeRecords') == null) || (this.get('courseCodeRecords').length <= 0)){
                var self = this;
                 this.get('store').query('course-code', {
                    limit: self.get('limit'),
                    offset: self.get('courseCodeOffset')
                }).then(function(records){
                    self.set('totalCourseCodes', records.get('meta').total);
                    self.set('courseCodeRecords', records);
                });
            }
        },

        addCourseCode()
        {
            
            if((this.get('newCourseCodeName').trim()!="") && (this.get('newCourseCodeCourseLetter').trim()!="") && (this.get('newCourseCodeCourseNumber').trim()!="") && (this.get('newCourseCodeUnit').trim()!=""))
            {
                this.set('newCourseCodeObj',this.get('store').createRecord('course-code', {
                courseLetter: this.get('newCourseCodeCourseLetter').trim(),
                courseNumber: this.get('newCourseCodeCourseNumber').trim(),
                name: this.get('newCourseCodeName').trim(),
                unit: this.get('newCourseCodeUnit').trim()
                }));
                
                var self = this;
                this.get('newCourseCodeObj').save().then(function(){
                     self.get('store').query('course-code', {
                        limit: self.get('limit'),
                        offset: self.get('courseCodeOffset')
                    }).then(function(records){
                        self.set('totalCourseCodes', records.get('meta').total);
                        self.set('courseCodeRecords', records);
                    });
                });
                this.set('newCourseCodeName',"");
                this.set('newCourseCodeCourseLetter',"");
                this.set('newCourseCodeCourseNumber',"");
                this.set('newCourseCodeUnit',"");
            }
            
        },

        saveCourseCode(courseCode)
        {
            courseCode.save();
        },

        deleteCourseCode(courseCode)
        {
            this.set('currentCourseCode',courseCode);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeDeleteConfirmation', true);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        loadHighSchools(){
            if ((this.get('highSchoolRecords') == null) || (this.get('highSchoolRecords').length <= 0)){
                var self = this;
                this.get('store').query('high-school', {
                    limit: self.get('limit'),
                    offset: self.get('highSchoolOffset')
                }).then(function(records){
                    self.set('totalHighSchools', records.get('meta').total);
                    self.set('highSchoolRecords', records);
                });
            }
        },
        addHighSchool()
        {
            var highSchoolArray=this.get('highSchoolRecords');
            var highSchoolName=this.get('newHighSchoolName');
            var isHighSchoolCreated=true;

             for(var i=0;i<highSchoolArray.content.length;i++)
            {
                if(highSchoolName.toUpperCase()==highSchoolArray.content[i]._data.schoolName.toUpperCase())
                {
                    this.setHighSchoolOutput("The secondary school entered is already created! Please enter a new secondary school name!");
                    isHighSchoolCreated=false;
                }
            }

            if(isHighSchoolCreated)
            {
                this.setHighSchoolOutput("");
                if (this.get('newHighSchoolName').trim() != "")
                {
                    this.set('newHighSchoolObj',this.get('store').createRecord('high-school',{
                        schoolName: this.get('newHighSchoolName').trim()
                    }));
                    var self = this;
                    this.get('newHighSchoolObj').save().then(function(){
                        self.get('store').query('high-school', {
                            limit: self.get('limit'),
                            offset: self.get('highSchoolOffset')
                        }).then(function(records){
                            self.set('totalHighSchools', records.get('meta').total);
                            self.set('highSchoolRecords', records);
                        });
                    });
                    this.set('newHighSchoolName',"");
                }
            }
        },

        saveHighSchool(highSchool)
        {
            highSchool.save();
        },

        deleteHighSchool(highSchool)
        {
            this.set('currentHighSchool', highSchool);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',true);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        switchCourseCodePage(pageNum)
        {
          this.changeCourseCodeOffset((pageNum - 1) * this.get('courseCodePageSize'), false);
        },

        switchHighSchoolPage(pageNum)
        {
            this.changeHighSchoolOffset((pageNum - 1) * this.get('highSchoolPageSize'), false);
        },

        switchHighSchoolSubjectPage(pageNum)
        {
            this.changeHighSchoolSubjectOffset((pageNum - 1) * this.get('highSchoolSubjectPageSize'), false);
        },

        switchTermCodePage(pageNum)
        {
            this.changeTermCodeOffset((pageNum - 1) * this.get('termCodePageSize'), false);
        },

        loadHighSchoolSubjects(){
            if ((this.get('highSchoolSubjectRecords') == null) || (this.get('highSchoolSubjectRecords').length <= 0)){
                var self = this;
                this.get('store').query('high-school-subject', {
                    limit: self.get('limit'),
                    offset: self.get('highSchoolSubjectOffset')
                }).then(function(records){
                    self.set('totalHighSchoolSubjects', records.get('meta').total);
                    self.set('highSchoolSubjectRecords', records);
                    self.get('store').findAll('high-school-subject').then(function (records) {
                        self.set('courseArray', records);
                    });
                });
            }
        },
        addHighSchoolSubject()
        {
            var self = this;
            var highSchoolSubjectName=this.get('newHighSchoolSubjectName');
            var highSchoolSubjectDescription=this.get('newHighSchoolSubjectDescriptionName');
            var isHighSchoolSubjectCreated=true;

            for(var i=0;i<this.get('courseArray').length;i++)
            {
                 if(highSchoolSubjectName.toUpperCase()==this.get('courseArray')[i].name.toUpperCase() && highSchoolSubjectDescription.toUpperCase()==this.get('courseArray')[i].description && highSchoolSubjectLevel.toUpperCase()==this.get('courseArray')[i].level && highSchoolSubjectUnit == this.get('courseArray')[i].unit && highSchoolSubjectSource.toUpperCase() == this.get('courseArray')[i].source)
                {
                    //console.log('subject exists or is false');
                    this.setHighSchoolSubjectOutput("The high school subject entered is already created! Please enter a new high school subject name!");
                    isHighSchoolSubjectCreated=false;
                }

            }

            if(isHighSchoolSubjectCreated)
            {
                this.setHighSchoolSubjectOutput("");
                if (this.get('newHighSchoolSubjectName').trim() != "" && this.get('newHighSchoolSubjectDescriptionName').trim() !="")
                {
                    this.set('newHighSchoolSubjectObj',this.get('store').createRecord('high-school-subject',{
                        name: this.get('newHighSchoolSubjectName').trim(),
                        description: this.get('newHighSchoolSubjectDescriptionName').trim()
                    }));
                    this.get('newHighSchoolSubjectObj').save().then(()=>{
                        var self = this;
                        this.get('store').query('high-school-subject', {
                            limit: self.get('limit'),
                            offset: self.get('highSchoolSubjectOffset')
                        }).then(function(records){
                            self.set('totalHighSchoolSubjects', records.get('meta').total);
                            self.set('highSchoolSubjectRecords', records);
                            self.get('store').findAll('high-school-subject').then(function (records) {
                                self.set('courseArray', records);
                            });
                        });
                        self.set('newHighSchoolSubjectName',"");
                        self.set('newHighSchoolSubjectDescriptionName',"");
                    });
                    
                }
            }
        },

        deleteHighSchoolSubject(hsSubject)
        {
            this.set('currentHighSchoolSubject',hsSubject);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',true);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);

        },

        saveHighSchoolSubject(hsSubject)
        {
            hsSubject.save();
        },

        loadTermCodes(){
            if ((this.get('termCodeRecords') == null) || (this.get('termCodeRecords').length <= 0)){
                var self = this;
                this.get('store').query('term-code',{
                    limit: self.get('limit'),
                    offset: self.get('termCodeOffset')
                }).then(function(records){
                    self.set('totalTermCodes', records.get('meta').total);
                    self.set('termCodeRecords', records);
                });
            }
        },
        addTermCode()
        {
            var termCodeArray=this.get('termCodeModel');
            var isTermCode=true;

            if(this.get('newTermCodeName').trim() != "")
            {
                for(var i=0;i<termCodeArray.length;i++)
                {
                    if(termCodeName.toUpperCase()==termCodeArray.content[i]._data.name)
                    {
                        this.setTermCodeOutput("The term code entered is already created! Please enter a new term code name!");
                        isTermCode=false;
                    }
                }

                    if(isTermCode)
                    {
                        this.setTermCodeOutput("");
                        if (this.get('newTermCodeName').trim() != "")
                        {
                            this.set('newTermCodeObj',this.get('store').createRecord('term-code',{
                                name: this.get('newTermCodeName').trim()
                            }));
                            var self = this;
                            this.get('newTermCodeObj').save().then(function(){
                                self.get('store').query('term-code',{
                                    limit: self.get('limit'),
                                    offset: self.get('termCodeOffset')
                                }).then(function(records){
                                    self.set('totalTermCodes', records.get('meta').total);
                                    self.set('termCodeRecords', records);
                                });
                            });
                            this.set('newTermCodeName',"");
                        }
                    }
            }
        },

        deleteTermCode(termCode)
        {
            this.set('currentTermCode',termCode);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', true);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        saveTermCode(termCode)
        {
            termCode.save();
        },

        loadCourseGroupings(){
            if ((this.get('courseGroupingModel') == null) || (this.get('courseGroupingModel').length <= 0)){
                var self = this;
                this.get('store').findAll('course-grouping').then(function (records) {
                    self.set('courseGroupingModel', records);
                });
            }
        },
        addCourseGrouping()
        {
            var courseGroupingArray = this.get('courseGroupingModel');
            var courseGroupingName = this.get('newCourseGroupingName');
            var isUnique = true;

            for(var i=0; i<courseGroupingArray.length;i++)
            {
                //console.log(courseGroupingArray[i].name);
                if(courseGroupingName.toUpperCase()==courseGroupingArray[i].name.toUpperCase())
                {
                    this.setCourseGroupingOutput("Please enter a new course grouping name, this name is already taken!");
                    isUnique=false;
                }
            }

            if(isUnique)
            {
                this.setCourseGroupingOutput("");
                if(courseGroupingName.trim() !="")
                {
                    this.set('newCourseGroupingObj', this.get('store').createRecord('course-grouping', {
                        name: this.get('newCourseGroupingName').trim()
                    }));
                    this.get('newCourseGroupingObj').save();
                    this.set('newCourseGroupingName',"");
                }
            }
        },

        deleteCourseGrouping(courseGrouping)
        {
            this.set('currentCourseGrouping',courseGrouping);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', true);
            this.set('showAddCoursesModal', false);
        },

        modifyCourses(courseGrouping)
        {
            this.set('currentCourseGrouping', courseGrouping);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', true);
        },

        saveName(courseGrouping)
        {
            courseGrouping.save();
        },
        loadFaculties(){
            var self = this;
            this.get('store').findAll('faculty').then(function(facultyRecords){
                self.set('facultyModel', facultyRecords);
            });
        },
        deleteFaculty(facultyOBJ){
            facultyOBJ.destroyRecord();
        },
        saveFaculty(facultyOBJ){
            facultyOBJ.save();
        },
        addFaculty(){
            var self = this;
            var newFaculty = this.get('store').createRecord('faculty', {
                name: self.get('newFacultyName')
            });
            newFaculty.save().then(function(){
                self.set('newFacultyName', "");
            });
            
        },
        loadDepartments(){
            var self = this;
            this.get('store').findAll('faculty').then(function(facultyRecords){
                self.set('facultyModel', facultyRecords);
                self.get('store').findAll('department').then(function(departmentRecords){
                    self.set('departmentModel', departmentRecords);
                });
            });
        },
        selectFaculty(departmentOBJ, ddlIndex){            
            departmentOBJ.set('faculty', this.get('store').peekRecord('faculty', Ember.$("#facultyDDL" + ddlIndex).val()));            
        },
        deleteDepartment(departmentOBJ){
            var self = this;
            departmentOBJ.destroyRecord().then(function(){
                self.get('store').findAll('faculty').then(function(facultyRecords){
                    self.set('facultyModel', facultyRecords);
                });
            });
        },
        saveDepartment(departmentOBJ){
            var self = this;
            departmentOBJ.save().then(function(){
                self.get('store').findAll('faculty').then(function(facultyRecords){
                    self.set('facultyModel', facultyRecords);
                });
            });
        },
        addDepartment(){
            var self = this;
            var newDepartment = this.get('store').createRecord('department', {
                name: self.get('newDepartmentName')
            });
            newDepartment.set('faculty', this.get('store').peekRecord('faculty', Ember.$("#newDeptFacultyDDL").val()));
            newDepartment.save().then(function(){
                self.set('newDepartmentName', "");
            });
            
        },
        loadProgramAdmins(){
            var self = this;
            this.get('store').findAll('department').then(function(departmentRecords){
                self.set('departmentModel', departmentRecords);
                self.get('store').findAll('program-administration').then(function(progAdminsRecords){
                    self.set('programAdminsModel', progAdminsRecords);
                });
            });
        },
        deleteAdmin(adminOBJ){
            var self = this;
            adminOBJ.destroyRecord().then(function(){
                self.get('store').findAll('department').then(function(departmentRecords){
                    self.set('departmentModel', departmentRecords);
                });
            });
        },
        saveAdmin(adminOBJ){            
            var self = this;
            adminOBJ.save().then(function(){
                self.get('store').findAll('department').then(function(departmentRecords){
                    self.set('departmentModel', departmentRecords);
                });
            });
        },
        addAdmin(){
            var self = this;
            var newAdmin = this.get('store').createRecord('program-administration', {
                name: self.get('newAdminName'),
                position: self.get('newAdminPosition')
            });
            newAdmin.set('department', this.get('store').peekRecord('department', Ember.$("#newAdminDeptDDL").val()));
            newAdmin.save().then(function(){
                self.set('newAdminName', "");
                self.set('newAdminPosition', "");
            });            
        },
        selectDepartment(adminOBJ, ddlIndex){
            adminOBJ.set('department', this.get('store').peekRecord('department', Ember.$("#departmentDDL" + ddlIndex).val()));            
        }

    }


});