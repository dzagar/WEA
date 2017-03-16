import Ember from 'ember';
import Mutex from 'ember-mutex';

export default Ember.Component.extend({
    studentsToAdjudicate: null,
    adjudicationCategories: null,
    nonCategoryAdjudications: null,
    currentTerm: null,
    termCodeModel: null,
    parsingProgress: 0,
    parsingTotal: 1000,
    evaluationProgress: 0,
    evaluationTotal: 1000,
    store: Ember.inject.service(),


    init()
    {
        this._super(...arguments);
        var self=this;

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        }); 
        // this.get('store').findAll('adjudication-category').then(function(records) {
        //     self.set('adjudicationCategories', records);
        // });
        // this.get('store').query('assessment-code', {noCategory: true}).then(function(records) {
        //     self.set('nonCategoryAdjudications', records);
        // });
    },

    determineProgress(newProgress, newTotal)
    {
        if (this.get('parsingProgress')/this.get('parsingTotal') <= newProgress/newTotal)
        {
            this.set('parsingTotal', newTotal);
            this.set('parsingProgress', newProgress);            
            return (newTotal == newProgress);
        }
        else{
            return false;
        }
    },
    performAdjudication(studentInformation){

        var self = this;
        var totalSize = 0;
        //initialize total size
        this.get('adjudicationCategories').forEach(function(category, categoryIndex) {
            totalSize += category.get('assessmentCodes').get('length') * studentInformation.length;
        });
        totalSize += this.get('nonCategoryAdjudications').get('length') * studentInformation.length;
        

        //each category


        //each non category based adjudication



    },
    actions: {    
        adjudicate()
        {
            var studentAdjudicationInfo = [];
            var currentTerm = this.get('currentTerm');
            var self = this;
            var readingMutex = Mutex.create();
            var erroredValues = [];
            var currentProgress = 0;
            var currentTotal = 0;
            
            this.get('store').query('student', {offset: 0, limit: 100}).then(function (records) {
                currentTotal += records.get('length');                
                records.forEach(function(student, studentIndex) {
                    //push objID, termID, cumAVG, CumUnitsTotal, cumUnitsPassed
                    readingMutex.lock(function() {
                        studentAdjudicationInfo.push({
                            "studentID" : student.get('id'),
                            "termCodeID": currentTerm,
                            "cumAVG": student.get('cumAVG'),
                            "cumUnitsTotal": student.get('cumUnitsTotal'),
                            "cumUnitsPassed": student.get('cumUnitsPassed'),
                            "terms": []
                        });
                        currentProgress++; 
                        self.determineProgress(currentProgress, currentTotal);  
                        var studentOBJid = student.get('id');
                        self.get('store').query('term', {student: studentOBJid}).then(function(terms){
                            currentTotal += terms.get('length');
                            terms.forEach(function(term, termIndex) {                
                               //push codeRef, termAVG, termUnitsTotal, termUnitsPassed
                                var termID = term.get('id');
                                self.get('store').find('term', termID).then(function(termInfo) {
                                    studentAdjudicationInfo[studentIndex].terms.push({
                                        "termCodeID": termInfo.get('id'),
                                        "termAVG": termInfo.get('termAVG'),
                                        "termUnitsTotal": termInfo.get('termUnitsTotal'),
                                        "termUnitsPassed": termInfo.get('termUnitsPassed'),
                                        "grades": []
                                    });
                                    currentProgress++;  
                                    currentTotal += term.get('grades').get('length');
                                    self.determineProgress(currentProgress, currentTotal);
                                    //get grades
                                    var gradeMutex = Mutex.create();
                                    var inGradeMutexIndex = 0;
                                    termInfo.get('grades').forEach(function(grade, index) {
                                        gradeMutex.lock(function() {
                                            var gradeID = grade.get('id');
                                            self.get('store').find('grade', gradeID).then(function(gradeInfo) {                                                
                                                var gradeIndex = inGradeMutexIndex++;
                                                //push mark, gradeID                        
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades.push({
                                                    "gradeID": gradeInfo.get('id'),
                                                    "mark": gradeInfo.get('mark'),
                                                    "courseNumber": "",
                                                    "courseLetter": "",
                                                    "unit": "",
                                                    "courseGroupings": []
                                                });
                                                //get courseCode
                                                var courseCodeID = gradeInfo.get('courseCode.id');
                                                self.get('store').find('course-code', courseCodeID).then(function(courseCode){
                                                    //push courseID, courseNumber, courseLetter, courseUnit
                                                    currentProgress++;
                                                    
                                                    studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseNumber = courseCode.get('courseNumber');
                                                    studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseLetter = courseCode.get('courseLetter');
                                                    studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].unit = courseCode.get('unit');
                                                    
                                                    //getgroupings
                                                    // courseCode.get('courseGroupings').forEach(function(courseGrouping, courseGroupingIndex) {
                                                    //     studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseGroupings.push(courseGrouping.get('id'));
                                                    // });
                                                    if (self.determineProgress(currentProgress, currentTotal))
                                                    {
                                                        //do actual evaluation
                                                        console.log("done reading.... time to evaluate");
                                                    } 
                                                });
                                            });

                                        });                                        
                                    });
                                });
                            });
                        });
                    });                                      
                }); 
            }); 
        },
        selectTerm(termCodeID){
            this.set('currentTerm', termCodeID);
        }
    }
});
