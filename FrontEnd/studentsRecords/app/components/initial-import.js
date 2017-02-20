import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';
import Mutex from 'ember-mutex';

var ImportState = {
	GENDER : 1,
	RESIDENCY : 2,
	TERMCODE : 3,
	COURSECODE : 4,
	STUDENT : 5,
	HIGHSCHOOL : 6,
	HSCOURSEINFO : 7,
	SCHOLARSHIPS : 8,
	ADVANCEDSTANDINGS : 9,
	RECORDPLANS : 10,
	RECORDGRADES : 11
};

function DisplayErrorMessage(message)
{
	console.log(message);
}
function checkUniqueSubject(sourceArray, newName, newDescription)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].name === newName && sourceArray[i].description === newDescription)
		{
			console.log("found duplicate value of " + newName + " and " + newDescription);
			return false;
		}
	}
	return true;
}
function checkUniqueHSCourse(sourceArray, newSchool, newLevel, newSource, newUnit, newSubjectName, newSubjectDescription)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].level == newLevel && sourceArray[i].source == newSource && sourceArray[i].unit == newUnit && sourceArray[i].name == newSubjectName && sourceArray[i].description == newSubjectDescription && sourceArray[i].schoolName == newSchool)
		{
			console.log("found duplicate field");
			return false;
		}
	}
	return true;
}

function checkUniqueTerm(sourceArray, newStudentNumber, newTermCode)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].studentNumber == newStudentNumber && sourceArray[i].termCode == newTermCode)
		{
			console.log("found duplicate field in Term Code");
			console.log(newStudentNumber);
			return false;
		}
	}
	return true;
}

function checkUniqueProgram(sourceArray, newStudentNumber, newTermCode, newName, newLevel, newLoad)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].studentNumber == newStudentNumber && sourceArray[i].term == newTermCode && sourceArray[i].program == newName && sourceArray[i].level == newLevel && sourceArray[i].load == newLoad)
		{
			console.log("found duplicate field in Program Record");
			console.log(newStudentNumber);
			return false;
		}
	}
	return true;
}
function checkUniquePlan(sourceArray, newStudentNumber, newTermCode, newProgramName, newLevel, newLoad, newPlanName)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].studentNumber == newStudentNumber && sourceArray[i].term == newTermCode && sourceArray[i].program == newProgramName && sourceArray[i].level == newLevel && sourceArray[i].load == newLoad && sourceArray[i].plan == newPlanName)
		{
			console.log("found duplicate field in Plan Code");
			console.log(newStudentNumber);
			return false;
		}
	}
	return true;
}
function checkUniqueCourse(sourceArray, newLetter, newNumber, newUnit)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].letter == newLetter && sourceArray[i] == newNumber)
		{
			console.log("found duplicate course" + newLetter + newNumber);
			
			return false;
		}
		if (isNaN(newUnit))
		{
			console.log("ERROR: RECORD " + newLetter + newNumber + "cannot convert unit " + newUnit + " to a number");
			return false;
		}
	}
	return true;
}
function genderVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage("Please fix the 'name' header in the imported file!");
		return false;
	}

	return true;
}

function residencyVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage("Please fix the 'name' header in the imported file!");
		return false;
	}

	return true;
}

function termCodeVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage("Please fix the 'name' header in the imported file!");
		return false;
	}

	return true;
}

function courseCodeVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='TERM')
	{
		DisplayErrorMessage("Please fix the 'term' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSELETTER')
	{
		DisplayErrorMessage("Please fix the 'courseletter' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSENUMBER')
	{
		DisplayErrorMessage("Please fix the 'coursenumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SECTION')
	{
		DisplayErrorMessage("Please fix the 'section' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage("Please fix the 'grade' header in the imported file!");
		return false;
	}

	currentString=worksheet['G1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NOTE')
	{
		DisplayErrorMessage("Please fix the 'note' header in the imported file!");
		return false;
	}

	return true;
}

function studentVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='FIRSTNAME')
	{
		DisplayErrorMessage("Please fix the 'firstname' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LASTNAME')
	{
		DisplayErrorMessage("Please fix the 'lastname' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GENDER')
	{
		DisplayErrorMessage("Please fix the 'gender' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='DOB')
	{
		DisplayErrorMessage("Please fix the 'DOB' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='RESIDENCY')
	{
		DisplayErrorMessage("Please fix the 'residency' header in the imported file!");
		return false;
	}

	return true;
}
function UndergraduateCoursesVerification(workbook)
{
	var currentString=workbook['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSELETTER')
	{
		DisplayErrorMessage("Please fix the 'courseletter' header in the imported file!");
		return false;
	}

	currentString=workbook['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSENUMBER')
	{
		DisplayErrorMessage("Please fix the 'coursenumber' header in the imported file!");
		return false;
	}

	currentString=workbook['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage("Please fix the 'name' header in the imported file!");
		return false;
	}

	currentString=workbook['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='UNIT')
	{
		DisplayErrorMessage("Please fix the 'unit' header in the imported file!");
		return false;
	}


	return true;

}
function secondarySchoolVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SCHOOL NAME')
	{
		DisplayErrorMessage("Please fix the 'school name' header in the imported file!");
	}

	return true;
}

function studentHighSchoolVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SCHOOLNAME')
	{
		DisplayErrorMessage("Please fix the 'schoolname' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LEVEL')
	{
		DisplayErrorMessage("Please fix the 'level' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SUBJECT')
	{
		DisplayErrorMessage("Please fix the 'subject' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='DESCRIPTION')
	{
		DisplayErrorMessage("Please fix the 'description' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SOURCE')
	{
		DisplayErrorMessage("Please fix the 'source' header in the imported file!");
		return false;
	}

	currentString=worksheet['G1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='UNITS')
	{
		DisplayErrorMessage("Please fix the 'units' header in the imported file!");
		return false;
	}

	currentString=worksheet['H1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage("Please fix the 'grade' header in the imported file!");
		return false;
	}

	return true;
}

function ScholarshipVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NOTE')
	{
		DisplayErrorMessage("Please fix the 'note' header in the imported file!");
		return false;
	}

	return true;
}

function AdvancedStandingVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSE')
	{
		DisplayErrorMessage("Please fix the 'course' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='DESCRIPTION')
	{
		DisplayErrorMessage("Please fix the 'description' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='UNITS')
	{
		DisplayErrorMessage("Please fix the 'units' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage("Please fix the 'grade' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='FROM')
	{
		DisplayErrorMessage("Please fix the 'from' header in the imported file!");
		return false;
	}

	return true;
}

function UndergraduateRPVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='TERM')
	{
		DisplayErrorMessage("Please fix the 'term' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='PROGRAM')
	{
		DisplayErrorMessage("Please fix the 'program' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LEVEL')
	{
		DisplayErrorMessage("Please fix the 'level' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LOAD')
	{
		DisplayErrorMessage("Please fix the 'load' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='PLAN')
	{
		DisplayErrorMessage("Please fix the 'plan' header in the imported file!");
		return false;
	}

	return true;
}

function UndergraduateCGVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage("Please fix the 'studentnumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='TERM')
	{
		DisplayErrorMessage("Please fix the 'term' header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSELETTER')
	{
		DisplayErrorMessage("Please fix the 'courseletter' header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSENUMBER')
	{
		DisplayErrorMessage("Please fix the 'coursenumber' header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SECTION')
	{
		DisplayErrorMessage("Please fix the 'section' header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage("Please fix the 'grade' header in the imported file!");
		return false;
	}

	var currentString=worksheet['G1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NOTE')
	{
		DisplayErrorMessage("Please fix the 'note' header in the imported file!");
		return false;
	}

	return true;
}


export default Ember.Component.extend({
	
	store: Ember.inject.service(),
	showDeleteConfirmation: false,
	importData: false,
	changingIndex: 1,

	
	actions: {
		showEraseDataModal: function(){
			this.set('showDeleteConfirmation', true);
		},

		import() {
			var files = $("#newFile")[0].files;
			var i,f;
			for (i = 0; i != files.length; ++i) {
				f = files[i];
				console.log(f);
				var reader = new FileReader();
				var name = f.name;
				var self=this;
				reader.onload = function(e) {
					var data = e.target.result;
					var workbook;
					workbook = XLSX.read(data, {type: 'binary'});
					
					var currentWorkSheet=workbook.SheetNames[0];
					var worksheet=workbook.Sheets[currentWorkSheet];

					var currentIndex=self.get('changingIndex');

					switch(currentIndex)
					{
						case ImportState.GENDER: 
						if (genderVerification(worksheet)){
							var rollBackImport = false;
							var doneImporting = false;
							var gendersToImport = [];
							var uniqueGenderNames = [];
							for (var i = 2; !doneImporting; i++){
									//get the next gender name
									var gender = worksheet['A' + i];
									//if the gender exists
									if (gender){
										//gets the genderNameString
										var genderName = gender.v;
										//if the gender has already been added
										if (uniqueGenderNames.includes(genderName)){
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate gender names '" + genderName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new gender object
											gendersToImport[i - 2] = self.get('store').createRecord('gender', 
											{
												name: genderName
											});
											uniqueGenderNames[i] = genderName;
										}
									} else {
										doneImporting = true;
										//if no gender was imported
										if (i == 2) {
											rollBackImport = true;
											DisplayErrorMessage("File does not contain any Values...")
										}
									}
								}
								//delete genders from the store
								if (rollBackImport) {
									for (var i = 0; i < gendersToImport.length; i++) {
										gendersToImport[i].deleteRecord();
									}
								} else {
									for (var i = 0; i < gendersToImport.length; i++) {
										console.log("trying to save");
										gendersToImport[i].save();
									}
								}
							}
							break;
							case ImportState.RESIDENCY:
							if (residencyVerification(worksheet)) {
								var rollBackImport = false;
								var doneImporting = false;
								var residenciesToImport = [];
								var uniqueResidencyNames = [];
								for (var i = 2; !doneImporting; i++) {
									//get the next residency name
									var residency = worksheet['A' + i];
									//if the residency exists
									if (residency) {
										//gets the residencyNameString
										var residencyName = residency.v;
										//if the residency has already been added
										if (uniqueResidencyNames.includes(residencyName)) {
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate residency names '" + residencyName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new residency object
											residenciesToImport[i - 2] = self.get('store').createRecord('residency', 
											{
												name: residencyName
											});
											uniqueResidencyNames[i] = residencyName;
										}
									} else {
										doneImporting = true;
										//if no residency was imported
										if (i == 2) {
											rollBackImport = true;
											DisplayErrorMessage("File does not contain any Values...")
										}
									}
								}
								//delete residencies from the store
								if (rollBackImport) {
									for (var i = 0; i < residenciesToImport.length; i++) {
										residenciesToImport[i].deleteRecord();
									}
								} else { //save residencies to back-end
									for (var i = 0; i < residenciesToImport.length; i++) {
										console.log("trying to save");
										residenciesToImport[i].save();
									}
								}
							}
							break;
							case ImportState.TERMCODE:
							if (termCodeVerification(worksheet)) {
								var rollBackImport = false;
								var doneImporting = false;
								var termCodesToImport = [];
								var uniqueTermCodeNames = [];
								for (var i = 2; !doneImporting; i++) {
									//get the next term code name
									var termCode = worksheet['A' + i];
									//if the term code exists
									if (termCode) {
										//gets the termCodeNameString
										var termCodeName = termCode.v;
										//if the term code has already been added
										if (uniqueTermCodeNames.includes(termCodeName)) {
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate term code names '" + termCodeName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new term code object
											termCodesToImport[i - 2] = self.get('store').createRecord('term-code', 
											{
												name: termCodeName
											});
											uniqueTermCodeNames[i] = termCodeName;
										}
									} else {
										doneImporting = true;
										//if no term code was imported
										if (i == 2) {
											rollBackImport = true;
											DisplayErrorMessage("File does not contain any Values...")
										}
									}
								}
								//delete term codes from the store
								if (rollBackImport) {
									for (var i = 0; i < termCodesToImport.length; i++) {
										termCodesToImport[i].deleteRecord();
									}
								} else {
									for (var i = 0; i < termCodesToImport.length; i++) {
										console.log("trying to save");
										termCodesToImport[i].save();
									}
								}
							}
							break;
							case ImportState.COURSECODE:
							if (UndergraduateCoursesVerification(worksheet)) {
								var rollBackImport = false;
								var doneImporting = false;
								var courseCodesToImport = [];
								var uniqueCourseCodes = [];
								for (var i = 2; !doneImporting; i++) {
									//get the next course code name
									var courseCode1 = worksheet['A' + i];
									var courseCode2 = worksheet['B' + i];
									var courseCode3 = worksheet['C' + i];
									var courseCode4 = worksheet['D' + i];
									//if the course code exists
									if (courseCode1 && courseCode2 && courseCode3 && courseCode4) {
										//gets the courseCodeNameString
										var courseCodeLetter = courseCode1.v;
										var courseCodeNum = courseCode2.v;
										var courseCodeName = courseCode3.v;
										var courseCodeUnit = courseCode4.v;
										//if the course code has already been added
										if (!checkUniqueCourse(uniqueCourseCodes, courseCodeLetter, courseCodeNum, courseCodeUnit)) {
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate course codes '" + courseCodeLetter + courseCodeName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new course code object
											courseCodesToImport[courseCodesToImport.length] = self.get('store').createRecord('course-code', 
											{
												courseLetter: courseCodeLetter,
												courseNumber: courseCodeNum,
												name: courseCodeName,
												unit: courseCodeUnit
											});
											uniqueCourseCodes[uniqueCourseCodes.length] = {"letter": courseCodeLetter, "number": courseCodeNum};
										}
									} else {
										doneImporting = true;
										//if no course code was imported
										if (i == 2) {
											rollBackImport = true;
											DisplayErrorMessage("File does not contain any Values...")
										}
									}
								}
								//delete course codes from the store
								if (rollBackImport) {
									for (var i = 0; i < courseCodesToImport.length; i++) {
										courseCodesToImport[i].deleteRecord();
									}
								} else {
									for (var i = 0; i < courseCodesToImport.length; i++) {
										console.log("trying to save");
										courseCodesToImport[i].save();
									}
								}
							}
							break;
						// case ImportState.STUDENT:
						// 	break;
						case ImportState.HIGHSCHOOL:	
						if (secondarySchoolVerification(worksheet)) {
							var rollBackImport = false;
							var doneImporting = false;
							var highSchoolsToImport = [];
							var uniqueHighSchoolNames = [];
							for (var i = 2; !doneImporting; i++) {
									//get the next hs name
									var highSchool = worksheet['A' + i];
									//if the hs exists
									if (highSchool) {
										//gets the highSchoolNameString
										var highSchoolName = highSchool.v;
										console.log(highSchoolName);
										//if the hs has already been added
										if (uniqueHighSchoolNames.includes(highSchoolName)) {
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate course code names '" + highSchoolName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new hs object
											highSchoolsToImport[i - 2] = self.get('store').createRecord('high-school', 
											{
												schoolName: highSchoolName
											});
											uniqueHighSchoolNames[i] = highSchoolName;
										}
									} else {
										doneImporting = true;
										//if no hs was imported
										if (i == 2) {
											rollBackImport = true;
											DisplayErrorMessage("File does not contain any Values...")
										}
									}
								}
								//delete high schools from the store
								if (rollBackImport) {
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										highSchoolsToImport[i].deleteRecord();
									}
								} else {
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										console.log("trying to save");
										highSchoolsToImport[i].save();
									}
								}
							}
							break;
							case ImportState.STUDENT:
							console.log("In student import");
							var mutex = Mutex.create();
							var savingMutex = Mutex.create();
							var deleteMutex = Mutex.create();
							if (studentVerification(worksheet))
							{
								console.log("validated student import");
								var rollBackImport = false;
								var doneImporting = false;
								var startedSave = false;
								var startedRollback = false;
								var studentsToImport = [];
								var uniqueStudentNumbers = [];
								var numberOfStudent = -1;
								for (var i = 2; !doneImporting; i++)
								{
									console.log("in the loop at i = " + i);
									var studentSheetA = worksheet['A' + i];
									var studentSheetB = worksheet['B' + i];
									var studentSheetC = worksheet['C' + i];
									var studentSheetD = worksheet['D' + i];
									var studentSheetE = worksheet['E' + i];
									var studentSheetF = worksheet['F' + i];
									if (studentSheetA && studentSheetB && studentSheetC && studentSheetD && studentSheetE && studentSheetF)
									{
										console.log("values exist");
										if (uniqueStudentNumbers.includes(studentSheetA.v))
										{
											console.log("duplicate value");
											rollBackImport = true;
											doneImporting = true;
											DisplayErrorMessage("Imported file contains duplicate records for student number " + studentNumber.v);
										}
										else
										{
											console.log("not duplicates");
											uniqueStudentNumbers[i - 2] = studentSheetA.v;
											//query res by id then gender then create student
											mutex.lock(function(){
												var inMutexIndex = i;
												var studentNumber = studentSheetA.v;
												var firstName = studentSheetB.v;
												var lastName = studentSheetC.v;
												var gender = studentSheetD.v;
												var dateOfBirth = studentSheetE.w;
												var residency = studentSheetF.v;
												self.get('store').queryRecord('gender', {name: gender}).then(function(genderObj) {
													//console.log("got gender: ");
													//console.log(genderObj);
													self.get('store').queryRecord('residency', {name: residency}).then(function(residencyObj) {
														//console.log("got resicdency");
														//console.log(residencyObj);
														var newStudent = self.get('store').createRecord('student', {
															studentNumber: studentNumber,
															firstName: firstName,
															lastName: lastName,
															DOB: dateOfBirth
														});
														newStudent.set('resInfo',residencyObj);
														newStudent.set('gender', genderObj);
														studentsToImport[inMutexIndex - 2] = newStudent;
														deleteMutex.lock(function() {
															if (doneImporting && rollBackImport && !startedRollback && studentsToImport.length === numberOfStudent)
															{
																startedRollback = true;
																for (var j = 0; j < studentsToImport.length; j++)
																{
																	studentsToImport[j].destroyRecord();
																}
															}	
														})
														savingMutex.lock(function() {
															if (doneImporting && studentsToImport.length === numberOfStudent && !startedSave)
															{
																startedSave = true;
																console.log("trying to save!")
																for (var j = 0; j < studentsToImport.length; j++)
																{
																	studentsToImport[j].save();
																}
															}
														});
													});
												});
											});
										}
									}
									else
									{
										doneImporting = true;
										if (studentSheetA || studentSheetB || studentSheetC || studentSheetD || studentSheetE || studentSheetF)
										{
											rollBackImport = true;
											DisplayErrorMessage("Imported file contains records with missing information on row" + i);
										}
										if (i === 2)
										{
											rollBackImport = true;
											DisplayErrorMessage("Student sheet did not contain any properly formated students students...")
										}
									}
								}
								numberOfStudent = uniqueStudentNumbers.length;
							}
							break;
							case ImportState.HSCOURSEINFO:
							{
								if (studentHighSchoolVerification(worksheet))
								{
									var gradeValues = [];
									var highschoolSubjectValues = [];
									var highschoolCourseValues = [];
									var doneReading = false;
									var rollBackImport = false;

									var currentStudentNumber;
									var currentSchoolName;
									for (var i = 2; !doneReading; i++)
									{
										console.log("in row " + i);
										var studentNumber = worksheet['A' + i];
										var schoolName = worksheet['B' + i];
										var level = worksheet['C' + i];
										var subject = worksheet['D' + i];
										var description = worksheet['E' + i];
										var source = worksheet['F' + i];
										var units = worksheet['G' + i];
										var grade = worksheet['H' + i];


										//if they are at a new student
										if (studentNumber)
										{
											//if there is not school listed throw an error
											if (!schoolName)
											{
												rollBackImport = true;
												doneReading = true;
												DisplayErrorMessage("Improperly formated data in  row " (i - 2));
											}
											//otherwise get data
											else
											{
												currentSchoolName = schoolName.v;
												currentStudentNumber = studentNumber.v;

												//if there is information to include...
												if (!(schoolName.v == "NONE FOUND"))
												{
													gradeValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v};
													if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
													{
														highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
													}
													if (checkUniqueHSCourse(highschoolCourseValues, schoolName.v, level.v, source.v, units.v, subject.v, description.v))
													{
														highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};
													}
												}
											}

										}
										else if (!studentNumber && !schoolName && !level && !subject && !description && !source && !units && !grade)
										{
											console.log("all fields are empty");
											doneReading = true;
										}
										else
										{
											//switching school but not student
											if (schoolName)
											{
												currentSchoolName = schoolName.v;
												gradeValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v};
												if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
												{
													highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
												}
												if (checkUniqueHSCourse(highschoolCourseValues, schoolName.v, level.v, source.v, units.v, subject.v, description.v))
												{
													highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};
												}
											}
											//switching neither school not student
											else
											{
												gradeValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : currentSchoolName, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v};
												if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
												{
													highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
												}
												if (checkUniqueHSCourse(highschoolCourseValues, currentSchoolName, level.v, source.v, units.v, subject.v, description.v))
												{
													highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "schoolName" : currentSchoolName, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};
												}
											}
										}
									}
									console.log(gradeValues);
									if (!rollBackImport)
									{
										var subjectsToImport = [];
										var uniqueSubjects = [];
										var numberOfSubjects = -1;
										var numberOfSubjectsSaved = 0;
										var startedSavingSubjects = false;
										var subjectSavingMutex = Mutex.create();
										for (var i = 0; i < highschoolSubjectValues.length; i++)
										{
											//if the subject has not yet been added create it and then course then grade
											if (!uniqueSubjects.includes(highschoolSubjectValues[i]) && highschoolSubjectValues[i])
											{
												uniqueSubjects[uniqueSubjects.length] = highschoolSubjectValues[i];
												var subjectName = highschoolSubjectValues[i].name;
												var subjectDescription = highschoolSubjectValues[i].description;
												subjectsToImport[subjectsToImport.length] = self.get('store').createRecord('high-school-subject', {
													name: subjectName,
													description: subjectDescription
												});
												subjectsToImport[subjectsToImport.length - 1].save().then(function() {
													numberOfSubjectsSaved++;
													//if the last unique subject has been uploaded
														if (subjectsToImport.length === numberOfSubjects && numberOfSubjectsSaved === numberOfSubjects && !startedSavingSubjects)
														{
															console.log("done saving Subject");
															startedSavingSubjects = true;
															//begin importing the courses
															var coursesToImport = [];
															var uniqueCourses = [];
															var courseMutex = Mutex.create();
															var numberOfCourses = -1;
															var inMutexCount = 0;
															var doneCourseSave = false;
															//loop through each course record
															for (var k = 0; k < highschoolCourseValues.length; k++)
															{

																if (!uniqueCourses.includes(highschoolCourseValues[k]) && highschoolCourseValues[k])
																{
																	//add course to array of unique courses
																	uniqueCourses[uniqueCourses.length] = highschoolCourseValues[k];
																	courseMutex.lock(function() {
																		var inMutexIndex = inMutexCount++;
																		while (!highschoolCourseValues[inMutexIndex])
																		{
																			inMutexIndex = inMutexCount++;
																		}
																		if (highschoolCourseValues[inMutexIndex])
																		{
																			var courseSchoolName = highschoolCourseValues[inMutexIndex].schoolName;
																			var courseLevel = highschoolCourseValues[inMutexIndex].level;
																			var courseUnit = highschoolCourseValues[inMutexIndex].unit;
																			var courseSource = highschoolCourseValues[inMutexIndex].source;
																			var subjectNameParam = highschoolCourseValues[inMutexIndex].name;
																			var subjectDescParam = highschoolCourseValues[inMutexIndex].description;
																			self.get('store').queryRecord('high-school-subject', {name: subjectNameParam, description: subjectDescParam}).then(function(subjectObj) {
																				self.get('store').queryRecord('high-school', {schoolName: courseSchoolName}).then(function(highSchoolObj) {
																					coursesToImport[coursesToImport.length] = self.get('store').createRecord('high-school-course', {
																						level: courseLevel,
																						unit: courseUnit,
																						source: courseSource
																						//Once the course is created
																					});
																					coursesToImport[coursesToImport.length - 1].set('school', highSchoolObj);
																					coursesToImport[coursesToImport.length - 1].set('subject', subjectObj);
																					coursesToImport[coursesToImport.length - 1].save().then(function() {
																							if (coursesToImport.length === numberOfCourses && !doneCourseSave)
																							{
																								console.log("done saving courses");
																								doneCourseSave = true;
																								var courseGradesToImport = [];
																								var uniqueCourseGrades = [];
																								var gradeMutex = Mutex.create();
																								var numberOfGrades = -1;
																								var inGradeMutexCount = 0;
																								var doneGradeImport = false;
																								//import grades here
																								for (var n = 0; n < gradeValues.length; n++)
																								{
																									if (!uniqueCourseGrades.includes(gradeValues[n]) && gradeValues[n])
																									{
																										uniqueCourseGrades[uniqueCourseGrades.length] = gradeValues[n];
																										gradeMutex.lock(function() {
																											var inGradeMutexIndex = inGradeMutexCount++;
																											while (!gradeValues[inGradeMutexIndex])
																											{
																												inGradeMutexIndex = inGradeMutexCount++;
																											}
																											
																											var gradeCourseSchoolName = gradeValues[inGradeMutexIndex].schoolName;
																											var gradeCourseLevel = gradeValues[inGradeMutexIndex].level;
																											var gradeCourseUnit = gradeValues[inGradeMutexIndex].unit;
																											var gradeCourseSource = gradeValues[inGradeMutexIndex].source;
																											var gradeSubjectNameParam = gradeValues[inGradeMutexIndex].name;
																											var gradeSubjectDescParam = gradeValues[inGradeMutexIndex].description;
																											var gradeStudentNumber = gradeValues[inGradeMutexIndex].studentNumber;
																											var recordGrade = gradeValues[inGradeMutexIndex].grade;
																											console.log(recordGrade);
																											self.get('store').queryRecord('student', {number: gradeStudentNumber}).then(function(studentObj) {
																												var studentNumberID = studentObj.id;
																												self.get('store').queryRecord('high-school-course', {schoolName: gradeCourseSchoolName, subjectName: gradeSubjectNameParam, subjectDescription: gradeSubjectDescParam,  level: gradeCourseLevel, source: gradeCourseSource, unit: gradeCourseUnit}).then(function(highSchoolCourseObj) {
																													var courseID = highSchoolCourseObj.id;
																													courseGradesToImport[courseGradesToImport.length] = self.get('store').createRecord('high-school-grade', {
																														mark: recordGrade
																													});
																													courseGradesToImport[courseGradesToImport.length - 1].set('student', studentObj);
																													courseGradesToImport[courseGradesToImport.length - 1].set('source', highSchoolCourseObj);
																													courseGradesToImport[courseGradesToImport.length - 1].save();
																												});
																											});

																										});
																									}
																								}
																							}
																					});
																				});
																			});
																		}
																	});
																}
															}
															numberOfCourses = uniqueCourses.length
														}
												});
											}
										}
										numberOfSubjects = uniqueSubjects.length;
									}
								}
								break;
								}
							case ImportState.RECORDPLANS:
							{
								console.log("in records plans");
								//Unique terms 
								//Unique Program REcords 
								//Unique Plan codes
								if (UndergraduateRPVerification(worksheet))
								{
									console.log("successful verification");
									var termValues = [];
									var programValues = [];
									var planValues = [];
									var doneReading = false;
									var rollbackImport = false;

									var currentStudentNumber = "";
									var currentTerm = "";
									var currentProgram = "";
									var currentLevel = "";
									var currentLoad = "";

									for (var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A' + i];
										var term = worksheet['B' + i];
										var program = worksheet['C' + i];
										var level = worksheet['D' + i];
										var load = worksheet['E' + i];
										var plan = worksheet['F' + i];

										//this means the reading is done
										if (!plan)
										{
											console.log("there was no plan");
											if (i === 2)
											{
												DisplayErrorMessage("Sheet does not contain any properly formated data");
												rollbackImport = true;
											}
											doneReading = true;
										}
										//new student number
										else if (studentNumber && studentNumber.v !== "")
										{
											//if there is a missing field then the data is invalid
											if (!term || !program || !level || !load || !plan || term.v == "" || program.v == "" || level.v === "" || load.v == "" || plan.v == "")
											{
												rollbackImport = true;
												doneReading = true;
												DisplayErrorMessage("Imporperly formated data on row " + i);
											}
											//populate new value fields for proper data
											else
											{
												//set the current values
												currentStudentNumber = studentNumber.v;
												currentTerm = term.v;
												currentProgram = program.v;
												currentLevel = level.v;
												currentLoad = load.v;
												//if all fields are unique then there is a new plan
												if (checkUniquePlan(planValues, studentNumber.v, term.v, program.v, level.v, load.v, plan.v))
												{
													planValues[planValues.length] = {"studentNumber": studentNumber.v, "term": term.v, "program": program.v, "level": level.v, "load": load.v, "plan": plan.v};
													
													//if all fields but the plan is unique then there is a new program
													if (checkUniqueProgram(programValues, studentNumber.v, term.v, program.v, level.v, load.v))
													{
														programValues[programValues.length] = {"studentNumber": studentNumber.v, "term": term.v, "program": program.v, "level": level.v, "load": load.v};
														
														//if the term and student number is unique then there is a new term to import
														if (checkUniqueTerm(termValues, studentNumber.v, term.v))
														{
															termValues[termValues.length] = {"studentNumber" : studentNumber.v, "termCode": term.v};
														}
													}
												}

											}
										}
										//if the student number is the same but term is different
										else if (term && term.v != "")
										{
											//if there is a missing field then the data is invalid
											if (!program || !level || !load || !plan || program.v == "" || level.v === "" || load.v == "" || plan.v == "")
											{
												DisplayErrorMessage("Imporperly formated data on row " + i);
												rollbackImport = true;
												doneReading = true;
											}
											else
											{
												//set the current values
												currentTerm = term.v;
												currentProgram = program.v;
												currentLevel = level.v;
												currentLoad = load.v;
												//if all fields are unique then there is a new plan
												if (checkUniquePlan(planValues, currentStudentNumber, term.v, program.v, level.v, load.v, plan.v))
												{
													planValues[planValues.length] = {"studentNumber": currentStudentNumber, "term": term.v, "program": program.v, "level": level.v, "load": load.v, "plan": plan.v};
													
													//if all fields but the plan is unique then there is a new program
													if (checkUniqueProgram(programValues, currentStudentNumber, term.v, program.v, level.v, load.v))
													{
														programValues[programValues.length] = {"studentNumber": currentStudentNumber, "term": term.v, "program": program.v, "level": level.v, "load": load.v};
														
														//if the term and student number is unique then there is a new term to import
														if (checkUniqueTerm(termValues, currentStudentNumber, term.v))
														{
															termValues[termValues.length] = {"studentNumber" : currentStudentNumber, "termCode": term.v};
														}
													}
												}
											}
										}
										//if there is a new program
										else if (program && program.v != "")
										{
											//if there is a missing field then the data is invalid
											if (!level || !load || !plan || level.v === "" || load.v == "" || plan.v == "")
											{
												DisplayErrorMessage("Imporperly formated data on row " + i);
												rollbackImport = true;
												doneReading = true;
											}
											else
											{
												//set the current values
												currentProgram = program.v;
												currentLevel = level.v;
												currentLoad = load.v;
												//if all fields are unique then there is a new plan
												if (checkUniquePlan(planValues, currentStudentNumber, currentTerm, program.v, level.v, load.v, plan.v))
												{
													planValues[planValues.length] = {"studentNumber": currentStudentNumber, "term": currentTerm, "program": program.v, "level": level.v, "load": load.v, "plan": plan.v};
													
													//if all fields but the plan is unique then there is a new program
													if (checkUniqueProgram(programValues, currentStudentNumber, currentTerm, program.v, level.v, load.v))
													{
														programValues[programValues.length] = {"studentNumber": currentStudentNumber, "term": currentTerm, "program": program.v, "level": level.v, "load": load.v};
														
													}
												}
											}
										}
										//plan must be the only field
										else
										{
											//if there is a field in load or level then the data is invalid
											if (level && level.v !== "" || load && load.v != "")
											{
												DisplayErrorMessage("Imporperly formated data on row " + i);
												rollbackImport = true;
												doneReading = true;
											}
											else
											{
												//if all fields are unique then there is a new plan
												if (checkUniquePlan(planValues, currentStudentNumber, currentTerm, currentProgram, currentLevel, currentLoad, plan.v))
												{
													planValues[planValues.length] = {"studentNumber": currentStudentNumber, "term": currentTerm, "program": currentProgram, "level": currentLevel, "load": currentLoad, "plan": plan.v};
													
												}
											}
										}
									}
									//done reading the files
									//if the import was successful
									if (!rollbackImport)
									{
										//start importing

										var inMutexIndex = 0;
										var termMutex = Mutex.create();
										var savingTermMutex = Mutex.create();
										var startedSavingTerms = false;
										var termsToimport = [];
										console.log(termValues);
										for (var i = 0; i < termValues.length; i++)
										{
											termMutex.lock(function() {
												var inMutexCountIndex = inMutexIndex++	
												var termStudentNumber = termValues[inMutexCountIndex].studentNumber;								
												self.get('store').queryRecord('student', {
													number: termStudentNumber
												}).then(function(studentObj) {	
													var termName = termValues[inMutexCountIndex].termCode;										
													var newTermToImport = self.get('store').createRecord('term-code', {
														name: termName
													});
													newTermToImport.set('student', studentObj);
													termsToimport[termsToimport.length] = newTermToImport;
													newTermToImport.save().then(function() {
														//wait until all terms have been uploaded
														savingTermMutex.lock(function() {															
															if (termValues.length === termsToimport.length && !startedSavingTerms)
															{
																startedSavingTerms = true;
																console.log("done saving new term codes");
																//now we start saving programs

																var inProgramMutexIndex = 0;
																var programMutex = Mutex.create();
																var savingProgramMutex = Mutex.create();
																var startedSavingPrograms = false;
																var programsToImport = [];
																
																for (var j = 0; j < programValues.length; j++)
																{
																	programMutex.lock(function() {
																		var inProgramMutexCountIndex = inProgramMutexIndex++;
																		var programStudentNumber = programValues[inProgramMutexCountIndex].studentNumber;
																		var programTerm = programValues[inProgramMutexCountIndex].term;
																		var programName = programValues[inProgramMutexCountIndex].program;
																		var programLevel = programValues[inProgramMutexCountIndex].level;
																		var programLoad = programValues[inProgramMutexCountIndex].load;
																		self.get('store').queryRecord('term-code', {
																			studentNumber: programStudentNumber,
																			name: programTerm
																		}).then(function(termNameObj) {
																			var newProgramToImport = self.get('store').createRecord('program-record', {
																				name: programName,
																				level: programLevel,
																				load: programLoad
																			});
																			newProgramToImport.set('termCode', termNameObj);
																			programsToImport[programsToImport.length] = newProgramToImport;
																			programsToImport[programsToImport.length - 1].save().then(function() {
																				savingProgramMutex.lock(function() {
																					if (programsToImport.length === programValues.length && !startedSavingPrograms)
																					{
																						startedSavingPrograms = true;
																						console.log("done saving programs");

																						//now we save plans...
																						var inPlanMutexIndex = 0;
																						var planMutex = Mutex.create();
																						for (var k = 0; k < planValues.length; k++)
																						{
																							planMutex.lock(function() {																											
																								var inPlanMutexCountIndex = inPlanMutexIndex++;
																								var planStudentNumber = planValues[inPlanMutexCountIndex].studentNumber;
																								var planTerm = planValues[inPlanMutexCountIndex].term;
																								var planProgramName = planValues[inPlanMutexCountIndex].program;
																								var planLevel = planValues[inPlanMutexCountIndex].level;
																								var planLoad = planValues[inPlanMutexCountIndex].load;
																								var planName = planValues[inPlanMutexCountIndex].plan;
																								self.get('store').queryRecord('program-record', {
																									studentNumber: planStudentNumber,
																									termName: planTerm,
																									programName: planProgramName,
																									level: planLevel,
																									load: planLoad
																								}).then(function(programRecordObj) {
																									var newPlanToImport = self.get('store').createRecord('plan-code', {
																										name: planName
																									});
																									newPlanToImport.set('programRecord', programRecordObj);
																									newPlanToImport.save();
																								});

																							});
																						}
																					}
																				});
																			});
																		});

																	});
																}
															}

														});
													});
												});
											});
										
										//import terms, then programs, then plans
										}
									}
								}
								break;
							}
							case ImportState.RECORDGRADES:
							{
								console.log("in recordGrades");

								var currentStudentNumber = "";
								var currentTerm = "";
								var gradesToImport = [];
								var doneReading = false;
								var rollBackImport = false;

								for (var i = 2; !doneReading; i++)
								{									
									var studentNumber = worksheet['A' + i];
									var term = worksheet['B' + i];
									var courseLetter = worksheet['C' + i];
									var courseNumber = worksheet['D' + i];
									var courseGrade = worksheet['F' + i];
									var courseNote = worksheet['G' + i];

									//if there is a new student
									if (studentNumber && studentNumber.v != "")
									{
										console.log("changin current students");
										if (term && courseLetter && courseNumber && courseGrade)
										{
											currentStudentNumber = studentNumber.v;
											currentTerm = term.v;
											console.log(currentStudentNumber);
											console.log(currentTerm);
											if (courseNote)
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": term.v, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v};
											}
											else
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": term.v, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v};

											}
										}
										//improper data
										else
										{
											DisplayErrorMessage("Improperly formatted data on row " + (i));
											rollBackImport = true;
											doneReading = true;
										}
									}
									//if it is the same student in a different term
									else if (term && term.v != "")
									{
										console.log("changing term");
										if (courseLetter && courseNumber && courseGrade && currentStudentNumber != "")
										{
											currentTerm = term.v;
											console.log(currentTerm);
											if (courseNote)
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v};
											}
											else
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v};

											}
										}
										//improper data
										else
										{
											DisplayErrorMessage("Improperly formatted data on row " + (i));
											rollBackImport = true;
											doneReading = true;
										}


									}
									//if it is the same student and term
									else
									{
										if (courseLetter && courseNumber && courseGrade && currentTerm != "" && currentStudentNumber != "")
										{
											if (courseNote)
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v};
											}
											else
											{
												gradesToImport[i - 2] = {"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v};

											}
										}
										//this is the end of the sheet
										else
										{
											
											doneReading = true;
										}
									}
								}
								if (!rollBackImport)
								{
									console.log("done reading");
									console.log(gradesToImport);
									var inGradeMutexIndex = 0;
									var gradeMutex = Mutex.create();
									for (var i = 0; i < gradesToImport.length; i++)
									{										
										gradeMutex.lock(function() {
											var inGradeMutexCount = inGradeMutexIndex++;
											var termCode = gradesToImport[inGradeMutexCount].term;
											var studentNumber = gradesToImport[inGradeMutexCount].studentNumber;
											var courseLetter = gradesToImport[inGradeMutexCount].courseLetter;
											var courseNumber = gradesToImport[inGradeMutexCount].courseNumber;
											var courseGrade = gradesToImport[inGradeMutexCount].courseGrade;
											var courseNote = gradesToImport[inGradeMutexCount].courseNote;
											self.get('store').queryRecord('term-code', {
												studentNumber: studentNumber,
												name: termCode
											}).then(function(termCodeObj) {
												self.get('store').queryRecord('course-code', {
													courseLetter: courseLetter,
													courseNumber: courseNumber
												}).then(function(courseCodeObj) {
													var newGrade = self.get('store').createRecord('grade', {
														mark: courseGrade
													});
													console.log(termCodeObj);
													console.log(courseCodeObj);
													newGrade.set('termCode', termCodeObj);
													newGrade.set('courseCode', courseCodeObj);
													if (courseNote)
													{
														newGrade.set('note', courseNote);
													}
													newGrade.save();
												});
											});
										});									
									}
								}

								//iterate through each row
								//qeury term code with SN and Term Name for TC 
								//query courseCode with courseLetter and CourseName for CC 


								break;
							}
							default:
							break;
						}
						console.log(currentWorkSheet);
					};
					reader.readAsBinaryString(f);
				}
			},

			setIndex(index)
			{
				console.log(index);
				this.set('changingIndex',index);
				console.log("index is now " + this.get('changingIndex'));
			},	
			continue(){
				this.set('changingIndex', this.get('changingIndex')+1);
				switch(this.get('changingIndex')){
					case 2:
						$("#residencies").addClass("active");
						$("#gender").removeClass("active");
						$("#gender").addClass("completed");
						break;
					case 3:
						$("#termCodes").addClass("active");
						$("#residencies").removeClass("active");
						$("#residencies").addClass("completed");
						break;
					case 4:
						$("#courseCodes").addClass("active");
						$("#termCodes").removeClass("active");
						$("#termCodes").addClass("completed");
						break;
					case 5:
						$("#students").addClass("active");
						$("#courseCodes").removeClass("active");
						$("#courseCodes").addClass("completed");
						break;
					case 6:
						$("#secondary").addClass("active");
						$("#students").removeClass("active");
						$("#students").addClass("completed");
						break;
					case 7:
						$("#highschool").addClass("active");
						$("#secondary").removeClass("active");
						$("#secondary").addClass("completed");
						break;
					case 8:
						$("#awards").addClass("active");
						$("#highschool").removeClass("active");
						$("#highschool").addClass("completed");
						break;
					case 9:
						$("#advancedStandings").addClass("active");
						$("#awards").removeClass("active");
						$("#awards").addClass("completed");
						break;
					case 10:
						$("#recordPlans").addClass("active");
						$("#advancedStandings").removeClass("active");
						$("#advancedStandings").addClass("completed");
						break;
					case 11:
						$("#courseGrades").addClass("active");
						$("#recordPlans").removeClass("active");
						$("#recordPlans").addClass("completed");
						break;
					case 12:
						$("#courseGrades").removeClass("active");
						$("#courseGrades").addClass("completed");
						break;
				}
		}	

		}
	});
