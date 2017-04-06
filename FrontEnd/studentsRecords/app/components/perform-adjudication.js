import Ember from 'ember';
import Mutex from 'ember-mutex';


var BoolValue = {
    YWA: 1,
    CWA: 2,
    FAILEDCREDITS: 3,
    GRADEINFAILED: 4,
    CREDITSIN: 5,
    AVGIN: 6,
    WDNFROM: 7,
    INCRFROM: 8,
    SPCIN: 9,
    FAILEDIN: 10,
    FIRSTYWA: 11,
    SECONDYWA: 12,
    CREDITSTHISTERM: 13
}
var RegularOperators = {
    EQUALS: 1,
    NOTEQUAL: 2,
    GREATERTHAN: 3,
    GREATEREQUAL: 4,
    LESSTHAN: 5,
    LESSEQUAL: 6,
    BETINC: 7,
    BETEXC: 8
}

export default Ember.Component.extend({
    
    adjudicationStatus: null,
    studentsToAdjudicate: null,
    adjudicationCategories: null,
    doneStatus: "",
    nonCategoryAdjudications: null,
    adjudicationCategoriesAssessmentCodes: null,
    currentTerm: null,
    courseGroupingsModel: null,
    termCodeModel: null,
    parsingProgress: 0,
    parsingTotal: 1000,
    evaluationProgress: 0,
    evaluationTotal: 1000,
    studentInformation: null,
    routing: Ember.inject.service('-routing'),
    reportAction: null,
    adjudicationStatus: "",
    store: Ember.inject.service(),


    init()
    {
        this._super(...arguments);
        var self=this;

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
            self.set('currentTerm', records.get('firstObject').get('id'));
        }); 
        this.get('store').findAll('adjudication-category').then(function(records) {
            self.set('adjudicationCategories', records);
        });
        this.get('store').query('assessment-code', {noCategory: true}).then(function(records) {
            self.set('nonCategoryAdjudications', records);
        });
        this.get('store').findAll('course-grouping').then(function(records){
            self.set('courseGroupingsModel', records);
        });
    },
    progressTracker: Ember.observer('evaluationProgress', function () {
        if (this.get('evaluationProgress') == this.get('evaluationTotal') && this.get('evaluationProgress') > 0){
            this.set('doneStatus', "<span style='color:green;'>Adjudication Complete! Please proceed to the 'Generate Reports' tab.</span>");
            Ember.$("#btnGenerateReports").removeClass("disabled");
            Ember.$("#btnEditFlagged").removeClass("disabled");
        }
    }),
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
    getCurrentDate()
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        return today;
    },
    performAdjudication(){

        var self = this;
        var studentInformation = this.get('studentInformation');
        var totalSize = 0;
        //initialize total size
        totalSize += this.get('adjudicationCategories').get('length') * studentInformation.length;
        totalSize += this.get('nonCategoryAdjudications').get('length') * studentInformation.length;
        
        self.set('adjudicationStatus', self.get('adjudicationStatus') + "Evaluating student for <b>" + this.get('adjudicationCategories').get('length') + " adjudication categories</b> and <b>" + this.get('nonCategoryAdjudications').get('length') + " Assessment code(s)</b> that do not belong to a category." + "<br>")
        self.set('evaluationTotal', totalSize);

        this.get('nonCategoryAdjudications').forEach(function(assessmentCode, assessmentCodeIndex) {
           self.evaluateNonCategoryAssessmentCode(assessmentCode.get('id'));
        });   

        this.get('adjudicationCategories').forEach(function(category, categoryIndex) {
            self.get('studentInformation').forEach(function(studentRecord){

                //this is used to track the assessment code we are evaluating and if we have checked all of them
                var numberOfPotentialAssessments = category.get('assessmentCodes').get('length');
                //if the assessment failed
                var failedDone = ()=>{
                    numberOfPotentialAssessments--;
                    //if there are still assessments to evaluate
                    if (numberOfPotentialAssessments > 0)
                    {
                        self.evaluateCategoryAssessmentCode(category.get('assessmentCodes').objectAt(numberOfPotentialAssessments - 1).get('id'), failedDone, category.get('programYear'), studentRecord);
                    }
                    else{
                        self.set('evaluationProgress', self.get('evaluationProgress') + 1);
                    }
                    return;             
                }
                if (numberOfPotentialAssessments > 0)
                {
                    self.evaluateCategoryAssessmentCode(category.get('assessmentCodes').get('lastObject').get('id'), failedDone, category.get('programYear'), studentRecord);
                }
                else{
                    self.set('evaluationProgress', self.get('evaluationProgress') + 1);
                }
            });            
        });
    },
    evaluateCategoryAssessmentCode(assessmentCodeID, failCallback, categoryYear, passedStudentRecord)
    {
        var self = this;
        //get the assessmentCode obj we are working with
        this.get('store').find('assessmentCode', assessmentCodeID).then(function(assessmentCode){
            //get the root logical expression
            var logicalExpressionID = assessmentCode.get('logicalExpression').get('id');
            self.get('store').find('logical-expression', logicalExpressionID).then(function(logicalExpression){
                //get the boolean expression from the root and set an empty array if there are children
                var expressionBoolean = JSON.parse(logicalExpression.get('booleanExpression'));
                expressionBoolean.logicalLink = logicalExpression.get('logicalLink');
                expressionBoolean.childBooleans = [];
                //if there are children
                if (logicalExpression.get('logicalExpressions').get('length') > 0)
                {
                    var rootExpressionChildrenCount = logicalExpression.get('logicalExpressions').get('length');
                    var done = ()=>{
                        rootExpressionChildrenCount--;
                        if(rootExpressionChildrenCount){
                            return;
                        }
                        if (!self.evaluateCategoryStudent(expressionBoolean, assessmentCodeID, categoryYear, passedStudentRecord))
                        {
                            failCallback();
                        }
                    }
                    function fetchAssociated(parent,childID,callback){
                        self.get('store').find('logicalExpression', childID).then(function(childLogicalExpressionOBJ){
                            var child = JSON.parse(childLogicalExpressionOBJ.get('booleanExpression'));
                            child.logicalLink = childLogicalExpressionOBJ.get('logicalLink');
                            child.childBooleans = [];
                            parent.childBooleans.push(child);
                            childLogicalExpressionOBJ.get('logicalExpressions').forEach((childLogicalExpression)=>{
                                rootExpressionChildrenCount++;
                                fetchAssociated(child,childLogicalExpression.get('id'),callback);
                            })
                            if(childLogicalExpressionOBJ.get('logicalExpressions').get('length') == 0){
                                callback();
                            }
                        })
                    }
                    logicalExpression.get('logicalExpressions').forEach(function(childLogicalExpression, childIndex){
                        fetchAssociated(expressionBoolean,childLogicalExpression.get('id'),done);
                    });
                } 
                else{                
                    if (!self.evaluateCategoryStudent(expressionBoolean, assessmentCodeID, categoryYear, passedStudentRecord))
                    {
                        failCallback();
                    }
                }               
            });
        });
    },
    evaluateCategoryStudent(evaluationJSON, assessmentCodeID, requiredYear, passedStudentRecord){
        var self = this;
        if ((requiredYear && (passedStudentRecord.programLevels.indexOf(requiredYear) > 0 || requiredYear == 5) || !requiredYear) && self.evaluateStudentRecord(passedStudentRecord, evaluationJSON))
        {
            var currentDate = self.getCurrentDate();
            //may need to do a bunch of queries to get the actual object not the ID
            var newAdjudicationObject = self.get('store').createRecord('adjudication', {
                date: currentDate
            });
            newAdjudicationObject.set('student', self.get('store').peekRecord('student', passedStudentRecord.studentID));
            newAdjudicationObject.set('termCode', self.get('store').peekRecord('term-code', self.get('currentTerm')));
            newAdjudicationObject.set('assessmentCode', self.get('store').peekRecord('assessmentCode', assessmentCodeID));                
            newAdjudicationObject.save().then(function(){
                self.set('evaluationProgress', self.get('evaluationProgress') + 1);
            });
            return true;
        }
        else{
            self.set('evaluationProgress', self.get('evaluationProgress') + 1);
            return false;
        }

    },

    //this funtion gets an assessment code object by id then builds the boolean expresion tree then passes the built boolean to evaluateStudents
    evaluateNonCategoryAssessmentCode(assessmentCodeID)
    {
        var self = this;
        //get the assessmentCode obj we are working with
        this.get('store').find('assessmentCode', assessmentCodeID).then(function(assessmentCode){
            //get the root logical expression
            var logicalExpressionID = assessmentCode.get('logicalExpression').get('id');
            self.get('store').find('logical-expression', logicalExpressionID).then(function(logicalExpression){
                //get the boolean expression from the root and set an empty array if there are children
                var expressionBoolean = JSON.parse(logicalExpression.get('booleanExpression'));
                expressionBoolean.logicalLink = logicalExpression.get('logicalLink');
                expressionBoolean.childBooleans = [];
                //if there are children
                if (logicalExpression.get('logicalExpressions').get('length') > 0)
                {
                    var rootExpressionChildrenCount = logicalExpression.get('logicalExpressions').get('length');
                    var done = ()=>{
                        rootExpressionChildrenCount--;
                        if(rootExpressionChildrenCount){
                            return;
                        }
                        self.evaluateStudents(expressionBoolean, assessmentCodeID);
                    }
                    function fetchAssociated(parent,childID,callback){
                        self.get('store').find('logicalExpression', childID).then(function(childLogicalExpressionOBJ){
                            var child = JSON.parse(childLogicalExpressionOBJ.get('booleanExpression'));
                            child.logicalLink = childLogicalExpressionOBJ.get('logicalLink');
                            child.childBooleans = [];
                            parent.childBooleans.push(child);
                            childLogicalExpressionOBJ.get('logicalExpressions').forEach((childLogicalExpression)=>{
                                rootExpressionChildrenCount++;
                                fetchAssociated(child,childLogicalExpression.get('id'),callback);
                            })
                            if(childLogicalExpressionOBJ.get('logicalExpressions').get('length') == 0){
                                callback();
                            }
                        })
                    }
                    logicalExpression.get('logicalExpressions').forEach(function(childLogicalExpression, childIndex){
                        fetchAssociated(expressionBoolean,childLogicalExpression.get('id'),done);
                    });
                } 
                else{
                    self.evaluateStudents(expressionBoolean, assessmentCodeID);
                }               
            });
        });
    },
    //this function evaluates all students according to a passed in assessmentCodeID
    evaluateStudents(evaluationJSON, assessmentCodeID, requiredYear){
        var self = this;
        this.get('studentInformation').forEach(function(studentInfo, studentIndex){
            if ((requiredYear && (studentInfo.programLevels.indexOf(requiredYear) > 0 || requiredYear == 5) || !requiredYear) && self.evaluateStudentRecord(studentInfo, evaluationJSON))
            {
                var currentDate = self.getCurrentDate();
                //may need to do a bunch of queries to get the actual object not the ID
                var newAdjudicationObject = self.get('store').createRecord('adjudication', {
                    date: currentDate
                });
                newAdjudicationObject.set('student', self.get('store').peekRecord('student', studentInfo.studentID));
                newAdjudicationObject.set('termCode', self.get('store').peekRecord('term-code', self.get('currentTerm')));
                newAdjudicationObject.set('assessmentCode', self.get('store').peekRecord('assessmentCode', assessmentCodeID));                
                newAdjudicationObject.save().then(function(){
                    self.set('evaluationProgress', self.get('evaluationProgress') + 1);
                    return true;
                });
            }
            else{
                self.set('evaluationProgress', self.get('evaluationProgress') + 1);
                return false;
            }
            //do some increment thing
        });        
    },
    //this function recursively evaluates the student based on the evaluationJSON object
    //depth first
    evaluateStudentRecord(studentRecord, evaluationJson)
    {
        
        var self = this;
        var studentEnrolledInCurrentTerm = false;
        studentRecord.terms.forEach(function(term){
            if (!studentEnrolledInCurrentTerm && term.termCodeID == self.get('currentTerm'))
            {
                studentEnrolledInCurrentTerm = true;
            }
        });
        if (!studentEnrolledInCurrentTerm){
            return false;
        }
        //if there are more children evaluation booleans
        if (evaluationJson.childBooleans.length > 0)
        {
            //1 is or 0 is and
            //if it's an any (OR)
            if (evaluationJson.logicalLink == "1")
            {
                var success = false;
                evaluationJson.childBooleans.forEach(function(childEvaluationBoolean, childIndex){
                    //if any success just return true;
                    if (!success && self.evaluateStudentRecord(studentRecord, childEvaluationBoolean))
                    {
                        success = true;
                    }
                });
                evaluationJson.forEach(function(parentEvaluationBoolean){
                    if (!success && self.evaluateBoolean(studentRecord, parentEvaluationBoolean))
                    {
                        success = true;
                    }
                });
                return success;
            }
            //if it's an all (AND)
            else{
                var success = true;
                //if any failure return false
                evaluationJson.childBooleans.forEach(function(childEvaluationBoolean, childIndex){
                    if (success && !self.evaluateStudentRecord(studentRecord, childEvaluationBoolean))
                    {
                        success = false;                        
                    }
                });
                evaluationJson.forEach(function(parentEvaluationBoolean){
                    if (success && !self.evaluateBoolean(studentRecord, parentEvaluationBoolean))
                    {
                        success = false;
                    }
                });
                return success;
            }
        }
        else{          
            //if it's an any (OR)
            if (evaluationJson.logicalLink == "1")
            {
                var success = false;
                evaluationJson.forEach(function(boolExpression, boolIndex){
                    if (!success && self.evaluateBoolean(studentRecord, boolExpression))
                    {
                        success = true;
                    }
                });
                return success;
            }
            //if it's an all (AND)
            else{
                var success = true;
                evaluationJson.forEach(function(boolExpression, boolIndex){
                    if (success && !self.evaluateBoolean(studentRecord, boolExpression))
                    {
                        success = false;
                    }
                });
                return success;
            }
        }
    },
    //this function evaluates an individual boolean expression with a student record.
    evaluateBoolean(studentRecord, boolExpression){

        //Increment to match dropdown index
        var field = Number(boolExpression.field) + 1;
        var opr = boolExpression.opr;
        var splitOpr;
        var courseGroupingID;
        var oprValue;
        if (opr.indexOf('+') >= 0){            
            splitOpr = opr.split('+');
            courseGroupingID = splitOpr[0];
            oprValue = splitOpr[1];
        }
        var val = boolExpression.val;
        var boolResult = false;
        switch (field){
            //student's YWA passes passed rule (ie: greater than, less than etc...)
            case BoolValue.YWA:{
                var currentTermID = studentRecord.termCodeID;
                var termWA = [];
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID && term.termUnitsTotal > 0)
                    {
                        termWA.push(term.termAVG);
                    }
                });
                //if the student does not have a YWA for the term then return false
                if (termWA.length > 0)
                {
                    boolResult = this.evaluateValue(Number(opr) + 1, termWA, val);
                } else{
                    boolResult = false;
                }
            }
            break;
            //student's CWA passes passed rule (ie: greater than, less than etc...)
            case BoolValue.CWA:{
                var studentCWA = [];
                studentCWA.push(studentRecord.cumAVG);
                boolResult = this.evaluateValue(Number(opr) + 1, studentCWA, val); 
            }
            break;
            //student's number of failed credits total passes passed rule (ie: greater than, less than etc...)
            case BoolValue.FAILEDCREDITS:{
                var studentNumberOfFailedCredits = [studentRecord.cumUnitsTotal - studentRecord.cumUnitsPassed];
                if (studentNumberOfFailedCredits[0] < 0)
                    studentNumberOfFailedCredits[0] = 0;
                boolResult = this.evaluateValue(Number(opr) + 1, studentNumberOfFailedCredits, val);   
            }
            break;
            //student's grade in all failed credits passes passed rule (ie: greater than, less than etc...)
            case BoolValue.GRADEINFAILED:{
                var failingGrades = [];
                var currentTermID = studentRecord.termCodeID;
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID){
                        term.grades.forEach(function(grade){
                            var gradeMark = grade.mark;
                            //if the mark is a number then check is the grade is a failing value
                            if (!isNaN(gradeMark)){
                                var gradeMarkNumber = Number(gradeMark);
                                if (gradeMarkNumber < 50)
                                    failingGrades.push(gradeMarkNumber);                    
                            }
                        });
                    }
                });
                boolResult = this.evaluateValue(Number(opr) + 1, failingGrades, val);                
            }
            break;
            //Student has completed a minimum number of courses from a course grouping
            case BoolValue.CREDITSIN:{
                var coursesInGrouping = [];
                var studentNumberOfCredits = 0;
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == courseGroupingID)
                    {
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                //check all grades
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            //check if the grade is a number
                            if (!isNaN(grade.mark))
                            {
                                var gradeMarkNumber = Number(grade.mark);
                                if (gradeMarkNumber >= 50)
                                {
                                    studentNumberOfCredits += grade.unit;                                    
                                }
                            }
                        }
                    });
                });
                //so now studentNumberOfCredits is equal to the number of credits the student has from a group. we now check the opr
                boolResult = this.evaluateValue(Number(oprValue) + 1, [studentNumberOfCredits], val);
            }
            break;
            //student's average in courses from a specific course grouping is greater than or equal to the val
            case BoolValue.AVGIN:{
                var coursesInGrouping = [];
                var gradeTotal = 0;
                var courseUnitCount = 0;
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping                    
                    if (courseGrouping.get('id') == courseGroupingID)
                    {                        
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            if (!isNaN(grade.mark))
                            {
                                var gradeMarkNumber = Number(grade.mark);
                                gradeTotal += gradeMarkNumber * grade.unit;
                                courseUnitCount += grade.unit;
                            }
                        }
                    });
                });
                if (courseUnitCount > 0){                    
                    var studentGroupAVG = gradeTotal / courseUnitCount;
                    boolResult = this.evaluateValue(Number(oprValue) + 1, [studentGroupAVG], val);
                }else{
                    boolResult = false;
                }
            }
            break;
            //if the student withdraws from 1 or more course in a course grouping
            case BoolValue.WDNFROM:{
                var coursesInGrouping = [];
                var foundCourse = false;                 
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == opr)
                    {
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            if (isNaN(grade.mark) && grade.mark == "WDN")
                            {
                                foundCourse = true;                   
                            }
                        }
                    });
                });
                if (val){                    
                    boolResult = foundCourse;
                }
                else{
                    boolResult = !foundCourse;
                }                
            }
            break;
            //if the student has incomplete in 1 or more course in a course grouping
            case BoolValue.INCRFROM:{
                var coursesInGrouping = [];   
                var foundCourse = false;              
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == opr)
                    {
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            if (isNaN(grade.mark) && grade.mark == "INC")
                            {
                                foundCourse = true;                                
                            }
                        }
                    });
                });                
                if (val){                    
                    boolResult = foundCourse;
                }
                else{
                    boolResult = !foundCourse;
                }                
            }
            break;
            //if the student has SPC in 1 or more course in a course grouping
            case BoolValue.SPCIN:{
                var coursesInGrouping = [];  
                var foundCourse = false;               
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == opr)
                    {
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            if (isNaN(grade.mark) && grade.mark == "SPC")
                            {
                                foundCourse = true;                                
                            }
                        }
                    });
                });                
                if (val){                    
                    boolResult = foundCourse;
                }
                else{
                    boolResult = !foundCourse;
                }                  
            }
            break;
            //if the student has a failed course in a course grouping
            case BoolValue.FAILEDIN:{
                var coursesInGrouping = []; 
                var foundCourse = false;                
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == opr)
                    {
                        courseGrouping.get('courseCodes').forEach(function(courseCode){
                            coursesInGrouping.push(courseCode.get('id'));
                        });
                    }
                });
                studentRecord.terms.forEach(function(term){
                    term.grades.forEach(function(grade){
                        if (coursesInGrouping.includes(grade.courseCodeID))
                        {
                            if (!isNaN(grade.mark) && grade.mark < 50)
                            {
                                foundCourse = true;      
                            }
                        }
                    });
                });                
                if (val){                    
                    boolResult = foundCourse;
                }
                else{
                    boolResult = !foundCourse;
                }                
            }
            break;
            //if this is the first time a YWA passes a rule (less than, in between, greater than etc...)
            case BoolValue.FIRSTYWA:{
                var self = this;
                var currentTermPasses = false;
                var otherTermPasses = false;
                var currentTermID = studentRecord.termCodeID;
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID && term.termUnitsTotal > 0 && self.evaluateValue(opr + 1, term.termAVG, val))
                    {                        
                        currentTermPasses = true;
                    }
                    else if (term.termUnitsTotal > 0 && self.evaluateValue(opr + 1, term.termAVG, val)){
                        otherTermPasses = true;
                    }
                });
                boolResult = (currentTermPasses && !otherTermPasses);              
            }
            break;
            //if this is the second time a YWA passes a rule (less than, in between, greater than etc...)
            case BoolValue.SECONDYWA:{
                var self = this;
                var currentTermPasses = false;
                var otherTermCount = 0;
                var currentTermID = studentRecord.termCodeID;
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID && term.termUnitsTotal > 0 &&  self.evaluateValue(opr + 1, term.termAVG, val))
                    {                        
                        currentTermPasses = true;
                    }
                    else if (term.termUnitsTotal > 0 && self.evaluateValue(opr + 1, term.termAVG, val)){
                        otherTermCount++;
                    }
                });
                boolResult = (currentTermPasses && otherTermCount == 1); 
                
            }
            break;
            //if the number of credits completed in a specific term follows a specific rule
            case BoolValue.CREDITSTHISTERM:{
                var numberOfCredits = [];
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == studentRecord.termCodeID)
                    {
                        numberOfCredits.push(term.grades.length);
                    }
                }); 
                boolResult = this.evaluateValue(opr + 1, numberOfCredits, val);                
            }
            break;
        }
        return boolResult;
    },
    evaluateValue(operatorValue, studentValue, ruleValue){

        var evaluationResult = true;
        switch (Number(operatorValue)){
            case RegularOperators.EQUALS:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) != Number(ruleValue))
                        evaluationResult = false;
                }
            }
            break;
            case RegularOperators.NOTEQUAL:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) == Number(ruleValue))
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.GREATERTHAN:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) <= Number(ruleValue))
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.GREATEREQUAL:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) < Number(ruleValue))
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.LESSTHAN:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) >= Number(ruleValue))
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.LESSEQUAL:{
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) > Number(ruleValue))
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.BETINC:{
                var betVals = ruleValue.split('-');
                var lowerBound = Number(betVals[0]);
                var upperBound = Number(betVals[1]);
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) < lowerBound || Number(studentValue[i]) > upperBound)
                        evaluationResult = false;
                }

            }
            break;
            case RegularOperators.BETEXC:{
                var betVals = ruleValue.split('-');
                var lowerBound = Number(betVals[0]);
                var upperBound = Number(betVals[1]);
                for (var i = 0; i < studentValue.length; i++)
                {
                    if (Number(studentValue[i]) <= lowerBound || Number(studentValue[i]) >= upperBound)
                        evaluationResult = false;
                }

            }
            break;
        }
        return evaluationResult;
    },
    testingEvaluateValue(){
        /*
        //console.log("in EQUAL EVAL");
        if (true != this.evaluateValue(1, [50], 50))
            //console.log("1. invalid result!!!!!!!");
        if (true != this.evaluateValue(1, [100], 100))
            //console.log("2. invalid result!!!!!!!");
        if (true != this.evaluateValue(1, [0], 0))
            //console.log("3. invalid result!!!!!!!");
        if (false != this.evaluateValue(1, [0], 5))
            //console.log("4. invalid result!!!!!!!");
        if (false != this.evaluateValue(1, [0], 15))
            //console.log("5. invalid result!!!!!!!");
        if (false != this.evaluateValue(1, [100], 99.9))
            //console.log("6. invalid result!!!!!!!");

        //console.log("IN NOT EQUAL EVAL");     
        if (false != this.evaluateValue(2, [50], 50))
            //console.log("1. invalid result!!!!!!!");
        if (false != this.evaluateValue(2, [100], 100))
            //console.log("2. invalid result!!!!!!!");
        if (false != this.evaluateValue(2, [0], 0))
            //console.log("3. invalid result!!!!!!!");
        if (true != this.evaluateValue(2, [0], 5))
            //console.log("4. invalid result!!!!!!!");
        if (true != this.evaluateValue(2, [0], 15))
            //console.log("5. invalid result!!!!!!!");
        if (true != this.evaluateValue(2, [100], 99.9))
            //console.log("6. invalid result!!!!!!!");
            */
    },
    actions: {
        adjudicate()
        {
            // this.testingEvaluateValue();
            // return;
            var studentAdjudicationInfo = [];
            var currentTerm = this.get('currentTerm');
            var self = this;
            var readingMutex = Mutex.create();
            var erroredValues = [];
            var currentProgress = 0;
            var currentTotal = 0;
            var doneReading = false;
            var doneReadingMutex = Mutex.create();
            this.get('store').findAll('student').then(function (records) {
                currentTotal += records.get('length');
                self.set('adjudicationStatus', self.get('adjudicationStatus') + "Beginning adjudication of " + currentTotal + " students." + "<br>");
                self.set('adjudicationStatus', self.get('adjudicationStatus') + "Reading student data..." + "<br>");
                records.forEach(function(student, studentIndex) {
                    //push objID, termID, cumAVG, CumUnitsTotal, cumUnitsPassed
                    readingMutex.lock(function() {
                        studentAdjudicationInfo[studentIndex] = {
                            "studentID" : student.get('id'),
                            "termCodeID": currentTerm,
                            "programLevels": [],
                            "cumAVG": student.get('cumAVG'),
                            "cumUnitsTotal": student.get('cumUnitsTotal'),
                            "cumUnitsPassed": student.get('cumUnitsPassed'),
                            "terms": []
                        };
                        currentProgress++; 
                        self.determineProgress(currentProgress, currentTotal);  
                        var studentOBJid = student.get('id');
                        self.get('store').query('term', {student: studentOBJid}).then(function(terms){
                            currentTotal += terms.get('length');
                            terms.forEach(function(term, termIndex) {
                                //get the program if the term = currentTerm
                                if (term.get('termCode').get('id') == currentTerm && term.get('programRecords').get('length') != 0)
                                {
                                    term.get('programRecords').forEach(function(programRecord, prIndex){
                                        var programRecordID = programRecord.get('id');
                                        self.get('store').find('program-record', programRecordID).then(function(programRecordOBJ){
                                            studentAdjudicationInfo[studentIndex].programLevels.push(programRecordOBJ.get('level'));
                                        });
                                    });
                                }
                               //push codeRef, termAVG, termUnitsTotal, termUnitsPassed
                                var termID = term.get('id');
                                self.get('store').find('term', termID).then(function(termInfo) {
                                    studentAdjudicationInfo[studentIndex].terms[termIndex] = {
                                        "termCodeID": termInfo.get('termCode').get('id'),
                                        "termAVG": termInfo.get('termAVG'),
                                        "termUnitsTotal": termInfo.get('termUnitsTotal'),
                                        "termUnitsPassed": termInfo.get('termUnitsPassed'),
                                        "grades": []
                                    };
                                    currentProgress++;  
                                    currentTotal += term.get('grades').get('length');
                                    self.determineProgress(currentProgress, currentTotal);
                                    //get grades
                                    var inGradeMutexIndex = 0;
                                    termInfo.get('grades').forEach(function(grade, index) {
                                        var gradeID = grade.get('id');
                                        self.get('store').find('grade', gradeID).then(function(gradeInfo) {                                                
                                            var gradeIndex = inGradeMutexIndex++;
                                            //push mark, gradeID                        
                                            studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex] = {
                                                "gradeID": gradeInfo.get('id'),
                                                "mark": gradeInfo.get('mark'),
                                                "courseCodeID": gradeInfo.get('courseCode.id'),
                                                "courseNumber": "",
                                                "courseLetter": "",
                                                "unit": "",
                                                "courseGroupings": []
                                            };
                                            //get courseCode
                                            var courseCodeID = gradeInfo.get('courseCode.id');
                                            self.get('store').find('course-code', courseCodeID).then(function(courseCode){
                                                //push courseID, courseNumber, courseLetter, courseUnit
                                                
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseNumber = courseCode.get('courseNumber');
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseLetter = courseCode.get('courseLetter');
                                                studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].unit = courseCode.get('unit');
                                                currentProgress++;                                                
                                                //getgroupings
                                                // courseCode.get('courseGroupings').forEach(function(courseGrouping, courseGroupingIndex) {
                                                //     studentAdjudicationInfo[studentIndex].terms[termIndex].grades[gradeIndex].courseGroupings.push(courseGrouping.get('id'));
                                                // });
                                                doneReadingMutex.lock(function() {
                                                    if (self.determineProgress(currentProgress, currentTotal) && !doneReading)
                                                    {
                                                        self.set('studentInformation', studentAdjudicationInfo);
                                                        doneReading = true;
                                                        
                                                        self.set('adjudicationStatus', self.get('adjudicationStatus') + "Student Information successfully imported." + "<br>")
                                                        self.set('adjudicationStatus', self.get('adjudicationStatus') + "Beginning student evaluation." + "<br>")

                                                        self.performAdjudication();
                                                    }
                                                })
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
        },
        proceedToReports(){
            var self = this;
            this.get('reportAction')(self.get('currentTerm'));
        },
        proceedToFlagged(){
            this.get('routing').transitionTo('student-records');
        }
    }
});
