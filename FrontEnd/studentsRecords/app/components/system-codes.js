import Ember from 'ember';

export default Ember.Component.extend({
    
    courseCodeModel: null,
    currentCourseCode: null,
    currentGender: null,
    currentResidency: null,
    genderModel: null,
    newCourseCodeName: "",
    newCourseCodeObj: null,
    newGenderName: "",
    newGenderObj: null,
    newResidencyName: "",
    newResidencyObj: null,
    residencyModel: null,
    showCourseCodeDeleteConfirmation: false,
    showDeleteGenderConfirmation: false,
    showDeleteResidencyConfirmation: false,
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

        this.get('store').findAll('course-code').then(function (records) {
            self.set('courseCodeModel',records);
        });
        
        this.set('currentCourseCode', null);
        this.set('currentGender', null);
        this.set('currentResidency', null);
        
    },
    
    didRender() {
    Ember.$('.menu .item').tab();
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
            if(this.get('newCourseCodeName').trim()!="")
            {
                this.set('newCourseCodeObj',this.get('store').createRecord('course-code', {
                    name: this.get('newCourseCodeName').trim()
                }));
                this.get('newCourseCodeObj').save();
                this.set('newCourseCodeName',"");
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

        }

    }


});
