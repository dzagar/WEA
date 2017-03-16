import Ember from 'ember';
import Mutex from 'ember-mutex';

export default Ember.Component.extend({
    studentsToAdjudicate: null,
    adjudicationCategories: null,
    currentTerm: null,
    termCodeModel: null,
    parsingProgress: 0,
    parsingTotal: 1000,
    store: Ember.inject.service(),
    evaluateStudent: function(student, assessment, currentTerm)
    {
        var self = this;
        this.get('store').queryRecord('logical-expression', {
            assessment: assessment
        }).then(function(logicalExpression) {
            return self.send(evalutateLogicalExpression, logicalExpression, student, currentTerm);
        });

    },
    determineProgress(newprogress, newTotal)
    {
        if (this.get('parsingProgress')/this.get('parsingTotal') < newprogress/newTotal)
        {
            this.set('parsingTotal', newTotal);
            this.set('parsingProgress', newprogress);
        }

    },
    //this is the recursive function that'll go through each node
    //Async stuff is gonna fuck this hard so we're gonna have to pretty much redo it all but this is the idea
    //probs change the student and current term parameters to just be arrays or something so we don't constantly hit the DB
    //info we need it YWA, CWA, credits passed and total for term and cumulative, grades for every course taken. Definitely get that info in evaluateStudent
    evalutateLogicalExpression: function(logicalExpression, student, currentTerm)
    {
        if (logicalExpression.get('logicalLink') == "AND")
        {
            if (!evaluateBooleanExpression(logicalExpression.get('booleanExpression')))
            {
                return false;
            }
            else{
                logicalExpression.get('logicalExpressions').forEach(function(expression, index) {
                    if (!evaluateBooleanExpression(expression, student, currentTerm))
                    {
                        return false;
                    }
                });
                return true;
            }
        }
        else if (logicalExpression.get('logicalLink') == "OR"){
            if (evaluateBooleanExpression(logicalExpression.get('booleanExpression')))
            {
                return true;
            }
            else{
                logicalExpression.get('logicalExpressions').forEach(function(expression, index) {
                    if (evaluateBooleanExpression(expression, student, currentTerm))
                    {
                        return true;
                    }
                });
                return false;
            }
        }        
    },
    //this is the function that evaluates individual boolean expressions.
    //booleaExpression is a json object
    evaluateBooleanExpression: function(booleanExpression, student, currentTerm){
        //do a switch case for each possible key to evaluate
        switch (booleanExpression.key)
        {
            case "YWA":
            {

            }
            break;
            case "CWA":
            {

            }
            break;
            case "course":
            {

            }
            break;
            case "fails":
            {

            }
            break;
        }
    },
    performAdjudication: function() {
        
       
    },

    init()
    {
        this._super(...arguments);
        var self=this;

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        });    
 
    },

    actions: {    
        adjudicate()
        {
            var studentAdjudicationInfo = [];
            var currentTerm = this.get('currentTerm');
            var self = this;
            var readingMutex = Mutex.create();
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
                        var studentOBJid = student.get('id');
                        self.get('store').query('term', {student: studentOBJid}).then(function(terms){
                            currentTotal += terms.get('length');
                            terms.forEach(function(term, termIndex) {                
                    //         //push codeRef, termAVG, termUnitsTotal, termUnitsPassed
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
                                    //get grades
                                    termInfo.get('grades').forEach(function(grade, gradeIndex) {
                                        var gradeID = grade.get('id');
                                        self.get('store').find('grade', gradeID).then(function(gradeInfo) {
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
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseNumber = courseCode.get('courseNumber');
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseLetter = courseCode.get('courseLetter');
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].unit = courseCode.get('unit');
                                                //getgroupings
                                                // courseCode.get('courseGroupings').forEach(function(courseGrouping, courseGroupingIndex) {
                                                //     studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseGroupings.push(courseGrouping.get('id'));
                                                // });
                                                currentProgress++;
                                                self.determineProgress(currentProgress, currentTotal);  
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });                                      
                }); 
            }); 
            //loop through all students                    
        },
        selectTerm(termCodeID){
            this.set('currentTerm', termCodeID);
        }
    }
});
