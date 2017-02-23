import Ember from 'ember';

export default Ember.Component.extend({
    
    courseCodeRecords: null,
    currentCourseCode: null,
    currentGender: null,
    currentResidency: null,
    genderModel: null,
    newCourseCodeCourseLetter: "",
    newCourseCodeCourseNumber: "",
    newCourseCodeName: "",
    newCourseCodeUnit: "",
    newCourseCodeObj: null,
    newGenderName: "",
    newGenderObj: null,
    newResidencyName: "",
    newResidencyObj: null,
    residencyModel: null,
    showCourseCodeDeleteConfirmation: false,
    showDeleteGenderConfirmation: false,
    showDeleteResidencyConfirmation: false,
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
            if (this.get('newGenderName').trim() != "")
            {
                this.set('newGenderObj', this.get('store').createRecord('gender', {
                    name: this.get('newGenderName').trim()
                }));
                this.get('newGenderObj').save();
                this.set('newGenderName', "");
            }
        },

        saveGender(gender)
        {
            gender.save();
        },

        deleteGender(gender)
        {
            this.set('currentGender', gender);
            this.set('showGenderDeleteConfirmation', true);
            this.set('showResidencyDeleteConfirmation', false);
            this.set('showCourseCodeDeleteConfirmation', false);
        },

        addResidency()
        {   
            if (this.get('newResidencyName').trim() != "")
            {
                this.set('newResidencyObj',this.get('store').createRecord('residency',{
                    name: this.get('newResidencyName').trim()
                }));
                this.get('newResidencyObj').save();
                this.set('newResidencyName',"");
            }
        },

        saveResidency(residency)
        {
            residency.save();
        },

        deleteResidency(residency)
        {
           this.set('currentResidency',residency);
           this.set('showResidencyDeleteConfirmation', true);
           this.set('showGenderDeleteConfirmation', false); 
           this.set('showCourseCodeDeleteConfirmation' , false);
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
            this.set('showCourseCodeDeleteConfirmation',true);
            this.set('showGenderDeleteConfirmation', false);
            this.set('showResidencyDeleteConfirmation', false);

        },

        switchPage(pageNum)
        {
          this.changeOffset((pageNum - 1) * this.get('pageSize'), false);
        }
    }


});
