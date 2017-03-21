import Ember from 'ember';

export default Ember.Component.extend({
    
    courseArray: [],
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
    genderModel: null,
    genderOutput: "",
    highSchoolCourseModel: null,
    highSchoolModel: null,
    highSchoolOutput: "",
    highSchoolSubjectModel: null,
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
    newHighSchoolCourseObj: null,
    newHighSchoolSubjectName: "",
    newHighSchoolSubjectDescriptionName: "",
    newHighSchoolSubjectLevel: "",
    newHighSchoolSubjectSource: "",
    newHighSchoolSubjectUnit: "",
    newHighSchoolSubjectObj: null,
    newResidencyName: "",
    newResidencyObj: null,
    newTermCodeName: "",
    newTermCodeObj: null,
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

    setHighSchoolSubjectOutput: function(newOutput) {
        this.set('highSchoolSubjectOutput', newOutput);
    },

    setCourseGroupingOutput: function(newOutput) {
        this.set('courseGroupingOutput', newOutput);
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
        var isLoading = true;
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

        this.get('store').findAll('high-school-subject').then(function (records) {
            records.forEach(function(subject,index) {
                var subjectID=subject.get('id')
                self.get('store').query('high-school-course', 
                {subject: subjectID}).then(function(courses) {
                    courses.forEach(function(course,index) {    
                    if (!self.checkUniqueCourseInfo(self.get('courseArray'), subject.get('name'), subject.get('description'),course.get('source'), course.get('level'), course.get('unit')))
                    {
                        self.get('courseArray').push({"name": subject.get('name') , "description": subject.get('description')  , "source": course.get('source')  , "level": course.get('level') , "unit": course.get('unit')});
                    }
                    });
                });
            });
        });

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        });

        this.get('store').findAll('course-grouping').then(function (records) {
            self.set('courseGroupingModel', records);
        });



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
        this.set('currentHighSchoolSubject', null);
        isLoading=false;
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
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
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
            console.log(this.courseArray);
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
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', false);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        switchPage(pageNum)
        {
          this.changeOffset((pageNum - 1) * this.get('pageSize'), false);
        },

        addHighSchoolSubject()
        {
            var highSchoolSubjectName=this.get('newHighSchoolSubjectName');
            var highSchoolSubjectDescription=this.get('newHighSchoolSubjectDescriptionName');
            var highSchoolSubjectLevel=this.get('newHighSchoolSubjectLevel');
            var highSchoolSubjectSource=this.get('newHighSchoolSubjectSource');
            var highSchoolSubjectUnit=this.get('newHighSchoolSubjectUnit');
            var isHighSchoolSubjectCreated=true;

            for(var i=0;i<courseArray.length;i++)
            {
                 if(highSchoolSubjectName.toUpperCase()==courseArray[i].name.toUpperCase() && highSchoolSubjectDescription.toUpperCase()==courseArray[i].description && highSchoolSubjectLevel.toUpperCase()==courseArray[i].level && highSchoolSubjectUnit == courseArray[i].unit && highSchoolSubjectSource.toUpperCase() == courseArray[i].source)
                {
                    this.setHighSchoolSubjectOutput("The high school subject entered is already created! Please enter a new high school subject name!");
                    isHighSchoolSubjectCreated=false;
                }

            }

            if(isHighSchoolSubjectCreated)
            {
                this.setHighSchoolSubjectOutput("");
                if (this.get('newHighSchoolSubjectName').trim() != "" && this.get('newHighSchoolSubjectDescriptionName').trim() !="" && this.get('newHighSchoolSubjectLevel').trim() !="" && this.get('newHighSchoolSubjectSource').trim() !="" && this.get('newHighSchoolSubjectUnit').trim() !="")
                {
                    this.set('newHighSchoolSubjectObj',this.get('store').createRecord('high-school-subject',{
                        name: this.get('newHighSchoolSubjectName').trim(),
                        description: this.get('newHighSchoolSubjectDescriptionName').trim()
                    }));

                    this.set('newHighSchoolCourseObj', this.get('store').createRecord('high-school-course' ,{
                        level:  this.get('newHighSchoolSubjectLevel').trim(),
                        unit:   this.get('newHighSchoolSubjectUnit').trim(),
                        source: this.get('newHighSchoolSubjectSource').trim()
                    }));
                    
                    this.set('newHighSchoolCourseObj').save();
                    this.get('newHighSchoolSubjectObj').save();
                    this.set('newHighSchoolSubjectSource',"");
                    this.set('newHighSchoolSubjectLevel', "");
                    this.set('newHighSchoolSubjectUnit', "");
                    this.set('newHighSchoolSubjectName',"");
                    this.set('newHighSchoolSubjectDescriptionName',"");
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
                if (this.get(termCodeName).trim() != "")
                {
                    this.set('newTermCodeObj',this.get('store').createRecord('term-code',{
                        name: termCodeName.trim()
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
            this.set('showDeleteHighSchoolSubjectConfirmation',false);
            this.set('showDeleteTermCodeConfirmation', true);
            this.set('showDeleteCourseGroupingConfirmation', false);
            this.set('showAddCoursesModal', false);
        },

        saveTermCode(termCode)
        {
            termCode.save();
        },

        addCourseGrouping()
        {
            var courseGroupingArray = this.get('courseGroupingModel');
            var courseGroupingName = this.get('newCourseGroupingName');
            var isUnique = true;

            for(var i=0; i<courseGroupingArray.length;i++)
            {
                console.log(courseGroupingArray[i].name);
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
        }

    }


});