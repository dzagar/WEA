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
    studentsToAdjudicate: null,
    adjudicationCategories: null,
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
    store: Ember.inject.service(),


    init()
    {
        this._super(...arguments);
        var self=this;

        this.get('store').findAll('term-code').then(function (records) {
            self.set('termCodeModel', records);
        }); 
        this.get('store').findAll('adjudication-category').then(function(records) {
            self.set('adjudicationCategories', records);
        });
        this.get('store').query('assessment-code', {noCategory: true}).then(function(records) {
            self.set('nonCategoryAdjudications', records);
        });
        // this.get('store').findAll('course-grouping').then(function(records){
        //     self.set('courseGroupingsModel', records);
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
        self.set('evaluationTotal', totalSize);

        this.get('nonCategoryAdjudications').forEach(function(assessmentCode, assessmentCodeIndex) {
            console.log("non category index" + assessmentCodeIndex);
           self.evaluateNonCategoryAssessmentCode(assessmentCode.get('id'));
        });   

        //IDEA
        //for each category there are several assessment codes
        //for each code we evaluate it and if it returns false we call a callback with the next object to evaluate
        //if it returns true or counter reaches 0 we just stop and don't evaluate anymore.
        this.get('adjudicationCategories').forEach(function(category, categoryIndex) {

            //if the category has no assessmentCode then continue to next category
            if (!category.get('assessmentCodes'))
            {
                self.set('evaluationProgress', self.get('evaluationProgress') + studentInformation.length);
                return;
            }
            //this is used to track the assessment code we are evaluating and if we have checked all of them
            var numberOfPotentialAssessments = category.get('assessmentCodes').get('length');
            //if the assessment failed
            var failedDone = ()=>{
                numberOfPotentialAssessments--;
                //if there are still assessments to evaluate
                if (numberOfPotentialAssessments >= 0)
                {
                    self.evaluateCategoryAssessmentCode(category.get('assessmentCodes').objectAt(numberOfPotentialAssessments - 1).get('id'), failedDone);
                }
                self.set('evaluationProgress', self.get('evaluationProgress') + studentInformation.length);
                return;             
            }
            if (category.get('assessmentCodes').get('length') > 0)
            {
                self.evaluateCategoryAssessmentCode(category.get('assessmentCodes').get('lastObject').get('id'), failedDone);
            }
            else{
                self.set('evaluationProgress', self.get('evaluationProgress') + studentInformation.length);
            }
        });
    },
    evaluateCategoryAssessmentCode(assessmentCodeID, failCallback)
    {
        var self = this;
        //get the assessmentCode obj we are working with
        this.get('store').find('assessmentCode', assessmentCodeID).then(function(assessmentCode){
            //get the root logical expression
            var logicalExpressionID = assessmentCode.get('logicalExpression').get('id');
            self.get('store').find('logical-expression', logicalExpressionID).then(function(logicalExpression){
                //get the boolean expression from the root and set an empty array if there are children
                var expressionBoolean = logicalExpression.get('booleanExpression');
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
                        if (!self.evaluateStudents(expressionBoolean, assessmentCodeID))
                        {
                            failCallback();
                        }
                    }
                    function fetchAssociated(parent,childID,callback){
                        self.get('store').find('logicalExpression', childID).then(function(childLogicalExpressionOBJ){
                            child = childLogicalExpressionOBJ.get('booleanExpression');
                            child.logicalLink = logicalExpression.get('logicalLink');
                            child.childBooleans = [];
                            parent.childBooleans.push(child);
                            childLogicalExpressionOBJ.get('logicalExpressions').forEach((childLogicalExpression)=>{
                                rootExpressionChildrenCount++;
                                fetchAssociated(child,childLogicalExpression.get('id'),callback);
                            })
                            if(childLogicalExpressionOBJ.get('length') == 0){
                                callback();
                            }
                        })
                    }
                    logicalExpression.get('logicalExpressions').forEach(function(childLogicalExpression, childIndex){
                        fetchAssociated(expressionBoolean,childLogicalExpression.get('id'),done);
                    });
                } 
                else{                    
                    if (!self.evaluateStudents(expressionBoolean, assessmentCodeID))
                    {
                        failCallback();
                    }
                }               
            });
        });
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
                var expressionBoolean = logicalExpression.get('booleanExpression');
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
                            child = childLogicalExpressionOBJ.get('booleanExpression');
                            child.logicalLink = logicalExpression.get('logicalLink');
                            child.childBooleans = [];
                            parent.childBooleans.push(child);
                            childLogicalExpressionOBJ.get('logicalExpressions').forEach((childLogicalExpression)=>{
                                rootExpressionChildrenCount++;
                                fetchAssociated(child,childLogicalExpression.get('id'),callback);
                            })
                            if(childLogicalExpressionOBJ.get('length') == 0){
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
    evaluateStudents(evaluationJSON, assessmentCodeID){
        var self = this;
        this.get('studentInformation').forEach(function(studentInfo, studentIndex){
            if (evaluateStudentRecord(studentInfo, evaluationJSON))
            {
                var currentDate = getCurrentDate();
                //may need to do a bunch of queries to get the actual object not the ID
                var newAdjudicationObject = self.get('store').createRecord('adjudication', {
                    student: studentInfo.studentID,
                    termCode: self.get('currentTerm'),
                    assessmentCode: assessmentCodeID,
                    date: currentDate
                });
                newAdjudicationObject.save().then(function(){
                    //do some increment thing
                    //return true;
                    self.set('evaluationProgress', self.get('evaluationProgress') + 1);
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
        //if there are more children evaluation booleans
        if (evaluationJson.childBooleans)
        {
            //1 is or 0 is and
            //if it's an any (OR)
            if (evaluationJson.logicalLink)
            {
                var success = false;
                evaluationJson.childBooleans.forEach(function(childEvaluationBoolean, childIndex){
                    //if any success just return true;
                    if (!success && evaluateStudentRecord(studentRecord, childEvaluationBoolean))
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
                    if (success && !evaluateStudentRecord(studentRecord, childEvaluationBoolean))
                    {
                        success = false;                        
                    }
                });
                return success;
            }
        }
        else{            
            //if it's an any (OR)
            if (evaluationJson.logicalLink)
            {
                var success = false;
                evaluationJson.booleanExpressions.forEach(function(boolExpression, boolIndex){
                    if (!success && evaluateBoolean(studentRecord, boolExpression))
                    {
                        success = true;
                    }
                });
                return success;
            }
            //if it's an all (AND)
            else{
                var success = true;
                evaluationJson.booleanExpressions.forEach(function(boolExpression, boolIndex){
                    if (success && evaluateBoolean(studentRecord, boolExpression))
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
        var field = boolExpression.field + 1;
        var opr = boolExpression.opr;
        var val = boolExpression.val;
        var boolResult = false;
        switch (field){
            //student's YWA passes passed rule (ie: greater than, less than etc...)
            case BoolValue.YWA:{
                var currentTermID = studentRecord.termCodeID;
                var termWA = [];
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID)
                    {
                        termWA.push(term.termAVG);
                    }
                });
                boolResult = this.evaluateValue(opr + 1, terWA, val);
            }
            break;
            //student's CWA passes passed rule (ie: greater than, less than etc...)
            case BoolValue.CWA:{
                var studentCWA = [];
                studentCWA.push(studentRecord.cumAVG);
                boolResult = this.evaluateValue(opr + 1, studentCWA, val);                
            }
            break;
            //student's number of failed credits total passes passed rule (ie: greater than, less than etc...)
            case BoolValue.FAILEDCREDITS:{
                var studentNumberOfFailedCredits = [studentRecord.cumUnitsTotal - studentRecord.cumUnitsPassed];
                boolResult = this.evaluateValue(opr + 1, studentNumberOfFailedCredits, val);                
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
                            if (!isNAN(gradeMark)){
                                var gradeMarkNumber = Number(gradeMark);
                                if (gradeMarkNumber < 50)
                                    failingGrades.push(gradeMarkNumber);                    
                            }
                        });
                    }
                });
                boolResult = this.evaluateValue(opr + 1, failingGrades, val);                
            }
            break;
            //Student has completed a minimum number of courses from a course grouping
            case BoolValue.CREDITSIN:{
                var coursesInGrouping = [];
                var minimumNumberOfCredits = val;
                this.get('courseGroupingsModel').forEach(function(courseGrouping){
                    //if we have the right course grouping
                    if (courseGrouping.get('id') == opr)
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
                                    minimumNumberOfCredits -= grade.unit;                                    
                                }
                            }
                        }
                    });
                });
                //if minimumNumberOfCredits is 0 or less than the user has completed sufficient number of credits
                boolResult = (minimumNumberOfCredits <= 0);        
            }
            break;
            //student's average in courses from a specific course grouping is greater than or equal to the val
            case BoolValue.AVGIN:{
                var coursesInGrouping = [];
                var gradeTotal = 0;
                var courseUnitCount = 0;
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
                            if (!isNaN(grade.mark))
                            {
                                var gradeMarkNumber = Number(grade.mark);
                                gradeTotal += gradeMarkNumber * grade.unit;
                                courseUnitCount += grade.unit;
                            }
                        }
                    });
                });
                var studentGroupAVG = gradeTotal / courseUnitCount;
                boolResult = (studentGroupAVG >= val);                
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
                var currentTermPasses = false;
                var otherTermPasses = false;
                var currentTermID = studentRecord.termCodeID;
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID && this.evaluateValue(opr + 1, term.termAVG, val))
                    {                        
                        currentTermPasses = true;
                    }
                    else if (this.evaluateValue(opr + 1, term.termAVG, val)){
                        otherTermPasses = true;
                    }
                });
                boolResult = (currentTermPasses && !otherTermPasses);              
            }
            break;
            //if this is the second time a YWA passes a rule (less than, in between, greater than etc...)
            case BoolValue.SECONDYWA:{
                var currentTermPasses = false;
                var otherTermCount = 0;
                var currentTermID = studentRecord.termCodeID;
                studentRecord.terms.forEach(function(term){
                    if (term.termCodeID == currentTermID && this.evaluateValue(opr + 1, term.termAVG, val))
                    {                        
                        currentTermPasses = true;
                    }
                    else if (this.evaluateValue(opr + 1, term.termAVG, val)){
                        otherTermCount++;
                    }
                });
                boolResult = (currentTermPasses && otherTermCount == 1); 
                
            }
            break;
            //if the number of credits completed in a specific term follows a specific rule
            case BoolValue.CREDITSTHISTERM:{

                
            }
            break;
        }
        return boolResult;
    },
    evaluateValue(operatorValue, studentValue, ruleValue){

        switch (operatorValue){
            case RegularOperators.EQUALS:{

            }
            break;
            case RegularOperators.NOTEQUAL:{

            }
            break;
            case RegularOperators.GREATERTHAN:{

            }
            break;
            case RegularOperators.GREATEREQUAL:{

            }
            break;
            case RegularOperators.LESSTHAN:{

            }
            break;
            case RegularOperators.LESSEQUAL:{

            }
            break;
            case RegularOperators.BETINC:{

            }
            break;
            case RegularOperators.BETEXC:{

            }
            break;
        }
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
            var doneReading = false;
            var doneReadingMutex = Mutex.create();
            
            this.get('store').query('student', {offset: 0, limit: 100}).then(function (records) {
                currentTotal += records.get('length');                
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
                                if (term.get('termCode').get('id') == currentTerm)
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
                                                        //do actual evaluation
                                                        console.log("done reading.... time to evaluate");
                                                        console.log(studentAdjudicationInfo);
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
        }
    }
});
