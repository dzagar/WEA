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

function DisplayErrorMessage(message)
{
	console.log(message);
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
							if (courseCodeVerification(worksheet)) {
								var rollBackImport = false;
								var doneImporting = false;
								var courseCodesToImport = [];
								var uniqueCourseCodeNames = [];
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
										if (uniqueCourseCodeNames.includes(courseCodeName)) {
											DisplayErrorMessage("Import cancelled. Your excel sheet contains duplicate course code names '" + courseCodeName + "'");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new course code object
											courseCodesToImport[i - 2] = self.get('store').createRecord('course-code', 
											{
												courseLetter: courseCodeLetter,
												courseNumber: courseCodeNum,
												name: courseCodeName,
												unit: courseCodeUnit
											});
											uniqueCourseCodeNames[i] = courseCodeName;
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
															gender: genderObj.id,
															DOB: dateOfBirth,
															resInfo: residencyObj.id
														});
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
									var studentNumberValues = [];
									var studentNumberIndexes = [];
									var schoolNameValues = [];
									var schoolNameIndexes = [];
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
											console.log("new student importing");
											//if there is not school listed throw an error
											if (!schoolName)
											{
												console.log("no schoolname");
												rollBackImport = true;
												doneReading = true;
												DisplayErrorMessage("Improperly formated data in  row " (i - 2));
											}
											//otherwise get data
											else
											{
												currentSchoolName = schoolName.v;
												currentStudentNumber = studentNumber.v;
												console.log("adding new student and new school");
												//gets indexes and values for later when importing
												studentNumberValues[studentNumberValues.length] = studentNumber.v;
												studentNumberIndexes[studentNumberValues.length] = i - 2;
												schoolNameValues[schoolNameValues.length] = schoolName.v;
												schoolNameIndexes[schoolNameIndexes.length] = i - 2;

												//if there is information to include...
												if (!(schoolName.v == "NONE FOUND"))
												{
													gradeValues[i - 2] = {"grade": grade.v};
													highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
													highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "grade": grade, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};
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
												console.log("adding course/subject for existing student and school");
												gradeValues[i] = {"grade": grade};
												highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
												highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "grade": grade, "schoolName" : schoolName.v,"level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};
											}
											//switching neither school not student
											else
											{
												console.log("adding course/subject for existing student and school");
												gradeValues[i - 2] = {"grade": grade};
												highschoolSubjectValues[i - 2] = {"name" : subject.v, "description": description.v};
												highschoolCourseValues[i - 2] = {"studentNumber": currentStudentNumber, "grade": grade, "schoolName" : currentSchoolName,"level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v};

											}
										}
									}
									if (!rollBackImport)
									{
										console.log("in import for highscoolInfo!");
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
												console.log("importing for " + i);
												console.log(highschoolSubjectValues[i]);
												uniqueSubjects[uniqueSubjects.length] = highschoolSubjectValues[i];
												var subjectName = highschoolSubjectValues[i].name;
												var subjectDescription = highschoolSubjectValues[i].description;
												subjectsToImport[subjectsToImport.length] = self.get('store').createRecord('high-school-subject', {
													name: subjectName,
													description: subjectDescription
												});
												subjectsToImport[subjectsToImport.length - 1].save().then(function() {
													numberOfSubjectsSaved++;
													console.log("created a subject");
													//if the last unique subject has been uploaded
														if (subjectsToImport.length === numberOfSubjects && numberOfSubjectsSaved === numberOfSubjects && !startedSavingSubjects)
														{
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
																	console.log("in a unique course");
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
																			console.log(highschoolCourseValues[inMutexIndex]);
																			var courseSchoolName = highschoolCourseValues[inMutexIndex].schoolName;
																			var courseLevel = highschoolCourseValues[inMutexIndex].level;
																			var courseUnit = highschoolCourseValues[inMutexIndex].unit;
																			var courseSource = highschoolCourseValues[inMutexIndex].source;
																			var subjectNameParam = highschoolCourseValues[inMutexIndex].name;
																			var subjectDescParam = highschoolCourseValues[inMutexIndex].description;
																			self.get('store').queryRecord('high-school-subject', {name: subjectNameParam, description: subjectDescParam}).then(function(subjectObj) {
																				var subjectID = subjectObj.id;
																				self.get('store').queryRecord('high-school', {schoolName: courseSchoolName}).then(function(highSchoolObj) {
																					var highSchoolID = highSchoolObj.id;
																					coursesToImport[coursesToImport.length] = self.get('store').createRecord('high-school-course', {
																						level: courseLevel,
																						unit: courseUnit,
																						source: courseSource,
																						school: highSchoolID,
																						subject: subjectID
																						//Once the course is created
																					});
																					coursesToImport[coursesToImport.length - 1].save().then(function() {
																							if (coursesToImport.length === numberOfCourses && !doneCourseSave)
																							{
																								doneCourseSave = true;
																								var courseGradesToImport = [];
																								var uniqueCourseGrades = [];
																								var gradeMutex = Mutex.create();
																								var numberOfGrades = -1;
																								var inGradeMutexCount = 0;
																								var doneGradeImport = false;
																								//import grades here
																								for (var n = 0; n < highschoolCourseValues.length; n++)
																								{
																									if (!uniqueCourseGrades.includes(highschoolCourseValues[n]) && highschoolCourseValues[n])
																									{
																										console.log("in a unique grade");
																										uniqueCourseGrades[uniqueCourseGrades.length] = highschoolCourseValues[n];
																										gradeMutex.lock(function() {
																											var inGradeMutexIndex = inGradeMutexCount++;
																											while (!highschoolCourseValues[inGradeMutexIndex])
																											{
																												inGradeMutexIndex = inGradeMutexCount++;
																											}
																											
																											console.log(highschoolCourseValues[inGradeMutexIndex]);
																											var gradeCourseSchoolName = highschoolCourseValues[inGradeMutexIndex].schoolName;
																											var gradeCourseLevel = highschoolCourseValues[inGradeMutexIndex].level;
																											var gradeCourseUnit = highschoolCourseValues[inGradeMutexIndex].unit;
																											var gradeCourseSource = highschoolCourseValues[inGradeMutexIndex].source;
																											var gradeSubjectNameParam = highschoolCourseValues[inGradeMutexIndex].name;
																											var gradeSubjectDescParam = highschoolCourseValues[inGradeMutexIndex].description;
																											var gradeStudentNumber = highschoolCourseValues[inGradeMutexIndex].studentNumber;
																											var recordGrade = highschoolCourseValues[inGradeMutexIndex].grade;
																											self.get('store').queryRecord('student', {studentNumber: gradeStudentNumber}).then(function(studentObj) {
																												self.get('store').queryRecord('high-school-course', {schoolName: gradeCourseSchoolName, subjectName: gradeSubjectNameParam, subjectDescription: gradeSubjectDescParam,  level: gradeCourseLevel, source: gradeCourseSource, unit: gradeCourseUnit}).then(function(highSchoolCourseObj) {
																													var studentNumberID = studentObj.id;
																													var courseID = highSchoolCourseObj.id;
																													courseGradesToImport[courseGradesToImport.length] = self.get('store').createRecord('high-school-grade', {
																														mark: recordGrade,
																														student: studentNumberID,
																														source: courseID
																													});
																													courseGradesToImport[courseGradesToImport.length].save();
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
																	//get the subject reference for the course
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
