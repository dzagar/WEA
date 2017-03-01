import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';
import Mutex from 'ember-mutex';

var ImportState = {
	GENDER : 1,
	RESIDENCY : 2,
	COURSECODE : 3,
	STUDENT : 4,
	SCHOLARSHIPS : 5,
	ADVANCEDSTANDINGS : 6,
	REGISTRATIONCOMMENTS : 7,
	BASISOFADMISSION : 8,
	ADMISSIONAVERAGE : 9,
	ADMISSIONCOMMENTS : 10,
	HIGHSCHOOL : 11,
	HSCOURSEINFO : 12,
	RECORDPLANS : 13,
	RECORDGRADES : 14,
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

function VerificationFunction(sourceArray,newArray)
{
	for(var i=0;i<newArray.length;i++) //go through the arrays and compare values, any non-matching values create an error 
	{
		if(sourceArray[i]!=newArray[i])
		{
			console.log("There was an error in the '"+sourceArray[i]+"' header! Your current value is: '"+newArray[i]+"'. Please fix this before re-importing!");
			return false;
		}
	}

	return true;
}

export default Ember.Component.extend({
	
	store: Ember.inject.service(),
	showDeleteConfirmation: false,
	importData: false,
	changingIndex: 1,
	fileFormat: "The file must have one header with the title <b>'name'</b>.",
	fileOutput: "",

	clearOutput: function() {
		this.set('fileOutput', "");

	},
	pushOutput: function(newLine) {
		var lineToAdd = this.get('fileOutput') + "</br>" + newLine;
		this.set('fileOutput', lineToAdd);
	},
	setOutput: function(newOutput) {
		this.set('fileOutput', newOutput);
		
	},
	changeHeaderRequirements: function(newHeader) {
		this.set('fileFormat', newHeader);
	},	
	actions: {
		showEraseDataModal: function(){
			this.set('showDeleteConfirmation', true);
		},
		changeFile() {
			this.setOutput("");
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
						var genderCheckerArray=['NAME'];
						var genderArray=[worksheet['A1'].v.toUpperCase()];
						if (VerificationFunction(genderCheckerArray,genderArray)){
							self.setOutput("Importing new student genders");
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
											self.pushOutput("<font color='red'>Import cancelled. Your excel sheet contains duplicate gender names '" + genderName + "'</font>");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new gender object
											gendersToImport[i - 2] = self.get('store').createRecord('gender', 
											{
												name: genderName
											});
											uniqueGenderNames[i-2] = genderName;
										}
									} else {
										doneImporting = true;
										//if no gender was imported
										if (i == 2) {
											rollBackImport = true;
											self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values...</span>")
										}
									}
								}
								//delete genders from the store
								if (rollBackImport) {
									for (var i = 0; i < gendersToImport.length; i++) {
										gendersToImport[i].deleteRecord();
									}
								} else {
									self.pushOutput("Successful read of file has completed. Beginning import of " + gendersToImport.length + " genders.");
									var gendersImportedCount = 0;
									for (var i = 0; i < gendersToImport.length; i++) {
										gendersToImport[i].save().then(function() {
											gendersImportedCount++;
											if (gendersImportedCount == gendersToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import Successful!</span>");
												Ember.$("#btnContinue").removeClass("disabled");
  												Ember.$("#gender").addClass("completed");
											}
										});
									}
								}
							}
							break;
							case ImportState.RESIDENCY:
							var residencyCheckerArray = ['NAME'];
							var residencyArray = [worksheet['A1'].v.toUpperCase()];
							if (VerificationFunction(residencyCheckerArray,residencyArray)) {
								self.setOutput("Importing residencies");
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
											this.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate residency names '" + residencyName + "'</span>");
											rollBackImport = true;
											doneImporting = true;
										} else { //create new residency object
											residenciesToImport[i - 2] = self.get('store').createRecord('residency', 
											{
												name: residencyName
											});
											uniqueResidencyNames[i-2] = residencyName;
										}
									} else {
										doneImporting = true;
										//if no residency was imported
										if (i == 2) {
											rollBackImport = true;
											this.pushOutput("<span style='color:red'>File does not contain any values...</span>")
										}
									}
								}
								//delete residencies from the store
								if (rollBackImport) {
									for (var i = 0; i < residenciesToImport.length; i++) {
										residenciesToImport[i].deleteRecord();
									}
								} else { //save residencies to back-end
									var numberOfResidenciesImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + residenciesToImport.length + " residencies.");
									for (var i = 0; i < residenciesToImport.length; i++) {
										residenciesToImport[i].save().then(function() {
											numberOfResidenciesImported++;
											if (numberOfResidenciesImported === residenciesToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import Successful!</span>");
												Ember.$("#btnContinue").removeClass("disabled");
  												Ember.$("#residencies").addClass("completed");
											}
										});
									}
								}
							}
							break;
							case ImportState.TERMCODE:
							var termcodeCheckerArray = ['NAME'];
							var termcodeArray = [worksheet['A1'].v.toUpperCase()];
							if (VerificationFunction(termcodeCheckerArray,termcodeArray)) {
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
											uniqueTermCodeNames[i-2] = termCodeName;
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

							var coursecodeCheckerArray = ['COURSELETTER','COURSENUMBER','NAME','UNIT'];
							var coursecodeArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),];
							if (VerificationFunction(coursecodeCheckerArray,coursecodeArray)) {
								self.setOutput("Importing Course Codes")
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
											self.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate course codes '" + courseCodeLetter +" "+ courseCodeName + "'</span>");
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
											self.pushOutput("<span style='color:red'>Import Cancelled. File does not contain any values...</span>");
										}
									}
								}
								//delete course codes from the store
								if (rollBackImport) {
									for (var i = 0; i < courseCodesToImport.length; i++) {
										courseCodesToImport[i].deleteRecord();
									}
								} else {
									var numberOfCodesImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + courseCodesToImport.length + " residencies.");
									for (var i = 0; i < courseCodesToImport.length; i++) {
										courseCodesToImport[i].save().then(function() {
											numberOfCodesImported++;
											if (numberOfCodesImported === courseCodesToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import Successful!</span>");
												Ember.$("#btnContinue").removeClass("disabled");
  												Ember.$("#courseCodes").addClass("completed");
											}
										});
									}
								}
							}
							break;
						// case ImportState.STUDENT:
						// 	break;

						case ImportState.HIGHSCHOOL:
						var highschoolCheckerArray = ['SCHOOL NAME'];
						var highschoolArray = [worksheet['A1'].v.toUpperCase()];	
						if (VerificationFunction(highschoolCheckerArray,highschoolArray)) {
							self.setOutput("Importing Secondary School Names");
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
										//if the hs has already been added
										if (uniqueHighSchoolNames.includes(highSchoolName)) {
											self.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate Secondary Schools '" + highSchoolName + "'</span>");
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
											self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values...</span>")
										}
									}
								}
								//delete high schools from the store
								if (rollBackImport) {
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										highSchoolsToImport[i].deleteRecord();
									}
								} else {
									var numberOfHSImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + highSchoolsToImport.length + " Secondary Schools.");
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										highSchoolsToImport[i].save().then(function() {
											numberOfHSImported++;
											if (numberOfHSImported === highSchoolsToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import Successful!</span>");
												Ember.$("#btnContinue").removeClass("disabled");
  												Ember.$("#secondary").addClass("completed");
											}
										});
									}
								}
							}
							break;
							case ImportState.STUDENT:
							var studentCheckerArray = ['STUDENTNUMBER','FIRSTNAME','LASTNAME','GENDER','DOB','RESIDENCY'];
							var studentArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase()];
							
							if (VerificationFunction(studentCheckerArray,studentArray))
							{
								self.setOutput("Importing Students");
								var mutex = Mutex.create();
								var savingMutex = Mutex.create();
								var deleteMutex = Mutex.create();
								var rollBackImport = false;
								var doneImporting = false;
								var startedSave = false;
								var startedRollback = false;
								var inMutexStudentIndex = 0;
								var studentsToImport = [];
								var uniqueStudentNumbers = [];
								var studentsToImportInfo = [];
								var numberOfStudent = -1;
								for (var i = 2; !doneImporting; i++)
								{
									var studentSheetA = worksheet['A' + i];
									var studentSheetB = worksheet['B' + i];
									var studentSheetC = worksheet['C' + i];
									var studentSheetD = worksheet['D' + i];
									var studentSheetE = worksheet['E' + i];
									var studentSheetF = worksheet['F' + i];							
									if (studentSheetA && studentSheetA.v != "" && studentSheetB && studentSheetC && studentSheetD && studentSheetE && studentSheetF)
									{
										if (uniqueStudentNumbers.includes(studentSheetA.v))
										{
											rollBackImport = true;
											doneImporting = true;
											self.pushOutput("<span style='color:red'>Imported file contains duplicate records for student number " + studentNumber.v + "</span>");
										}
										else
										{
											uniqueStudentNumbers.push(studentSheetA.v);
											var formattedDate = new Date(0, 0, studentSheetE.v - 1);
											studentsToImportInfo.push({"studentNumber": studentSheetA.v, "firstName": studentSheetB.v, "lastName": studentSheetC.v, "gender": studentSheetD.v, "dateOfBirth": formattedDate, "residency": studentSheetF.v});
											//query res by id then gender then create student
											mutex.lock(function(){
												
												var inMutexStudentCount = inMutexStudentIndex++;
												var studentNumber = studentsToImportInfo[inMutexStudentCount].studentNumber;
												var firstName = studentsToImportInfo[inMutexStudentCount].firstName;
												var lastName = studentsToImportInfo[inMutexStudentCount].lastName;
												var gender = studentsToImportInfo[inMutexStudentCount].gender;
												var dateOfBirth = studentsToImportInfo[inMutexStudentCount].dateOfBirth;
												var residency = studentsToImportInfo[inMutexStudentCount].residency;
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
														studentsToImport.push(newStudent);
														if (studentsToImport.length === numberOfStudent && !startedSave)
														{
															startedSave = true;
															self.pushOutput("Successful read of file has completed. Beginning import of " + studentsToImport.length + " students");
															var numberOfStudentsImported = 0;
															for (var j = 0; j < studentsToImport.length; j++)
															{
																studentsToImport[j].save().then(function() {
																	numberOfStudentsImported++;
																	if (numberOfStudentsImported === studentsToImport.length)
																	{
																		self.pushOutput("<span style='color:green'>Import Successful!</span>");
																		Ember.$("#btnContinue").removeClass("disabled");
																		Ember.$("#students").addClass("completed");
																	}
																});
															}
														}
														
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
											self.pushOutput("<span style='color:red'>Imported file contains records with missing information on row" + i + "</span>");
										}
										if (i === 2)
										{
											rollBackImport = true;
											self.pushOutput("<span style='color:red'>Student sheet did not contain any properly formated students students...</span>")
										}
									}
								}
								numberOfStudent = uniqueStudentNumbers.length;
							}
							break;
							case ImportState.HSCOURSEINFO:
							{
								var hscourseinfoCheckerArray = ['STUDENTNUMBER','SCHOOLNAME','LEVEL','SUBJECT','DESCRIPTION','SOURCE','UNITS','GRADE'];
								var hscourseinfoArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase(),worksheet['G1'].v.toUpperCase(),worksheet['H1'].v.toUpperCase()];
								if (VerificationFunction(hscourseinfoCheckerArray,hscourseinfoArray))
								{
									self.pushOutput("Importing Student Secondary School Information");
									var gradeValues = [];
									var highschoolSubjectValues = [];
									var highschoolCourseValues = [];
									var doneReading = false;
									var rollBackImport = false;

									var currentStudentNumber;
									var currentSchoolName;
									for (var i = 2; !doneReading; i++)
									{
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
												self.pushOutput("<span style='color:red'>Improperly formated data in  row " (i) + "</span>");
											}
											//otherwise get data
											else if (!(schoolName.v == "NONE FOUND"))
											{
												currentSchoolName = schoolName.v;
												currentStudentNumber = studentNumber.v;

												//if there is information to include...
												if (level && source && units && subject && description && grade)
												{
													gradeValues.push({"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v});
													if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
													{
														highschoolSubjectValues.push({"name" : subject.v, "description": description.v});
													}
													if (checkUniqueHSCourse(highschoolCourseValues, schoolName.v, level.v, source.v, units.v, subject.v, description.v))
													{
														highschoolCourseValues.push({"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v});
													}
												}
												else
												{
													rollBackImport = true;
													doneReading = true;
													self.pushOutput("<span style='color:red'>Improperly formated data in  row " + i + "</span>");
												}
											}

										}
										else if (!studentNumber && !schoolName && !level && !subject && !description && !source && !units && !grade)
										{

											doneReading = true;
										}
										else
										{
											if (level && source && units && subject && description && grade)
											{												
												//switching school but not student
												if (schoolName)
												{
													currentSchoolName = schoolName.v;
													gradeValues.push({"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v});
													if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
													{
														highschoolSubjectValues.push({"name" : subject.v, "description": description.v});
													}
													if (checkUniqueHSCourse(highschoolCourseValues, schoolName.v, level.v, source.v, units.v, subject.v, description.v))
													{
														highschoolCourseValues.push({"studentNumber": currentStudentNumber, "schoolName" : schoolName.v, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v});
													}
												}
												//switching neither school not student
												else
												{
													gradeValues.push({"studentNumber": currentStudentNumber, "schoolName" : currentSchoolName, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v, "grade": grade.v});
													if (checkUniqueSubject(highschoolSubjectValues, subject.v, description.v))
													{
														highschoolSubjectValues.push({"name" : subject.v, "description": description.v});
													}
													if (checkUniqueHSCourse(highschoolCourseValues, currentSchoolName, level.v, source.v, units.v, subject.v, description.v))
													{
														highschoolCourseValues.push({"studentNumber": currentStudentNumber, "schoolName" : currentSchoolName, "level":  level.v, "source": source.v, "unit": units.v, "name" : subject.v, "description": description.v});
													}
												}
											}
											else
											{
												rollBackImport = true;
												doneReading = true;
												self.pushOutput("<span style='color:red'>Improperly formated data in  row " (i) + "</span>");												
											}
										}
									}
									if (!rollBackImport)
									{
										console.log(gradeValues);
										self.pushOutput("Successful read of file has completed. Beginning import of");
										self.pushOutput(highschoolSubjectValues.length + " Subjects");
										self.pushOutput(highschoolCourseValues.length + " Courses");
										self.pushOutput(gradeValues.length + " Grades");
										var numberOfSubjectsSaved = 0;
										var startedSavingSubjects = false;
										var subjectSavingMutex = Mutex.create();
										for (var i = 0; i < highschoolSubjectValues.length; i++)
										{
											var subjectName = highschoolSubjectValues[i].name;
											var subjectDescription = highschoolSubjectValues[i].description;
											var newSubjectToSave = self.get('store').createRecord('high-school-subject', {
												name: subjectName,
												description: subjectDescription
											});
											newSubjectToSave.save().then(function() {
												numberOfSubjectsSaved++;
												subjectSavingMutex.lock(function() {
													if (numberOfSubjectsSaved === highschoolSubjectValues.length && !startedSavingSubjects)
													{
														startedSavingSubjects = true;
														self.pushOutput("<span style='color:green'>Import of subjects successful!</span>");
														//begin importing the courses
														var courseMutex = Mutex.create();
														var numberOfCourses = highschoolCourseValues.length;
														var inMutexCount = 0;
														var doneCourseSave = false;
														var numberOfCourseImported = 0;
														//loop through each course record
														for (var k = 0; k < highschoolCourseValues.length; k++)
														{
															courseMutex.lock(function() {
																var inMutexIndex = inMutexCount++;
																var courseSchoolName = highschoolCourseValues[inMutexIndex].schoolName;
																var courseLevel = highschoolCourseValues[inMutexIndex].level;
																var courseUnit = highschoolCourseValues[inMutexIndex].unit;
																var courseSource = highschoolCourseValues[inMutexIndex].source;
																var subjectNameParam = highschoolCourseValues[inMutexIndex].name;
																var subjectDescParam = highschoolCourseValues[inMutexIndex].description;
																self.get('store').queryRecord('high-school-subject', {name: subjectNameParam, description: subjectDescParam}).then(function(subjectObj) {
																	self.get('store').queryRecord('high-school', {schoolName: courseSchoolName}).then(function(highSchoolObj) {
																		var newCourseToSave = self.get('store').createRecord('high-school-course', {
																			level: courseLevel,
																			unit: courseUnit,
																			source: courseSource
																			//Once the course is created
																		});
																		newCourseToSave.set('school', highSchoolObj);
																		newCourseToSave.set('subject', subjectObj);
																		newCourseToSave.save().then(function() {
																			
																			numberOfCourseImported++;
																			if (numberOfCourseImported === numberOfCourses && !doneCourseSave)
																			{
																				doneCourseSave = true;
																				self.pushOutput("<span style='color:green'>Import of courses successful!</span>");
																				
																				var gradeMutex = Mutex.create();
																				var inGradeMutexCount = 0;
																				var numberOfGradesImported = 0;
																				var doneGradeImport = false;
																				//import grades here
																				for (var n = 0; n < gradeValues.length; n++)
																				{
																					gradeMutex.lock(function() {
																						var inGradeMutexIndex = inGradeMutexCount++;
																																														
																						var gradeCourseSchoolName = gradeValues[inGradeMutexIndex].schoolName;
																						var gradeCourseLevel = gradeValues[inGradeMutexIndex].level;
																						var gradeCourseUnit = gradeValues[inGradeMutexIndex].unit;
																						var gradeCourseSource = gradeValues[inGradeMutexIndex].source;
																						var gradeSubjectNameParam = gradeValues[inGradeMutexIndex].name;
																						var gradeSubjectDescParam = gradeValues[inGradeMutexIndex].description;
																						var gradeStudentNumber = gradeValues[inGradeMutexIndex].studentNumber;
																						var recordGrade = gradeValues[inGradeMutexIndex].grade;
																						self.get('store').queryRecord('student', {number: gradeStudentNumber, findOneStudent: true}).then(function(studentObj) {
																							console.log(studentObj);
																							self.get('store').queryRecord('high-school-course', {schoolName: gradeCourseSchoolName, subjectName: gradeSubjectNameParam, subjectDescription: gradeSubjectDescParam,  level: gradeCourseLevel, source: gradeCourseSource, unit: gradeCourseUnit}).then(function(highSchoolCourseObj) {
																								var courseID = highSchoolCourseObj.id;
																								var newGradeToSave = self.get('store').createRecord('high-school-grade', {
																									mark: recordGrade
																								});
																								newGradeToSave.set('student', studentObj);
																								newGradeToSave.set('source', highSchoolCourseObj);
																								newGradeToSave.save().then(function() {
																									numberOfGradesImported++;
																									if (numberOfGradesImported == gradeValues.length && !doneGradeImport)
																									{
																										doneGradeImport = true;
																										self.pushOutput("<span style='color:green'>Import of grades successful!</span>");
																										self.pushOutput("<span style='color:green'>All Imports successful!</span>");
																										Ember.$("#btnContinue").removeClass("disabled");
																										Ember.$("#highschoolInfo").addClass("completed");
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
														}
													}
												});
											});											
										}
									}
								}
							}
							break;
							case ImportState.RECORDPLANS:
							{
								var recordplansCheckerArray = ['STUDENTNUMBER','TERM','PROGRAM','LEVEL','LOAD','PLAN'];
								var recordplansArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase()];

								if (VerificationFunction(recordplansCheckerArray,recordplansArray))
								{
									self.pushOutput("Importing Program Record Plans")
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
												self.pushOutput("<span style='color:red'>This file does not contain any properly formated data!</span>");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + "</span>");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + "</span>");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + "</span>");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + "</span>");
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
										self.pushOutput("Successful read of file has completed. Beginning import of: ");
										self.pushOutput(planValues.length + " plan codes");
										self.pushOutput(programValues.length + " program record");
										self.pushOutput(termValues.length + " terms");
										var inMutexIndex = 0;
										var termMutex = Mutex.create();
										var savingTermMutex = Mutex.create();
										var startedSavingTerms = false;
										var termsToimport = [];
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
																self.pushOutput("<span style='color:green'>Successfully imported Term Codes!</span>");
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
																						self.pushOutput("<span style='color:green'>Successfully imported Program Records!</span>")

																						var inPlanMutexIndex = 0;
																						var planMutex = Mutex.create();
																						var numberOfPlansSaved = 0;
																						var donePlanImport = false;
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
																									console.log(programRecordObj);
																									newPlanToImport.set('programRecord', programRecordObj);
																									newPlanToImport.save().then(function() {
																										numberOfPlansSaved++;
																										if (numberOfPlansSaved == planValues.length && !donePlanImport)
																										{																											
																											donePlanImport = true;
																											self.pushOutput("<span style='color:green'>Successfully Imported Plan Codes!</span>");
																											self.pushOutput("<span style='color:green'>All Imports successful!</span>");
																											Ember.$("#btnContinue").removeClass("disabled");
																											Ember.$("#recordPlans").addClass("completed");
																										}
																									});
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
								var recordgradesCheckerArray = ['STUDENTNUMBER','TERM','COURSELETTER','COURSENUMBER','SECTION','GRADE','NOTE'];
								var recordgradesArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase(),worksheet['G1'].v.toUpperCase()];
								if(VerificationFunction(recordgradesCheckerArray,recordgradesArray))
								{
									self.pushOutput("Importing Undergraduate Student Grades");
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
											if (term && courseLetter && courseNumber && courseGrade)
											{
												currentStudentNumber = studentNumber.v;
												currentTerm = term.v;
												if (courseNote)
												{
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": term.v, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v});
												}
												else
												{
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": term.v, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v});

												}
											}
											//improper data
											else
											{
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + (i) + "</span>");
												rollBackImport = true;
												doneReading = true;
											}
										}
										//if it is the same student in a different term
										else if (term && term.v != "")
										{
											if (courseLetter && courseNumber && courseGrade && currentStudentNumber != "")
											{
												currentTerm = term.v;
												if (courseNote)
												{
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v});
												}
												else
												{
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v});

												}
											}
											//improper data
											else
											{
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + (i) + "</span>");
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
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v, "courseNote": courseNote.v});
												}
												else
												{
													gradesToImport.push({"studentNumber": currentStudentNumber, "term": currentTerm, "courseLetter": courseLetter.v, "courseNumber": courseNumber.v, "courseGrade": courseGrade.v});

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
										self.pushOutput("Successful read of file has been completed. Beginning import of " + gradesToImport.length + " student grades");
										var inGradeMutexIndex = 0;
										var gradeMutex = Mutex.create();
										var numberOfGradesImported = 0;
										var startedSavingGrades = false;
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
														newGrade.set('termCode', termCodeObj);
														newGrade.set('courseCode', courseCodeObj);
														if (courseNote)
														{
															newGrade.set('note', courseNote);
														}
														newGrade.save().then(function() {
															numberOfGradesImported++;
															if (numberOfGradesImported == gradesToImport.length && !startedSavingGrades)
															{
																startedSavingGrades = true;
																																									
																self.pushOutput("<span style='color:green'>Import of Grades successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#courseGrades").addClass("completed");
															}
														});
													});
												});
											});									
										}
									}
								}
							break;
							}
							case ImportState.SCHOLARSHIPS:
							{
								var scholarshipsCheckerArray = ['STUDENTNUMBER','NOTE'];
								var scholarshipsArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase()];
								if(VerificationFunction(scholarshipsCheckerArray,scholarshipsArray))
								{
									self.pushOutput("Importing Scholarships!");
									var currentStudentNumber = "";
									var scholarshipArray=[];
									var doneReading = false;
									var rollBackImport = false;

									for(var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A' + i];
										var note = worksheet ['B'+ i];

										if(studentNumber && studentNumber.v !="")
										{
											currentStudentNumber= studentNumber.v;

											if(note)
											{
												scholarshipArray.push({"studentNumber":currentStudentNumber, "note": note.v});
											}
											else
											{
												self.pushOutput("improperly formatted data on row" + i);
												rollBackImport = true;
												doneReading = true;
											}
										}
										else if(note && note.v !="")
										{
											scholarshipArray.push({"studentNumber":currentStudentNumber, "note":note.v});
										}
										else
										{
											doneReading = true;
										}
									}

									if(!rollBackImport)
									{
										self.pushOutput("Successful read of file has completed. Beginning import of " + scholarshipArray.length + " student scholarships");
										var scholarshipIndex = 0;
										var scholarshipMutex = Mutex.create();
										var numberOfScholarshipsImported = 0;
										var numberOfScholarShipsCanceled = 0;
										var doneSavingScholarships = false;
										for (var i = 0; i < scholarshipArray.length; i++)
										{										
											scholarshipMutex.lock(function() {
												var scholarshipMutexCount = scholarshipIndex++;
												var studentNumber = scholarshipArray[scholarshipMutexCount].studentNumber;
												var note = scholarshipArray[scholarshipMutexCount].note;
												self.get('store').queryRecord('student',{
													number: studentNumber,
													findOneStudent: true
												}).then(function(studentObj){
													var newScholarshipToImport=self.get('store').createRecord('scholarship', {
														note: note
													});	
													if (studentObj)
													{
														newScholarshipToImport.set('student',studentObj);
														newScholarshipToImport.save().then(function() {
															numberOfScholarshipsImported++;
															if (numberOfScholarshipsImported == scholarshipArray.length - numberOfScholarShipsCanceled && !doneSavingScholarships)
															{
																doneSavingScholarships = true;														
																self.pushOutput("<span style='color:green'>Import of Scholarships successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#awards").addClass("completed");														

															}
														});	
													}
													else
													{
														numberOfScholarShipsCanceled++;
														if (numberOfScholarshipsImported == scholarshipArray.length - numberOfScholarShipsCanceled && !doneSavingScholarships)
														{
															doneSavingScholarships = true;														
															self.pushOutput("<span style='color:green'>Import of Scholarships successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#awards").addClass("completed");														

														}
													}										
												});																		
											});
										}
									}
								}								
							}
							break;
							case ImportState.ADVANCEDSTANDINGS: 
							{
								var advancedstandingsCheckerArray = ['STUDENTNUMBER','COURSE','DESCRIPTION','UNITS','GRADE','FROM'];
								var advancedstandingsArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase()];
								if(VerificationFunction(advancedstandingsCheckerArray,advancedstandingsArray))
								{
									self.pushOutput("Importing Advanced Standings!");
									var currentStudentNumber = "";
									var advancedStandingsToImport = [];
									var doneReading = false;
									var rollBackImport = false;

									for (var i = 2; !doneReading; i++)
									{									
										var studentNumber = worksheet['A' + i];
										var course = worksheet['B' + i];
										var description = worksheet['C' + i];
										var units = worksheet['D' + i];
										var courseGrade = worksheet['E' + i];
										var courseFrom = worksheet['F' + i];

										
										if (studentNumber && studentNumber.v != "")
										{
											if (course.v == "NONE FOUND")
											{

											}
											else if (course && description && units && courseGrade && courseFrom)
											{
												currentStudentNumber = studentNumber.v;										
												advancedStandingsToImport.push({"studentNumber": currentStudentNumber, "course": course.v, "description": description.v, "units": units.v, "courseGrade": courseGrade.v, "courseFrom": courseFrom.v});
												
											}											
											else
											{
												self.pushOutput("<span style='color:red'>Import Cancelled! Improperly formatted data on row " + i + "</span>");
												rollBackImport = true;
												doneReading = true;
											}
										}
										
										//if it is the same student in a different course
										else if (course && course.v != "")
										{
											if (description && units && courseGrade && courseFrom && currentStudentNumber != "")
											{
												advancedStandingsToImport.push({"studentNumber": currentStudentNumber, "course": course.v, "description": description.v, "units": units.v, "courseGrade": courseGrade.v, "courseFrom": courseFrom.v});
											
											}
											//improper data
											else
											{
												self.pushOutput("<span style='color:red'>Import Cancelled! Improperly formatted data on row " + i + "</span>");
												rollBackImport = true;
												doneReading = true;
											}
										}
										else
										{
											doneReading = true;
										}										
									}
									if (!rollBackImport)
									{
										self.pushOutput("Successful read of file has completed. Beginning import of " + advancedStandingsToImport.length + " Advanced Standings.");
										var AdvancedStandingIndex = 0;
										var AdvancedStandingMutex = Mutex.create();
										var advancedStandingsImported = 0;
										var advancedStandingsCancelled = 0;
										var doneSaving = false;
										for (var i = 0; i < advancedStandingsToImport.length; i++)
										{										
											AdvancedStandingMutex.lock(function() {
												var ASMutexCount = AdvancedStandingIndex++;
												var studentNumber = advancedStandingsToImport[ASMutexCount].studentNumber;
												var course = advancedStandingsToImport[ASMutexCount].course;
												var description = advancedStandingsToImport[ASMutexCount].description;
												var units = advancedStandingsToImport[ASMutexCount].units;
												var courseGrade = advancedStandingsToImport[ASMutexCount].courseGrade;
												var courseFrom = advancedStandingsToImport[ASMutexCount].courseFrom;
												self.get('store').queryRecord('student',{
													number: studentNumber,
													findOneStudent: true
												}).then(function(studentObj){
													var AdvancedStanding=self.get('store').createRecord('advanced-standing', {
														course: course,
														description: description,
														units: units,
														grade: courseGrade,
														from: courseFrom
													});	
													if (studentObj)
													{																								
														AdvancedStanding.set('student',studentObj);
														AdvancedStanding.save().then(function() {
															advancedStandingsImported++;
															if (advancedStandingsImported == advancedStandingsToImport.length - advancedStandingsCancelled && !doneSaving)
															{
																doneSaving = true;														
																self.pushOutput("<span style='color:green'>Import of Avanced Standings successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#advancedStandings").addClass("completed");	

															}
														});
													}
													else
													{
														advancedStandingsCancelled++;
														if (advancedStandingsImported == advancedStandingsToImport.length - advancedStandingsCancelled && !doneSaving)
														{
															doneSaving = true;														
															self.pushOutput("<span style='color:green'>Import of Avanced Standings successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#advancedStandings").addClass("completed");	

														}
													}									
												});								
											});
										}
									}
								}								
							}
							break;
							case ImportState.REGISTRATIONCOMMENTS:
							{
								var registrationcommentsCheckerArray = ['STUDENTNUMBER','NOTE'];
								var registrationcommentsArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase()];
								if(VerificationFunction(registrationcommentsCheckerArray,registrationcommentsArray))
								{
									self.pushOutput("Importing Registration Comments");
									var currentStudentNumber = "";
									var doneReading = false;
									var uniqueStudents = [];
									var rollbackImport = false;
									
									for (var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A' + i];
										var note = worksheet['B' + i];

										//if we're on a new student
										if (studentNumber && studentNumber.v != "")
										{
											currentStudentNumber = studentNumber.v;
											uniqueStudents.push({"studentNumber": currentStudentNumber, "note": note.v});

										}
										//if we're on a new note for the same student
										else if (note && note.v != "")
										{
											var newNote = uniqueStudents[uniqueStudents.length - 1].note + note.v;
											uniqueStudents[uniqueStudents.length - 1] = {"studentNumber": currentStudentNumber, "note": newNote};
										}
										//import is done
										else
										{
											doneReading = true;
										}
									}
									//begin importing
									if (!rollbackImport)
									{
										self.pushOutput("Successful read of file has completed. Beginning import of " + uniqueStudents.length + " registration comments");
										var inRegistrationMutexIndex = 0;
										var registrationMutex = Mutex.create();
										var numberOfCommentsImported = 0;
										var doneImportingComments = false;
										var numberOfCommentWithNoStudent = 0;
										for(var i = 0; i < uniqueStudents.length; i++)
										{
											registrationMutex.lock(function() {
												var inRegistrationMutexCount = inRegistrationMutexIndex++;
												var importStudentNumber = uniqueStudents[inRegistrationMutexCount].studentNumber;
												var importNote = uniqueStudents[inRegistrationMutexCount].note;
												self.get('store').queryRecord('student', {number: importStudentNumber, findOneStudent:true}).then(function(studentObj) {
													if (studentObj)
													{
														studentObj.set('registrationComments', importNote);
														studentObj.save().then(function() {
															numberOfCommentsImported++;
															if (numberOfCommentsImported == (uniqueStudents.length - numberOfCommentWithNoStudent) && !doneImportingComments)
															{
																doneImportingComments = true;
																self.pushOutput("<span style='color:green'>Import of Registration Comments successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#registrationComments").addClass("completed");

															}
														});
													}
													else
													{
														numberOfCommentWithNoStudent++;
														if (numberOfCommentsImported == (uniqueStudents.length - numberOfCommentWithNoStudent) && !doneImportingComments)
														{
															doneImportingComments = true;
															self.pushOutput("<span style='color:green'>Import of Registration Comments successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#registrationComments").addClass("completed");

														}
													}
												});
											});
										}
									}

								}
							}
							break;
							case ImportState.BASISOFADMISSION:
							{
								var basisofadmissionCheckerArray = ['STUDENTNUMBER','NOTE'];
								var basisofadmissionArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase()];
								if(VerificationFunction(basisofadmissionCheckerArray,basisofadmissionArray))
								{
									self.setOutput("Importing Basis of Admission.")
									var currentStudentNumber= "";
									var doneReading = false;
									var uniqueStudents = [];
									var rollbackImport = false;

									for(var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A'+ i];
										var note = worksheet['B'+ i];

										if(studentNumber && studentNumber.v!="")
										{
											currentStudentNumber=studentNumber.v;
											uniqueStudents.push({"studentNumber":currentStudentNumber, "note":note.v});
										}

										else if(note && note.v !="")
										{
											var newNote = uniqueStudents[uniqueStudents.length - 1].note + note.v;
											uniqueStudents[uniqueStudents.length - 1]={"studentNumber":currentStudentNumber, "note":newNote};
										}

										else
										{
											doneReading = true;
										}
									}

									if(!rollBackImport)
									{
										self.pushOutput("Successful read of file complete. Beginning import of " + uniqueStudents.length + " Basis of Admissions.");
										var inAdmissionMutexIndex = 0;
										var admissionMutex = Mutex.create();
										var numberOfAdmissionsImported = 0;
										var numberOfAdmissionsWithNoStudent = 0;
										var doneImportingAdmissions = false;
										for(var i = 0; i < uniqueStudents.length; i++)
										{
											admissionMutex.lock(function() {
												var inAdmissionMutexCount = inAdmissionMutexIndex++;
												var importStudentNumber = uniqueStudents[inAdmissionMutexCount].studentNumber;
												var importNote = uniqueStudents[inAdmissionMutexCount].note;
												self.get('store').queryRecord('student', {number: importStudentNumber}).then(function(studentObj) {
													if  (studentObj)
													{														
														studentObj.set('basisOfAdmission', importNote);
														studentObj.save().then(function() {
															numberOfAdmissionsImported++;
															if (numberOfAdmissionsImported == uniqueStudents.length - numberOfAdmissionsWithNoStudent && !doneImportingAdmissions)
															{
																doneImportingAdmissions = true;
																self.pushOutput("<span style='color:green'>Import of Basis of Admissions successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#basisOfAdmission").addClass("completed");
															}
														});
													}
													else{
														numberOfAdmissionsWithNoStudent++;
															if (numberOfAdmissionsImported == uniqueStudents.length - numberOfAdmissionsWithNoStudent && !doneImportingAdmissions)
															{
																doneImportingAdmissions = true;
																self.pushOutput("<span style='color:green'>Import of Basis of Admissions successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#basisOfAdmission").addClass("completed");
															}
													}
												});
											});
										}
									}

								}
							}
							break;
							case ImportState.ADMISSIONAVERAGE:
							{	
								var admissionaverageCheckerArray = ['STUDENTNUMBER','NOTE'];
								var admissionaverageArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase()];
								if(VerificationFunction(admissionaverageCheckerArray,admissionaverageArray))
								{
									self.setOutput("Importing Admission Averages.");
									var currentStudentNumber= "";
									var doneReading = false;
									var uniqueStudents = [];
									var rollbackImport = false;

									for(var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A'+ i];
										var note = worksheet['B'+ i];

										if(studentNumber && studentNumber.v!="")
										{
											currentStudentNumber=studentNumber.v;
											uniqueStudents.push({"studentNumber":currentStudentNumber, "note":note.v});
										}

										else if(note && note.v !="")
										{
											var newNote = uniqueStudents[uniqueStudents.length - 1].note + note.v;
											uniqueStudents[uniqueStudents.length - 1]={"studentNumber":currentStudentNumber, "note":newNote};
										}

										else
										{
											doneReading = true;
										}
									}

									if(!rollBackImport)
									{
										self.pushOutput("Successful read of file complete. Beginning Import of " + uniqueStudents.length + " Admission Averages");
										var inAdmissionMutexIndex = 0;
										var admissionMutex = Mutex.create();
										var numberOfAveragesImported = 0;
										var numberOfAveragesWithNoStudent = 0;
										var doneSavingAverages = false;
										for(var i = 0; i < uniqueStudents.length; i++)
										{
											admissionMutex.lock(function() {
												var inAdmissionMutexCount = inAdmissionMutexIndex++;
												var importStudentNumber = uniqueStudents[inAdmissionMutexCount].studentNumber;
												var importNote = uniqueStudents[inAdmissionMutexCount].note;
												self.get('store').queryRecord('student', {number: importStudentNumber, findOneStudent:true}).then(function(studentObj) {
													if  (studentObj)
													{														
														studentObj.set('admissionAverage', importNote);
														studentObj.save().then(function() {
															numberOfAveragesImported++;
															if (numberOfAveragesImported == uniqueStudents.length - numberOfAveragesWithNoStudent && !doneSavingAverages)
															{
																doneSavingAverages = true;
																self.pushOutput("<span style='color:green'>Import of Admission Averages successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#admissionAverage").addClass("completed");
															}
														});
													}
													else{
														numberOfAveragesWithNoStudent++;
														if (numberOfAveragesImported == uniqueStudents.length - numberOfAveragesWithNoStudent && !doneSavingAverages)
														{
															doneSavingAverages = true;
															self.pushOutput("<span style='color:green'>Import of Admission Averages successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#admissionAverage").addClass("completed");
														}
													}
												});
											});
										}
									}

								}
							}
							break;
							case ImportState.ADMISSIONCOMMENTS:
							{
								var admissioncommentsCheckerArray = ['STUDENTNUMBER','NOTE'];
								var admissioncommentsArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase()];
								if(VerificationFunction(admissioncommentsCheckerArray,admissioncommentsArray))
								{
									self.pushOutput("Importing Admission Comments");
									var currentStudentNumber= "";
									var doneReading = false;
									var uniqueStudents = [];
									var rollbackImport = false;

									for(var i = 2; !doneReading; i++)
									{
										var studentNumber = worksheet['A'+ i];
										var note = worksheet['B'+ i];

										if(studentNumber && studentNumber.v!="")
										{
											currentStudentNumber=studentNumber.v;
											uniqueStudents.push({"studentNumber":currentStudentNumber, "note":note.v});
										}

										else if(note && note.v !="")
										{
											var newNote = uniqueStudents.note + note.v;
											uniqueStudents[uniqueStudents.length - 1]={"studentNumber":currentStudentNumber, "note":newNote};
										}

										else
										{
											doneReading = true;
										}
									}

									if(!rollBackImport)
									{
										self.pushOutput("Successful read of file has completed. Beginning import of " + uniqueStudents.length + " admission comments.")
										var inAdmissionMutexIndex = 0;
										var admissionMutex = Mutex.create();
										var numberOfCommentsImported = 0;
										var numberOfCommentsWithNoStudent = 0;
										var doneSavingComments = false;

										for(var i = 0; i < uniqueStudents.length; i++)
										{
											admissionMutex.lock(function() {
												var inAdmissionMutexCount = inAdmissionMutexIndex++;
												var importStudentNumber = uniqueStudents[inAdmissionMutexCount].studentNumber;
												var importNote = uniqueStudents[inAdmissionMutexCount].note;
												self.get('store').queryRecord('student', {number: importStudentNumber, findOneStudent:true}).then(function(studentObj) {
													if (studentObj)
													{														
														studentObj.set('admissionComments', importNote);
														studentObj.save().then(function() {
															numberOfCommentsImported++;
															if (numberOfCommentsImported == uniqueStudents.length - numberOfCommentsWithNoStudent && !doneSavingComments)
															{
																self.pushOutput("<span style='color:green'>Import of Admission Comments successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#admissionComments").addClass("completed");																
															}
														});
													}
													else
													{
														numberOfCommentsWithNoStudent++;
														if (numberOfCommentsImported == uniqueStudents.length - numberOfCommentsWithNoStudent && !doneSavingComments)
														{
																self.pushOutput("<span style='color:green'>Import of Admission Comments successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#admissionComments").addClass("completed");															
														}
													}
												});
											});
										}
									}

								}
							}
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
				Ember.$("#btnContinue").addClass("disabled");
				this.clearOutput();
				Ember.$("#newFile").val('');
				this.set('changingIndex', this.get('changingIndex')+1);
				console.log("changed Index to " + this.get('changingIndex'));
				switch(this.get('changingIndex')){
  					case 2:
  						$("#residencies").addClass("active");
 						$("#residencies").removeClass("disabled");
  						$("#gender").removeClass("active");
  						$("#gender").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>1</b> header with the title <b>'name'</b>.");
  						break;
  					case 3:
  						$("#courseCodes").addClass("active");
 						$("#courseCodes").removeClass("disabled");
  						$("#residencies").removeClass("active");
  						$("#residencies").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>4</b> headers with the titles <b>'courseLetter'</b>, <b>'courseNumber'</b>, <b>'name'</b>, <b>'unit'</b>.");
  						break;
  					case 4:
  						$("#students").addClass("active");
 						$("#students").removeClass("disabled");
  						$("#courseCodes").removeClass("active");
  						$("#courseCodes").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'firstName'</b>, <b>'lastName'</b>, <b>'gender'</b>, <b>'DOB'</b>, <b>'residency'</b>.");
  						break;
  					case 5:
  						$("#awards").addClass("active");
 						$("#awards").removeClass("disabled");
  						$("#students").removeClass("active");
  						$("#students").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>.");
  						break;
  					case 6:
  						$("#advancedStandings").addClass("active");
 						$("#advancedStandings").removeClass("disabled");
  						$("#awards").removeClass("active");
  						$("#awards").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'Course'</b>, <b>'Description'</b>, <b>'Units'</b>, <b>'Grade'</b>, <b>'From'</b>.");
  						break;
  					case 7:
  						$("#registrationComments").addClass("active");
 						$("#registrationComments").removeClass("disabled");
  						$("#advancedStandings").removeClass("active");
  						$("#advancedStandings").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>.");
  						break;
  					case 8:
  						$("#basisOfAdmission").addClass("active");
 						$("#basisOfAdmission").removeClass("disabled");
  						$("#registrationComments").removeClass("active");
  						$("#registrationComments").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>.");
  						break;
  					case 9:
  						$("#admissionAverage").addClass("active");
 						$("#admissionAverage").removeClass("disabled");
  						$("#basisOfAdmission").removeClass("active");
  						$("#basisOfAdmission").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>.");
  						break;
  					case 10:
  						$("#admissionComments").addClass("active");
 						$("#admissionComments").removeClass("disabled");
  						$("#admissionAverage").removeClass("active");
  						$("#admissionAverage").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>.");
  						break;
  					case 11:
  						$("#secondary").addClass("active");
						$("#secondary").removeClass("disabled");
  						$("#admissionComments").removeClass("active");
  						$("#admissionComments").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>1</b> header with the title <b>'School Name'</b>.");
  						break;
  					case 12:
  						$("#highschoolInfo").addClass("active");
						$("#highschoolInfo").removeClass("disabled");
  						$("#secondary").removeClass("active");
  						$("#secondary").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>8</b> headers with the titles <b>'studentNumber'</b>, <b>'schoolName'</b>, <b>'level'</b>, <b>'subject'</b>, <b>'description'</b>, <b>'source'</b>, <b>'units'</b>, <b>'grade'</b>.");
  						break;
  					case 13:
  						$("#recordPlans").addClass("active");
						$("#recordPlans").removeClass("disabled");
  						$("#highschoolInfo").removeClass("active");
  						$("#highschoolInfo").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'term'</b>, <b>'program'</b>, <b>'level'</b>, <b>'load'</b>, <b>'plan'</b>.");
  						break;
  					case 14:
  						$("#courseGrades").addClass("active");
						$("#courseGrades").removeClass("disabled");
  						$("#recordPlans").removeClass("active");
  						$("#recordPlans").addClass("completed");
  						this.changeHeaderRequirements("The file must have <b>7</b> headers with the titles <b>'studentNumber'</b>, <b>'term'</b>, <b>'courseLetter'</b>, <b>'courseNumber'</b>, <b>'section'</b>, <b>'grade'</b>, <b>'note'</b>.");
  						break;
				}	

			}
	}
});
