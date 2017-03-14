import Ember from 'ember';

export default Ember.Component.extend({
    
    courseCodeRecords: null,
    currentCourseCode: null,
    currentGender: null,
    currentHighSchool: null,
    currentResidency: null,
    currentTermCode: null,
    genderModel: null,
    genderOutput: "",
    highSchoolModel: null,
    highSchoolOutput: "",
    newCourseCodeCourseLetter: "",
    newCourseCodeCourseNumber: "",
    newCourseCodeName: "",
    newCourseCodeUnit: "",
    newCourseCodeObj: null,
    newGenderName: "",
    newGenderObj: null,
    newHighSchoolName: "",
    newHighSchoolObj: null,
    newResidencyName: "",
    newResidencyObj: null,
    newTermCodeName: "",
    newTermCodeObj: null,
    residencyModel: null,
    residencyOutput: "",
    showCourseCodeDeleteConfirmation: false,
    showDeleteGenderConfirmation: false,
    showDeleteHighSchoolConfirmation: false,
    showDeleteResidencyConfirmation: false,
    showDeleteTermCodeConfirmation: false,
    termCodeModel: null,
    termCodeOutput: "",
    limit: null,
    offset: null,
    pageSize: null,
    pageNumber: Ember.computed('offset', 'pageSize', function() {
    let num = this.get('offset')/this.get('pageSize')+1;
    return num;
    }),
    totalCourseCodes: null,
    totalPages: Ember.computed('totalCourseCodes', 'pageSize', function() {
    let ttl = Math.ceil(this.get('totalCourseCodes')/this.get('pageSize'));
    return ttl;
    }),
    store: Ember.inject.service(),

    setResidencyOutput: function(newOutput) {
		this.set('residencyOutput', newOutput);	
	},

    setGenderOutput: function(newOutput) {
        this.set('genderOutput',newOutput);
    },

    setHighSchoolOutput: function(newOutput) {
        this.set('highSchoolOutput',newOutput);
    },

    setTermCodeOutput: function(newOutput) {
        this.set('termCodeOutput', newOutput);
    },

    init() {
        this._super(...arguments);
        var self = this;
        
        // load Residency data model
        this.get('store').findAll('residency').then(function (records) {
            self.set('residencyModel', records);
        });

        // load Gender data model 
        this.get('store').findAll('gender').then(function (records) {
            self.set('genderModel',records);
        });

        this.get('store').findAll('high-school').then(function (records) {
            self.set('highSchoolModel', records);
        });

<<<<<<< HEAD
        this.get('store').findAll('high-school-subject').then(function (records){
            self.set('highSchoolSubjectModel', records);
        });

        this.get('store').findAll('high-school-course').then(function (records){
            self.set('highSchoolCourseModel', records);
        });

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        });

=======
>>>>>>> master
        this.set('limit', 10);
        this.set('offset', 0);
        this.set('pageSize', 10);
        this.get('store').query('course-code', {
            limit: self.get('limit'),
            offset: self.get('offset')
        }).then(function(records){
            self.set('totalCourseCodes', records.get('meta').total);
            self.set('courseCodeRecords', records);
        });
        
        this.set('currentCourseCode', null);
        this.set('currentGender', null);
        this.set('currentResidency', null);
        this.set('currentHighSchool', null);
    },

    courseCodeModel: Ember.observer('offset', function () {
      var self = this;
      this.get('store').query('course-code', {
        limit: self.get('limit'),
        offset: self.get('offset')
      }).then(function (records) {
        self.set('totalCourseCodes', records.get('meta').total);
        self.set('courseCodeRecords', records);
      });
    }),
    
    didRender() {
    Ember.$('.menu .item').tab();
    },

    //Changes the offset based on offsetDelta and relative.
    //If relative is true, the offsetDelta is added to offset
    //If relative is false, the offsetDelta becomes the new offset
    //Checks and deals with the edge of the set
    changeOffset: function (offsetDelta, relative) {
      if (relative) {
        if (this.get('offset') + offsetDelta >= this.get('totalCourseCodes'))
          this.set('offset', (this.get('totalPages') - 1) * this.get('pageSize'));
        else if (this.get('offset') + offsetDelta < 0)
          this.set('offset', 0);
        else
          this.set('offset', this.get('offset') + offsetDelta);
      } else {
        this.set('offset', offsetDelta);
      }
    },

    actions:
    {
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
<<<<<<< HEAD
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
=======
>>>>>>> master
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
<<<<<<< HEAD
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
=======
>>>>>>> master
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
                
                this.get('newCourseCodeObj').save();
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
<<<<<<< HEAD
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
=======
>>>>>>> master

        },

        addHighSchool()
        {
            var highSchoolArray=this.get('highSchoolModel');
            var highSchoolName=this.get('newHighSchoolName');
            var isHighSchoolCreated=true;

             for(var i=0;i<highSchoolArray.content.length;i++)
            {
                console.log(highSchoolArray);
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
                    this.get('newHighSchoolObj').save();
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
            this.set('currentHighSchool',highSchool);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',true);
<<<<<<< HEAD
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
=======
>>>>>>> master
        },

        switchPage(pageNum)
        {
          this.changeOffset((pageNum - 1) * this.get('pageSize'), false);
        },
<<<<<<< HEAD

        addHighSchoolSubject()
        {
            var hsSubjectArray=this.get('highSchoolSubjectModel');
            var highSchoolSubjectName=this.get('newHighSchoolSubjectName');
            var isHighSchoolSubjectCreated=true;

            for(var i=0;i<hsSubjectArray.content.length;i++)
            {
                 if(highSchoolSubjectName.toUpperCase()==hsSubjectArray.content[i]._data.name.toUpperCase())
                {
                    this.setHighSchoolSubjectOutput("The high school subject entered is already created! Please enter a new high school subject name!");
                    isHighSchoolSubjectCreated=false;
                }
            }

            if(isHighSchoolSubjectCreated)
            {
                this.setHighSchoolSubjectOutput("");
                if (this.get('newHighSchoolSubjectName').trim() != "" && this.get('newHighSchoolSubjectDescription').trim() !="")
                {
                    this.set('newHighSchoolSubjectObj',this.get('store').createRecord('high-school-subject',{
                        name: this.get('newHighSchoolSubjectName').trim(),
                        description: this.get('newHighSchoolSubjectDescription').trim()
                    }));
                    this.get('newHighSchoolSubjectObj').save();
                    this.set('newHighSchoolSubjectName',"");
                    this.set('newHighSchoolSubjectDescription',"");
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
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',true);
            this.set('showDeleteTermCodeConfirmation', false);

        },

        saveHighSchoolSubject(hsSubject)
        {
            var hsCourseArray=this.get('highSchoolCourseModel');
            console.log(hsCourseArray);
            hsSubject.save();
        },

        addTermCode()
        {
            var termCodeArray=this.get('termCodeModel');
            var termCodeName=this.get('newTermCodeName');
            var isTermCode=true;

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
                    this.get('newTermCodeObj').save();
                    this.set('newTermCodeName',"");
                }
            }
        },

        deleteTermCode(termCode)
        {
            this.set('currentHighSchoolSubject',hsSubject);
            this.set('showDeleteGenderConfirmation', false);
            this.set('showDeleteResidencyConfirmation', false);
            this.set('showCourseCodeConfirmation', false);
            this.set('showDeleteHighSchoolConfirmation',false);
            this.set('showDeleteHighSchoolCourseConfirmation',false);
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', true);
        },

        saveTermCode(termCode)
        {
            termCode.save();
        }

=======
>>>>>>> master
    }


});
