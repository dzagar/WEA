import Ember from 'ember';

export default Ember.Component.extend({
    studentsToAdjudicate: null,
    studentModel: null,
    adjudicationCategories: null,
    currentTerm: null,
    termCodeModel: null,
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
        
        var studentAdjudicationInfo = [];
        var currentTerm = this.get('currentTerm');
        var self = this;
        //loop all students
        this.get('studentsToAdjudicate').forEach(function(student, studentIndex) {
            studentAdjudicationInfo.push({
                "ObjID": student.get('id'), 
                "cumAVG": student.get('cumAVG'),
                "cumUnitsTotal": student.get('cumUnitsTotal'),
                "cumUnitsPassed": student.get('cumUnitsPassed'),
                "termAVG": "",
                "termUnitsTotal": "",
                "termUnitsPassed": "",
                "coursesCompleted": []
            });
            self.get('store').queryRecord('term', {
                student: student,
                termCode: currentTerm
            }).then(function(term) {
                studentAdjudicationInfo[studentIndex].termAVG = term.get('termAVG');
                studentAdjudicationInfo[studentIndex].termUnitsTotal = term.get('termUnitsTotal');
                studentAdjudicationInfo[studentIndex].termUnitsPassed = term.get('termUnitsPassed');
                self.get('store').query('grade', {
                    term: term
                }).then(function(grades) {
                    grades.forEach(function(grade, gradeIndex) {
                        var mark = grade.get('mark');
                        studentAdjudicationInfo[studentIndex].coursesCompleted.push({
                            "courseNumber": "",
                            "courseLetter": "",
                            "unit": "",
                            "mark": mark                            
                        });
                        self.get('store').queryRecord('courseCode', {
                            grade: grade
                        }).then(function (courseCode) {
                            var courseLetter = courseCode.get('courseLetter');
                            var courseNumber = courseCode.get('courseNumber');
                            var unit = courseCode.get('unit');
                            studentAdjudicationInfo[studentIndex].coursesCompleted[gradeIndex].courseNumber = courseNumber;
                            studentAdjudicationInfo[studentIndex].coursesCompleted[gradeIndex].courseLetter = courseLetter;
                            studentAdjudicationInfo[studentIndex].coursesCompleted[gradeIndex].unit = unit;
                        });
                    });
                });
            });
            //loop each category
            categories.forEach(function (category) {
                //get all assessments for each category
                self.get('store').query('assessment-code', {category: category}).then(function(assessments) {
                    //loop through assessments until student qualifies for one of them.
                    assessments.some(function(assessment, index) {
                        //VERY ROUGH CODE THAT MIGHT EVENTUALLY WORK
                        // if (self.send(evaluateStudent, student, assessment, currentTerm)){
                        //     var currentDate = "15-03-2017";//CHANGE THIS YO PLEASE
                        //     console.log("PLEASE REMEMBER TO CHANGE THIS I WILL BE SO SAD IF WE FORGET");
                        //     var newAdjudication = self.createRecord('adjudication', {
                        //         date: currentDate
                        //     });
                        //     newAdjudication.set('assessmentCode', assessment);
                        //     newAdjudication.set('student', student);
                        //     newAdjudication.set('term', currentTerm);
                        //     newAdjudication.save();
                        //     return true;
                        // }
                        // else{
                        //     return false;
                        // }
                    });
                });
            });
        });
    },

    init()
    {
        this._super(...arguments);
        var self=this;

        this.get('store').findAll('student').then(function (records) {
            self.set('studentModel', records);
        });    

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        });    
 
    },

    actions: {
    
        adjudicate()
        {
            
        },
        selectTerm(termCodeID){
            this.set('currentTerm', termCodeID);
            console.log(termCodeID);
        }
    }
});
