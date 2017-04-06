import Ember from 'ember';

export default Ember.Component.extend({

    currentStudent: null,
    errorGrade: false,
    errorHS: false,
    errorLevel: false,
    errorSource: false,
    errorSubject: false,
    errorUnit: false,
    highSchools: null,
    highSchoolSubjects: null,
    loadingHS: false,
    loadingSubject: false,
    newGradeValue: null,
    newLevelValue: null,
    newSourceValue: null,
    newUnitValue: null,
    selectedGrade: null,
    selectedHighSchoolID: null,
    selectedSubjectID: null,
    showDeleteConfirmation: false,
    store: null,


    init() {
        this._super(...arguments);
        this.send("loadHSData");
        this.send("loadSubjectData");
    },

    didRender() {
        Ember.$('#hsDropdown')
        .dropdown(
            {
                direction: "downward",
                fullTextSearch: "exact"
            });
        Ember.$('#subjectDropdown')
        .dropdown(
            {
                direction: "downward",
                fullTextSearch: "exact"
            });
    },



    actions: {
        addHSGrade()
        {
            //console.log('add pressed');

            this.set('errorHS', false);
            this.set('errorSubject', false);
            this.set('errorLevel', false);
            this.set('errorSource', false);
            this.set('errorUnit', false);
            this.set('errorGrade', false);

            let failed = false;

            if (!this.get('selectedHighSchoolID')) {
                failed = true;
                this.set('errorHS', true);
            }
            if (!this.get('selectedSubjectID')) {
                failed = true;
                this.set('errorSubject', true);
            }
            if (!this.get('newLevelValue') || isNaN(this.get('newLevelValue'))) {
                failed = true;
                this.set('errorLevel', true);
            }
            if (!this.get('newSourceValue')) {
                failed = true;
                this.set('errorSource', true);
            }
            if (!this.get('newUnitValue') || isNaN(this.get('newUnitValue'))) {
                failed = true;
                this.set('errorUnit', true);
            }
            if (!this.get('newGradeValue') || isNaN(this.get('newGradeValue'))) {
                failed = true;
                this.set('errorGrade', true);
            }

            if (!failed) {
                let self = this;

                this.get('store').find('high-school', this.get('selectedHighSchoolID')).then(function (schoolObj) {
                    self.get('store').find('high-school-subject', self.get('selectedSubjectID')).then(function (subjectObj) {
                        let newHSCourse = self.get('store').createRecord('high-school-course', {
                            level: Number(self.get('newLevelValue')),
                            source: self.get('newSourceValue'),
                            unit: Number(self.get('newUnitValue')),
                            school: schoolObj,
                            subject: subjectObj
                        });
                        this.get('currentStudent').reload();
                        newHSCourse.save().then(function() {
                            //console.log(newHSCourse.id);
                            let newGrade = self.get('store').createRecord('high-school-grade', {
                                mark: Number(self.get('newGradeValue')),
                                student: self.get('currentStudent'),
                                source: newHSCourse
                            });
                            newGrade.save().then(function() {
                                //console.log('success!');
                            });
                        });
                    });
                });
            }
        // if (this.get('newHighSchoolName').trim() != "")
        //     {
        //         this.set('newHighSchoolObj', this.get('store').createRecord('highSchool', {
        //             name: this.get('newHighSchoolName').trim()
        //         }));
        //         this.get('newHighSchoolObj').save();
        //         this.set('newHighSchoolName', "");
        //     }
        },

        deleteHSGrade(grade)
        {
            this.set('selectedGrade', grade);
            this.set('showDeleteConfirmation', true); 
        },

        saveHSGrade(grade)
        {
            grade.save();
        },

        loadHSData()
        {
            if (!this.get('highSchools')) {
                this.set('loadingHS', true);
                let self = this;

                this.get('store').findAll('high-school').then(function(records) {
                    self.set('highSchools', records);
                    self.set('loadingHS', false);
                });
            }
        },

        changeHighSchool(highSchoolID)
        {
            this.set('selectedHighSchoolID', highSchoolID);
            //console.log(highSchoolID);
        },

        loadSubjectData()
        {
            if (!this.get('highSchoolSubjects')) {
                this.set('loadingSubject', true);
                let self = this;

                this.get('store').findAll('high-school-subject').then(function(records) {
                    self.set('highSchoolSubjects', records);
                    self.set('loadingSubject', false);
                });
            }
        },

        changeSubject(subjectID)
        {
            this.set('selectedSubjectID', subjectID);
        },

        clearError(varName)
        {
            this.set(varName, false);
        }
    }
});
