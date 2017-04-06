import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';
import Mutex from 'ember-mutex';

var ImportState = {
	//basic
	GENDER : 1,
	RESIDENCY : 2,
	COURSECODE : 3,
	TERMCODE : 4,
	//faculty
	FACULTY: 5,
	DEPARTMENT: 6,
	PROGRAMADMIN: 7,
	//student
	STUDENT : 8,
	SCHOLARSHIPS : 9,
	ADVANCEDSTANDINGS : 10,
	REGISTRATIONCOMMENTS : 11,
	BASISOFADMISSION : 12,
	ADMISSIONAVERAGE : 13,
	ADMISSIONCOMMENTS : 14,
	//highschool
	HIGHSCHOOL : 15,
	HSCOURSEINFO : 16,
	//undergraduate
	RECORDPLANS : 17,
	RECORDGRADES : 18,
	STUDENTADJUDICATION : 19,
};

function DisplayErrorMessage(message)
{
	//console.log(message);
}
function checkUniqueSubject(sourceArray, newName, newDescription)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].name === newName && sourceArray[i].description === newDescription)
		{
			//console.log("found duplicate value of " + newName + " and " + newDescription);
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
			//console.log("found duplicate field");
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
			//console.log("found duplicate field in Term Code");
			//console.log(newStudentNumber);
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
			//console.log("found duplicate field in Program Record");
			//console.log(newStudentNumber);
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
			//console.log("found duplicate field in Plan Code");
			//console.log(newStudentNumber);
			return false;
		}
	}
	return true;
}
function checkUniqueCourse(sourceArray, newLetter, newNumber, newUnit)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].letter == newLetter && sourceArray[i].number == newNumber)
		{
			//console.log("found duplicate course" + newLetter + newNumber);
			
			return false;
		}
		if (isNaN(newUnit))
		{
			//console.log("ERROR: RECORD " + newLetter + newNumber + "cannot convert unit " + newUnit + " to a number");
			return false;
		}
	}
	return true;
}
function checkUniqueDepartment(sourceArray, newFaculty, newDepartment)
{
	for (var i = 0; i < sourceArray.length; i++)
	{
		if (sourceArray[i] && sourceArray[i].facultyName == newFaculty && sourceArray[i].departmentName == newDepartment)
		{
			//console.log("found duplicate department" + newLetter + newNumber);			
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
			//console.log("There was an error in the '"+sourceArray[i]+"' header! Your current value is: '"+newArray[i]+"'. Please fix this before re-importing!");
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
	importInProgress: false,
	fileFormat: "The file must have one header with the title <b>'name'</b>.",
	fileOutput: "",
	importBasic: null,
	importFaculty: null,
	importStudent: null,
	importHighSchool: null,
	importUndergrad: null,
	importCount: 0,
	index1: false,
	index2: false,
	index3: false,
	index4: false,

	init(){
		this._super(...arguments);
		var basicCategory = [
			{
				"progress": 0,
				"total": 100,
				"name": "Genders",
				"code": "Genders",
				"description": "The file must have one header with the title <b>'name'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Residencies",
				"code": "Residencies",
				"description": "The file must have <b>1</b> header with the title <b>'name'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Course Codes",
				"code": "CourseCodes",
				"description": "The file must have <b>4</b> headers with the titles <b>'courseLetter'</b>, <b>'courseNumber'</b>, <b>'name'</b>, <b>'unit'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Term Codes",
				"code": "TermCodes",
				"description": "The file must have <b>1</b> header with the title <b>'name'</b>."
			}
		];
		var facultyCategory = [
			{
				"progress": 0,
				"total": 100,
				"name": "Faculties",
				"code": "Faculties",
				"description": "The file must have one header with the title <b>'name'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Departments",
				"code": "Departments",
				"description": "The file must have two headers with the titles <b>'name'</b> and <b>'faculty'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Program Administrations",
				"code": "ProgramAdministrations",
				"description": "The file must have two headers with the titles <b>'name'</b> and <b>'position'</b>."
			}
		];
		var studentCategory = [
			{
				"progress": 0,
				"total": 100,
				"name": "Students",
				"code": "Students",
				"description": "The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'firstName'</b>, <b>'lastName'</b>, <b>'gender'</b>, <b>'DOB'</b>, <b>'residency'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Awards and Scholarships",
				"code": "AwardsScholarships",
				"description": "The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Advanced Standings",
				"code": "AdvancedStandings",
				"description": "The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'Course'</b>, <b>'Description'</b>, <b>'Units'</b>, <b>'Grade'</b>, <b>'From'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Registration Comments",
				"code": "RegistrationComments",
				"description": "The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Basis of Admissions",
				"code": "BasisofAdmissions",
				"description": "The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Admission Averages",
				"code": "AdmissionAverages",
				"description": "The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Admission Comments",
				"code": "AdmissionComments",
				"description": "The file must have <b>2</b> headers with the titles <b>'studentNumber'</b>, <b>'note'</b>."
			}
		];
		var highSchoolCategory = [
			{
				"progress": 0,
				"total": 100,
				"name": "High Schools",
				"code": "HighSchools",
				"description": "The file must have <b>1</b> header with the title <b>'School Name'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "High School Course Information",
				"code": "HighSchoolCourseInformation",
				"description": "The file must have <b>8</b> headers with the titles <b>'studentNumber'</b>, <b>'schoolName'</b>, <b>'level'</b>, <b>'subject'</b>, <b>'description'</b>, <b>'source'</b>, <b>'units'</b>, <b>'grade'</b>."
			}
		];
		var undergraduateCategory = [
			{
				"progress": 0,
				"total": 100,
				"name": "Undergraduate Record Plans",
				"code": "UndergraduateRecordPlans",
				"description": "The file must have <b>6</b> headers with the titles <b>'studentNumber'</b>, <b>'term'</b>, <b>'program'</b>, <b>'level'</b>, <b>'load'</b>, <b>'plan'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Undergraduate Record Courses",
				"code": "UndergraduateRecordCourses",
				"description": "The file must have <b>7</b> headers with the titles <b>'studentNumber'</b>, <b>'term'</b>, <b>'courseLetter'</b>, <b>'courseNumber'</b>, <b>'section'</b>, <b>'grade'</b>, <b>'note'</b>."
			},
			{
				"progress": 0,
				"total": 100,
				"name": "Undergraduate Record Adjudications",
				"code": "UndergraduateRecordAdjudications",
				"description": "The file must have <b>10</b> headers with the titles <b>'studentNumber'</b>, <b>'term'</b>, <b>'termAVG'</b>, <b>'termUnitsPassed'</b>, <b>'termUnitsTotals'</b>, <b>'termAdjudication'</b>, <b>'specialAVG'</b>, <b>'cumAVG'</b>, <b>'cumUnitsPassed'</b>, <b>'cumUnitsTotals'</b>."
			}
			
		];
		this.set('importBasic', basicCategory);
		this.set('importFaculty', facultyCategory);
		this.set('importStudent', studentCategory);
		this.set('importHighSchool', highSchoolCategory);
		this.set('importUndergrad', undergraduateCategory);
	},

	didRender(){
		Ember.$('.overlay')
		.visibility({
		    type   : 'fixed',
		    offset : 15, // give some space from top of screen
		    silent: true
		  });
	},

	indexChange: Ember.observer('changingIndex', function(){
		this.set('index1', this.get('changingIndex') > 16); //show undergraduate
		this.set('index2', this.get('changingIndex') > 14); //show high school
		this.set('index3', this.get('changingIndex') > 7); //show student
		this.set('index4', this.get('changingIndex') > 4); //show faculty
	}),

	clearOutput: function() {
		this.set('fileOutput', "");
	},
	pushOutput: function(newLine) {
		var lineToAdd = this.get('fileOutput') + "</br>" + newLine;
		this.set('fileOutput', lineToAdd);
	},
	setOutput: function(newOutput) {
		var lineToAdd = this.get('fileOutput') + "</br>" + newOutput;
		this.set('fileOutput', lineToAdd);

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
			this.set('importInProgress', true);
			Ember.$("#btnImport").addClass("disabled");
			var files = $("#newFile" + this.get('importCount'))[0].files;
			var i,f;
			for (i = 0; i != files.length; ++i) {
				f = files[i];
				//console.log(f);
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
							self.setOutput("Importing genders.");
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
											self.pushOutput("<font color='red'>Import cancelled. Your excel sheet contains duplicate gender names: '" + genderName + ".'</font>");
											rollBackImport = true;
											doneImporting = true;
											Ember.$("#btnImport").removeClass("disabled");
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
											self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
											Ember.$("#btnImport").removeClass("disabled");
										}
									}
								}
								//delete genders from the store
								if (rollBackImport) {
									for (var i = 0; i < gendersToImport.length; i++) {
										gendersToImport[i].deleteRecord();
									}
								} else {
									var importGender = self.get('importBasic');
									Ember.set(importGender.objectAt(0), "total", gendersToImport.length*2);
									Ember.set(importGender.objectAt(0), "progress", gendersToImport.length);
									self.set('importBasic', importGender);
									self.pushOutput("Successful read of file has completed. Beginning import of " + gendersToImport.length + " genders.");
									var gendersImportedCount = 0;
									for (var i = 0; i < gendersToImport.length; i++) {
										gendersToImport[i].save().then(function() {
											Ember.set(importGender.objectAt(0), "progress", Ember.get(importGender.objectAt(0), "progress")+1);
											self.set('importBasic', importGender);
											gendersImportedCount++;
											if (gendersImportedCount == gendersToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import successful!</span>");
  												Ember.$("#Genders").addClass("completed");
  												self.send("continue");
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
								self.setOutput("Importing residencies.");
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
											this.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate residency names: '" + residencyName + ".'</span>");
											rollBackImport = true;
											doneImporting = true;
											Ember.$("#btnImport").removeClass("disabled");
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
											this.pushOutput("<span style='color:red'>File does not contain any values.</span>")
											Ember.$("#btnImport").removeClass("disabled");
										}
									}
								}
								//delete residencies from the store
								if (rollBackImport) {
									for (var i = 0; i < residenciesToImport.length; i++) {
										residenciesToImport[i].deleteRecord();
									}
								} else { //save residencies to back-end
									var importRes = self.get('importBasic');
									Ember.set(importRes.objectAt(1), "total", residenciesToImport.length*2);
									Ember.set(importRes.objectAt(1), "progress", residenciesToImport.length);
									self.set('importBasic', importRes); 
									var numberOfResidenciesImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + residenciesToImport.length + " residencies.");
									for (var i = 0; i < residenciesToImport.length; i++) {
										residenciesToImport[i].save().then(function() {
											Ember.set(importRes.objectAt(1), "progress", Ember.get(importRes.objectAt(1), "progress")+1);
											self.set('importBasic', importRes);
											numberOfResidenciesImported++;
											if (numberOfResidenciesImported === residenciesToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import successful!</span>");
												Ember.$("#Residencies").addClass("completed");
												self.send("continue");
											}
										});
									}
								}
							}
							break;
							case ImportState.COURSECODE:
							var coursecodeCheckerArray = ['COURSELETTER','COURSENUMBER','NAME','UNIT'];
							var coursecodeArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase()];
							if (VerificationFunction(coursecodeCheckerArray,coursecodeArray)) {
								self.setOutput("Importing course codes.");
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
											self.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate course codes: '" + courseCodeLetter +" "+ courseCodeName + ".'</span>");
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
											self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
											Ember.$("#btnImport").removeClass("disabled");
										}
									}
								}
								//delete course codes from the store
								if (rollBackImport) {
									for (var i = 0; i < courseCodesToImport.length; i++) {
										courseCodesToImport[i].deleteRecord();
									}
								} else {
									var importCC = self.get('importBasic');
									Ember.set(importCC.objectAt(2), "total", courseCodesToImport.length*2); 
									Ember.set(importCC.objectAt(2), "progress", courseCodesToImport.length);
									self.set('importBasic', importCC);
									var numberOfCodesImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + courseCodesToImport.length + " courses.");
									for (var i = 0; i < courseCodesToImport.length; i++) {
										courseCodesToImport[i].save().then(function() {
											Ember.set(importCC.objectAt(2), "progress", Ember.get(importCC.objectAt(2), "progress")+1);
											self.set('importBasic', importCC);
											numberOfCodesImported++;
											if (numberOfCodesImported === courseCodesToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import successful!</span>");
  												Ember.$("#CourseCodes").addClass("completed");
  												self.send("continue");
											}
										});
									}
								}
							}
							break;
							case ImportState.TERMCODE:
							{
								var termCodeCheckerArray = ['NAME'];
								var termCodeArray = [worksheet['A1'].v.toUpperCase()];
								if (VerificationFunction(termCodeCheckerArray,termCodeArray)) {
									var rollBackImport = false;
									var doneReading = false;
									var uniqueTermNames = [];
									var termCodesToImport = [];
									for (var i = 2; !doneReading; i++)
									{
										var termCode = worksheet['A' + i];
										if (termCode)
										{
											var termCodeName = termCode.v;
											if (uniqueTermNames.includes(termCodeName)){
												self.pushOutput("Import cancelled. Your excel sheet contains duplicate term code names: '" + termCodeName + ".'");
												rollBackImport = true;
												doneImporting = true;
												Ember.$("#btnImport").removeClass("disabled");
											}
											else{
												uniqueTermNames.push(termCodeName);
												var newTermCode = self.get('store').createRecord('term-code', {
													name: termCodeName
												});
												termCodesToImport.push(newTermCode);
											}
										}
										else{
											doneReading = true;
										}
									}
									//done reading start import
									if (!rollBackImport)
									{
										var importBasic = self.get('importBasic');
										Ember.set(importBasic.objectAt(3), "total", termCodesToImport.length*2); 
										Ember.set(importBasic.objectAt(3), "progress", termCodesToImport.length);
										self.set('importBasic', importBasic);

										self.pushOutput("Successful read of file has completed. Beginning import of " + termCodesToImport.length + " term codes.");
										var numberOfTermsImported = 0;
										var doneSaving = false;
										for (var i = 0; i < termCodesToImport.length; i++)
										{
											termCodesToImport[i].save().then(function() {
												Ember.set(importBasic.objectAt(3), "progress", Ember.get(importBasic.objectAt(3), "progress")+1);
												self.set('importBasic', importBasic);
												numberOfTermsImported++;
												if (numberOfTermsImported === termCodesToImport.length && !doneSaving)
												{
													doneSaving = true;
													self.pushOutput("<span style='color:green'>Import successful!</span>");
													Ember.$("#btnContinue").removeClass("disabled");
													Ember.$("#TermCodes").addClass("completed");
												}
											});
										}
									}
								}
							}
							break;
							case ImportState.FACULTY:
							{
								var facultyCheckerArray = ['NAME'];
								var facultyArray = [worksheet['A1'].v.toUpperCase()];
								if (VerificationFunction(facultyCheckerArray,facultyArray)) {
									self.setOutput("Importing faculties.");
									var rollBackImport = false;
									var doneImporting = false;
									var uniqueFacultyNames = [];
									for (var i = 2; !doneImporting; i++) {
										var faculty = worksheet['A' + i];
										if (faculty) {
											var facultyName = faculty.v;
											if (uniqueFacultyNames.includes(facultyName)) {
												self.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate faculty names: '" + facultyName + ".'</span>");
												rollBackImport = true;
												doneImporting = true;
											} else {
												uniqueFacultyNames.push(facultyName);
											}
										} else {
											doneImporting = true;
											//if no faculty was imported
											if (i == 2) {
												rollBackImport = true;
												self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
												Ember.$("#btnImport").removeClass("disabled");
											}
										}
									}

									if (!rollBackImport) {
										var importFaculty = self.get('importFaculty');
										Ember.set(importFaculty.objectAt(0), "total", uniqueFacultyNames.length*2);
										Ember.set(importFaculty.objectAt(0), "progress", uniqueFacultyNames.length);
										self.set('importFaculty', importFaculty); 
										var numberOfFacultiesImported = 0;
										self.pushOutput("Successful read of file has completed. Beginning import of " + uniqueFacultyNames.length + " faculties.");
										for (var i = 0; i < uniqueFacultyNames.length; i++) {
											var newFacultyName = uniqueFacultyNames[i];
											var newFaculty = self.get('store').createRecord('faculty', {
												name: newFacultyName
											});
											newFaculty.save().then(function() {
												Ember.set(importFaculty.objectAt(0), "progress", Ember.get(importFaculty.objectAt(0), "progress")+1);
												self.set('importFaculty', importFaculty);
												numberOfFacultiesImported++;
												if (numberOfFacultiesImported === uniqueFacultyNames.length)
												{
													self.pushOutput("<span style='color:green'>Import successful!</span>");
													Ember.$("#Faculties").addClass("completed");
													self.send("continue");
												}
											});
										}
									}
								}
							}
							break;
							case ImportState.DEPARTMENT:
							{
								var departmentCheckerArray = ['NAME', 'FACULTY'];
								var departmentArray = [worksheet['A1'].v.toUpperCase(), worksheet['B1'].v.toUpperCase()];
								if (VerificationFunction(departmentCheckerArray,departmentArray)) {
									self.setOutput("Importing departments.");
									var rollBackImport = false;
									var doneImporting = false;
									var uniqueDepartments = [];
									for (var i = 2; !doneImporting; i++) {
										var department = worksheet['A' + i];
										var faculty = worksheet['B' + i];
										if (department && faculty) {
											var facultyName = faculty.v;
											var departmentName = department.v;
											if (uniqueDepartments.includes({"facultyName": facultyName, "departmentName": departmentName})) {
												this.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate department names on row " + i + ".</span>");
												rollBackImport = true;
												doneImporting = true;
												Ember.$("#btnImport").removeClass("disabled");
											} else {
												uniqueDepartments.push({"facultyName": facultyName, "departmentName": departmentName});
											}
										} else {
											if (faculty || department)
											{
												this.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains improperly formatted data on row " + i + ".</span>");
												rollBackImport = true;
												Ember.$("#btnImport").removeClass("disabled");
											}
											else{
												if (i == 2) {
													rollBackImport = true;
													this.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
													Ember.$("#btnImport").removeClass("disabled");
												}
											}										
											doneImporting = true;																				
										}
									}

									if (!rollBackImport) {
										var importDept = self.get('importFaculty');
										Ember.set(importDept.objectAt(1), "total", uniqueDepartments.length*2);
										Ember.set(importDept.objectAt(1), "progress", uniqueDepartments.length);
										self.set('importFaculty', importDept); 
										var numberOfDepartmentsImported = 0;
										var numberOfDepartmentsWithoutFaculty = 0;
										var doneSavingDepartment = false;
										var inDepartmentMutexIndex = 0;
										var departmentMutex = Mutex.create();
										self.pushOutput("Successful read of file has completed. Beginning import of " + uniqueDepartments.length + " departments.");
										for (var i = 0; i < uniqueDepartments.length; i++) {
											departmentMutex.lock(function() {
												var inDepartmentMutexCount = inDepartmentMutexIndex++;
												var departmentFaculty = uniqueDepartments[inDepartmentMutexCount].facultyName;
												var departmentName = uniqueDepartments[inDepartmentMutexCount].departmentName;
												self.get('store').queryRecord('faculty', {name: departmentFaculty}).then(function(facultyObj) {
													if (facultyObj){
														var newDepartment = self.get('store').createRecord('department', {
															name: departmentName
														});
														newDepartment.set('faculty', facultyObj);
														newDepartment.save().then(function() {
															Ember.set(importDept.objectAt(1), "progress", Ember.get(importDept.objectAt(1), "progress")+1);
															self.set('importFaculty', importDept);
															numberOfDepartmentsImported++;
															if (numberOfDepartmentsImported == uniqueDepartments.length - numberOfDepartmentsWithoutFaculty && !doneSavingDepartment)
															{
																doneSavingDepartment = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#Departments").addClass("completed");
																self.send("continue");														
															}
														});
													}
													else{
														numberOfDepartmentsWithoutFaculty++;
														if (numberOfDepartmentsImported == uniqueDepartments.length - numberOfDepartmentsWithoutFaculty && !doneSavingDepartment)
														{
															doneSavingDepartment = true;
															self.pushOutput("<span style='color:green'>Import successful!</span>");
															Ember.$("#Departments").addClass("completed");
															self.send("continue");													
														}
													}
												});

											});
										}
									}
								}
							}
							break;
							case ImportState.PROGRAMADMIN:
							{
								var PACheckerArray = ['NAME', 'POSITION', 'DEPARTMENT'];
								var PAArray = [worksheet['A1'].v.toUpperCase(), worksheet['B1'].v.toUpperCase(), worksheet['C1'].v.toUpperCase()];
								if (VerificationFunction(PACheckerArray, PAArray)) {
									self.setOutput("Importing program administration information.");
									var rollBackImport = false;
									var doneImporting = false;
									var PAsToImport = [];
									for (var i = 2; !doneImporting; i++) {
										var name = worksheet['A' + i];
										var position = worksheet['B' + i];
										var department = worksheet['C' + i];
										if (name && position && department) {
											var adminName = name.v;
											var positionName = position.v;
											var departmentName = department.v;
											PAsToImport.push({"name": adminName, "position": positionName, "department": departmentName});
										} else {
											if (name || position || department)
											{
												this.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains improperly formatted data on row " + i + ".</span>");
												rollBackImport = true;
												Ember.$("#btnImport").removeClass("disabled");
											}
											else if (i == 2) {
												rollBackImport = true;
												this.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
												Ember.$("#btnImport").removeClass("disabled");
											}																				
											doneImporting = true;																				
										}
									}

									if (!rollBackImport) {
										var importPA = self.get('importFaculty');
										Ember.set(importPA.objectAt(2), "total", PAsToImport.length*2);
										Ember.set(importPA.objectAt(2), "progress", PAsToImport.length);
										self.set('importFaculty', importPA); 
										var numberOfPAsImported = 0;
										var numberOfPAsWithoutDepartment = 0;
										var doneSavingPAs = false;
										var inPAMutexIndex = 0;
										var PAMutex = Mutex.create();
										self.pushOutput("Successful read of file has completed. Beginning import of " + PAsToImport.length + " program administrations.");
										for (var i = 0; i < PAsToImport.length; i++) {
											PAMutex.lock(function() {
												var inPAMutexCount = inPAMutexIndex++;
												var PAName = PAsToImport[inPAMutexCount].name;
												var PAPosition = PAsToImport[inPAMutexCount].position;
												var PADepartment = PAsToImport[inPAMutexCount].department;
												self.get('store').queryRecord('department', {name: PADepartment}).then(function(departmentOBJ) {
													if (departmentOBJ){
														var newPA = self.get('store').createRecord('program-administration', {
															name: PAName,
															position: PAPosition
														});
														newPA.set('department', departmentOBJ);
														newPA.save().then(function() {
															Ember.set(importPA.objectAt(2), "progress", Ember.get(importPA.objectAt(2), "progress")+1);
															self.set('importFaculty', importPA);
															numberOfPAsImported++;
															if (numberOfPAsImported == PAsToImport.length - numberOfPAsWithoutDepartment && !doneSavingPAs)
															{
																doneSavingPAs = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#ProgramAdministrations").addClass("completed");													
															}
														});
													}
													else{
														Ember.set(importPA.objectAt(2), "progress", Ember.get(importPA.objectAt(2), "progress")+1);
														self.set('importFaculty', importPA);
														numberOfPAsWithoutDepartment++;
														if (numberOfPAsImported == PAsToImport.length - numberOfPAsWithoutDepartment && !doneSavingPAs)
														{
															doneSavingPAs = true;
															self.pushOutput("<span style='color:green'>Import successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#ProgramAdministrations").addClass("completed");												
														}
													}
												});

											});
										}
									}
								}
							}
							break;
							case ImportState.STUDENT:
							var studentCheckerArray = ['STUDENTNUMBER','FIRSTNAME','LASTNAME','GENDER','DOB','RESIDENCY'];
							var studentArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase()];
							
							if (VerificationFunction(studentCheckerArray,studentArray))
							{
								self.setOutput("Importing students.");
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
											self.pushOutput("<span style='color:red'>Imported file contains duplicate records for student number " + studentNumber.v + ".</span>");
											Ember.$("#btnImport").removeClass("disabled");
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
													self.get('store').queryRecord('residency', {name: residency}).then(function(residencyObj) {
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
															var importStu = self.get('importStudent');
															Ember.set(importStu.objectAt(0), "total", studentsToImport.length*2);
															Ember.set(importStu.objectAt(0), "progress", studentsToImport.length);
															self.set('importStudent', importStu);
															self.pushOutput("Successful read of file has completed. Beginning import of " + studentsToImport.length + " students.");
															var numberOfStudentsImported = 0;
															for (var j = 0; j < studentsToImport.length; j++)
															{
																studentsToImport[j].save().then(function() {
																	Ember.set(importStu.objectAt(0), "progress", Ember.get(importStu.objectAt(0), "progress")+1);
																	self.set('importStudent', importStu);
																	numberOfStudentsImported++;
																	if (numberOfStudentsImported === studentsToImport.length)
																	{
																		self.pushOutput("<span style='color:green'>Import successful!</span>");
																		Ember.$("#Students").addClass("completed");
																		self.send("continue");
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
											self.pushOutput("<span style='color:red'>Imported file contains records with missing information on row" + i + ".</span>");
											Ember.$("#btnImport").removeClass("disabled");
										}
										if (i === 2)
										{
											rollBackImport = true;
											self.pushOutput("<span style='color:red'>Student sheet did not contain any properly formated students.</span>");
											Ember.$("#btnImport").removeClass("disabled");
										}
									}
								}
								numberOfStudent = uniqueStudentNumbers.length;
							}
							break;

						case ImportState.HIGHSCHOOL:
						var highschoolCheckerArray = ['SCHOOL NAME'];
						var highschoolArray = [worksheet['A1'].v.toUpperCase()];	
						if (VerificationFunction(highschoolCheckerArray,highschoolArray)) {
							self.setOutput("Importing high school names.");
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
											self.pushOutput("<span style='color:red'>Import cancelled. Your excel sheet contains duplicate high schools: '" + highSchoolName + ".'</span>");
											rollBackImport = true;
											doneImporting = true;
											Ember.$("#btnImport").removeClass("disabled");
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
											self.pushOutput("<span style='color:red'>Import cancelled. File does not contain any values.</span>");
											Ember.$("#btnImport").removeClass("disabled");
										}
									}
								}
								//delete high schools from the store
								if (rollBackImport) {
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										highSchoolsToImport[i].deleteRecord();
									}
								} else {
									var importHS = self.get('importHighSchool');
									Ember.set(importHS.objectAt(0), "total", highSchoolsToImport.length*2);
									Ember.set(importHS.objectAt(0), "progress", highSchoolsToImport.length);
									self.set('importHighSchool', importHS);
									var numberOfHSImported = 0;
									self.pushOutput("Successful read of file has completed. Beginning import of " + highSchoolsToImport.length + " high schools.");
									for (var i = 0; i < highSchoolsToImport.length; i++) {
										highSchoolsToImport[i].save().then(function() {
											Ember.set(importHS.objectAt(0), "progress", Ember.get(importHS.objectAt(0), "progress")+1);
											self.set('importHighSchool', importHS);
											numberOfHSImported++;
											if (numberOfHSImported === highSchoolsToImport.length)
											{
												self.pushOutput("<span style='color:green'>Import successful!</span>");
  												Ember.$("#HighSchools").addClass("completed");
  												self.send("continue");
											}
										});
									}
								}
							}
							break;
							
							case ImportState.HSCOURSEINFO:
							{
								var hscourseinfoCheckerArray = ['STUDENTNUMBER','SCHOOLNAME','LEVEL','SUBJECT','DESCRIPTION','SOURCE','UNITS','GRADE'];
								var hscourseinfoArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase(),worksheet['G1'].v.toUpperCase(),worksheet['H1'].v.toUpperCase()];
								if (VerificationFunction(hscourseinfoCheckerArray,hscourseinfoArray))
								{
									self.setOutput("Importing student high school information.");
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
												self.pushOutput("<span style='color:red'>Improperly formated data in  row " (i) + ".</span>");
												Ember.$("#btnImport").removeClass("disabled");
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
													self.pushOutput("<span style='color:red'>Improperly formated data in  row " + i + ".</span>");
													Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Improperly formated data in  row " (i) + ".</span>");		
												Ember.$("#btnImport").removeClass("disabled");										
											}
										}
									}
									if (!rollBackImport)
									{
										var importHS = self.get('importHighSchool');
										Ember.set(importHS.objectAt(1), "total", (highschoolSubjectValues.length+highschoolCourseValues.length+gradeValues.length)*2);
										Ember.set(importHS.objectAt(1), "progress", highschoolSubjectValues.length+highschoolCourseValues.length+gradeValues.length);
										self.set('importHighSchool', importHS);
										self.pushOutput("Successful read of file has completed. Beginning import of");
										self.pushOutput(highschoolSubjectValues.length + " subjects.");
										self.pushOutput(highschoolCourseValues.length + " courses.");
										self.pushOutput(gradeValues.length + " grades.");
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
												Ember.set(importHS.objectAt(1), "progress", Ember.get(importHS.objectAt(1), "progress")+1);
												self.set('importHighSchool', importHS);
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
																			Ember.set(importHS.objectAt(1), "progress", Ember.get(importHS.objectAt(1), "progress")+1);
																			self.set('importHighSchool', importHS);
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
																							self.get('store').queryRecord('high-school-course', {schoolName: gradeCourseSchoolName, subjectName: gradeSubjectNameParam, subjectDescription: gradeSubjectDescParam,  level: gradeCourseLevel, source: gradeCourseSource, unit: gradeCourseUnit}).then(function(highSchoolCourseObj) {
																								var courseID = highSchoolCourseObj.id;
																								var newGradeToSave = self.get('store').createRecord('high-school-grade', {
																									mark: recordGrade
																								});
																								newGradeToSave.set('student', studentObj);
																								newGradeToSave.set('source', highSchoolCourseObj);
																								newGradeToSave.save().then(function() {
																									Ember.set(importHS.objectAt(1), "progress", Ember.get(importHS.objectAt(1), "progress")+1);
																									self.set('importHighSchool', importHS);
																									numberOfGradesImported++;
																									if (numberOfGradesImported == gradeValues.length && !doneGradeImport)
																									{
																										doneGradeImport = true;
																										self.pushOutput("<span style='color:green'>Import of grades successful!</span>");
																										self.pushOutput("<span style='color:green'>All imports successful!</span>");
																										Ember.$("#btnContinue").removeClass("disabled");
																										Ember.$("#HighSchoolCourseInformation").addClass("completed");
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
									self.setOutput("Importing program record plans.");
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
											//console.log("there was no plan");
											if (i === 2)
											{
												self.pushOutput("<span style='color:red'>This file does not contain any properly formated data.</span>");
												rollbackImport = true;
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + ".</span>");
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + ".</span>");
												rollbackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + ".</span>");
												rollbackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Improperly formated data on row " + i + ".</span>");
												rollbackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
										var importUG = self.get('importUndergrad');
										Ember.set(importUG.objectAt(0), "total", (termValues.length + programValues.length)*2);
										Ember.set(importUG.objectAt(0), "progress", termValues.length + programValues.length);
										self.set('importUndergrad', importUG);
										self.pushOutput("Successful read of file has completed. Beginning import of");
										self.pushOutput(planValues.length + " plan codes.");
										self.pushOutput(programValues.length + " program records.");
										self.pushOutput(termValues.length + " terms.");
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
													number: termStudentNumber,
													findOneStudent: true
												}).then(function(studentObj) {
													var termName = termValues[inMutexCountIndex].termCode;
													self.get('store').queryRecord('term-code', {
														name: termName
													}).then(function(termCodeObj) {
														var newTermToImport = self.get('store').createRecord('term');
														newTermToImport.set('student', studentObj);
														newTermToImport.set('termCode', termCodeObj);
														termsToimport[termsToimport.length] = newTermToImport;
														newTermToImport.save().then(function() {
															Ember.set(importUG.objectAt(0), "progress", Ember.get(importUG.objectAt(0), "progress")+1);
															self.set('importUndergrad', importUG);
															//wait until all terms have been uploaded
															savingTermMutex.lock(function() {															
																if (termValues.length === termsToimport.length && !startedSavingTerms)
																{
																	startedSavingTerms = true;
																	self.pushOutput("<span style='color:green'>Import of terms successful!</span>");
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
																			self.get('store').queryRecord('term', {
																				studentNumber: programStudentNumber,
																				name: programTerm
																			}).then(function(termObj) {
																				var newProgramToImport = self.get('store').createRecord('program-record', {
																					name: programName,
																					level: programLevel,
																					load: programLoad
																				});
																				newProgramToImport.set('term', termObj);
																				programsToImport[programsToImport.length] = newProgramToImport;
																				programsToImport[programsToImport.length - 1].save().then(function() {
																					savingProgramMutex.lock(function() {
																						if (programsToImport.length === programValues.length && !startedSavingPrograms)
																						{
																							startedSavingPrograms = true;
																							self.pushOutput("<span style='color:green'>Import of program records successful!</span>")

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
																										newPlanToImport.set('programRecord', programRecordObj);
																										newPlanToImport.save().then(function() {
																											Ember.set(importUG.objectAt(0), "progress", Ember.get(importUG.objectAt(0), "progress")+1);
																											self.set('importUndergrad', importUG);
																											numberOfPlansSaved++;
																											if (numberOfPlansSaved == planValues.length && !donePlanImport)
																											{																											
																												donePlanImport = true;
																												self.pushOutput("<span style='color:green'>Import of plan codes successful!</span>");
																												self.pushOutput("<span style='color:green'>All imports successful!</span>");
																												Ember.$("#UndergraduateRecordPlans").addClass("completed");
																												self.send("continue");
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
									self.setOutput("Importing undergraduate student grades.");
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
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + (i) + ".</span>");
												rollBackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + (i) + ".</span>");
												rollBackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
										var importUG = self.get('importUndergrad');
										Ember.set(importUG.objectAt(1), "total", gradesToImport.length*2);
										Ember.set(importUG.objectAt(1), "progress", gradesToImport.length);
										self.set('importUndergrad', importUG);
										self.pushOutput("Successful read of file has been completed. Beginning import of " + gradesToImport.length + " student grades.");
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
												self.get('store').queryRecord('term', {
													studentNumber: studentNumber,
													name: termCode
												}).then(function(termObj) {
													self.get('store').queryRecord('course-code', {
														courseLetter: courseLetter,
														courseNumber: courseNumber
													}).then(function(courseCodeObj) {
														var newGrade = self.get('store').createRecord('grade', {
															mark: courseGrade
														});
														newGrade.set('term', termObj);
														newGrade.set('courseCode', courseCodeObj);
														if (courseNote)
														{
															newGrade.set('note', courseNote);
														}
														newGrade.save().then(function() {
															Ember.set(importUG.objectAt(1), "progress", Ember.get(importUG.objectAt(1), "progress")+1);
															self.set('importUndergrad', importUG);
															numberOfGradesImported++;
															if (numberOfGradesImported == gradesToImport.length && !startedSavingGrades)
															{
																startedSavingGrades = true;
																																									
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#UndergraduateRecordGrades").addClass("completed");
																self.send("continue");
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
									self.setOutput("Importing scholarships.");
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
												self.pushOutput("Improperly formatted data on row" + i + ".");
												rollBackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(1), "total", scholarshipArray.length*2);
										Ember.set(importStu.objectAt(1), "progress", scholarshipArray.length);
										self.set('importStudent', importStu);
										self.pushOutput("Successful read of file has completed. Beginning import of " + scholarshipArray.length + " scholarships.");
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
															Ember.set(importStu.objectAt(1), "progress", Ember.get(importStu.objectAt(1), "progress")+1);
															self.set('importStudent', importStu);
															numberOfScholarshipsImported++;
															if (numberOfScholarshipsImported == scholarshipArray.length - numberOfScholarShipsCanceled && !doneSavingScholarships)
															{
																doneSavingScholarships = true;														
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#AwardsScholarships").addClass("completed");
																self.send("continue");													
															}
														});	
													}
													else
													{
														numberOfScholarShipsCanceled++;
														if (numberOfScholarshipsImported == scholarshipArray.length - numberOfScholarShipsCanceled && !doneSavingScholarships)
														{
															doneSavingScholarships = true;														
															self.pushOutput("<span style='color:green'>Import successful!</span>");
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
									self.setOutput("Importing advanced standings.");
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
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + i + ".</span>");
												rollBackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
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
												self.pushOutput("<span style='color:red'>Improperly formatted data on row " + i + ".</span>");
												rollBackImport = true;
												doneReading = true;
												Ember.$("#btnImport").removeClass("disabled");
											}
										}
										else
										{
											doneReading = true;
										}										
									}
									if (!rollBackImport)
									{
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(2), "total", advancedStandingsToImport.length*2);
										Ember.set(importStu.objectAt(2), "progress", advancedStandingsToImport.length);
										self.set('importStudent', importStu);
										self.pushOutput("Successful read of file has completed. Beginning import of " + advancedStandingsToImport.length + " advanced standings.");
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
															Ember.set(importStu.objectAt(2), "progress", Ember.get(importStu.objectAt(2), "progress")+1);
															self.set('importStudent', importStu);
															advancedStandingsImported++;
															if (advancedStandingsImported == advancedStandingsToImport.length - advancedStandingsCancelled && !doneSaving)
															{
																doneSaving = true;														
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#AdvancedStandings").addClass("completed");
																self.send("continue");

															}
														});
													}
													else
													{
														advancedStandingsCancelled++;
														if (advancedStandingsImported == advancedStandingsToImport.length - advancedStandingsCancelled && !doneSaving)
														{
															doneSaving = true;														
															self.pushOutput("<span style='color:green'>Import successful!</span>");
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
									self.setOutput("Importing registration comments.");
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
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(3), "total", uniqueStudents.length*2);
										Ember.set(importStu.objectAt(3), "progress", uniqueStudents.length);
										self.set('importStudent', importStu);
										self.pushOutput("Successful read of file has completed. Beginning import of " + uniqueStudents.length + " registration comments.");
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
															Ember.set(importStu.objectAt(3), "progress", Ember.get(importStu.objectAt(3), "progress")+1);
															self.set('importStudent', importStu);
															numberOfCommentsImported++;
															if (numberOfCommentsImported == (uniqueStudents.length - numberOfCommentWithNoStudent) && !doneImportingComments)
															{
																doneImportingComments = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#RegistrationComments").addClass("completed");
																self.send("continue");
															}
														});
													}
													else
													{
														numberOfCommentWithNoStudent++;
														if (numberOfCommentsImported == (uniqueStudents.length - numberOfCommentWithNoStudent) && !doneImportingComments)
														{
															doneImportingComments = true;
															self.pushOutput("<span style='color:green'>Import successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#RegistrationComments").addClass("completed");

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
									self.setOutput("Importing basis of admissions.")
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
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(4), "total", uniqueStudents.length*2); 
										Ember.set(importStu.objectAt(4), "progress", uniqueStudents.length);
										self.set('importStudent', importStu);

										self.pushOutput("Successful read of file complete. Beginning import of " + uniqueStudents.length + " basis of admissions.");
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
															Ember.set(importStu.objectAt(4), "progress", Ember.get(importStu.objectAt(4), "progress")+1);
															self.set('importStudent', importStu);
															numberOfAdmissionsImported++;
															if (numberOfAdmissionsImported == uniqueStudents.length - numberOfAdmissionsWithNoStudent && !doneImportingAdmissions)
															{
																doneImportingAdmissions = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#BasisofAdmissions").addClass("completed");
																self.send("continue");
															}
														});
													}
													else{
														Ember.set(importStu.objectAt(4), "progress", Ember.get(importStu.objectAt(4), "progress")+1);
														numberOfAdmissionsWithNoStudent++;
															if (numberOfAdmissionsImported == uniqueStudents.length - numberOfAdmissionsWithNoStudent && !doneImportingAdmissions)
															{
																doneImportingAdmissions = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#BasisofAdmissions").addClass("completed");
																self.send("continue");
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
									self.setOutput("Importing admission averages.");
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
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(5), "total", uniqueStudents.length*2); 
										Ember.set(importStu.objectAt(5), "progress", uniqueStudents.length);
										self.set('importStudent', importStu);
										self.pushOutput("Successful read of file complete. Beginning import of " + uniqueStudents.length + " admission averages.");
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
															Ember.set(importStu.objectAt(5), "progress", Ember.get(importStu.objectAt(5), "progress")+1);
															self.set('importStudent', importStu);
															numberOfAveragesImported++;
															if (numberOfAveragesImported == uniqueStudents.length - numberOfAveragesWithNoStudent && !doneSavingAverages)
															{
																doneSavingAverages = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#AdmissionAverages").addClass("completed");
																self.send("continue");
															}
														});
													}
													else{
														numberOfAveragesWithNoStudent++;
														if (numberOfAveragesImported == uniqueStudents.length - numberOfAveragesWithNoStudent && !doneSavingAverages)
														{
															doneSavingAverages = true;
															self.pushOutput("<span style='color:green'>Import successful!</span>");
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
									self.setOutput("Importing admission comments.");
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
										var importStu = self.get('importStudent');
										Ember.set(importStu.objectAt(6), "total", uniqueStudents.length*2); 
										Ember.set(importStu.objectAt(6), "progress", uniqueStudents.length);
										self.set('importStudent', importStu);

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
															Ember.set(importStu.objectAt(6), "progress", Ember.get(importStu.objectAt(6), "progress")+1);
															self.set('importStudent', importStu);

															numberOfCommentsImported++;
															if (numberOfCommentsImported == uniqueStudents.length - numberOfCommentsWithNoStudent && !doneSavingComments)
															{
																doneSavingComments = true;
																self.pushOutput("<span style='color:green'>Import successful!</span>");
																Ember.$("#btnContinue").removeClass("disabled");
																Ember.$("#AdmissionComments").addClass("completed");														
															}
														});
													}
													else
													{
														numberOfCommentsWithNoStudent++;
														if (numberOfCommentsImported == uniqueStudents.length - numberOfCommentsWithNoStudent && !doneSavingComments)
														{
															doneSavingComments = true;
															self.pushOutput("<span style='color:green'>Import successful!</span>");
															Ember.$("#btnContinue").removeClass("disabled");
															Ember.$("#AdmissionComments").addClass("completed");															
														}
													}
												});
											});
										}
									}

								}
							}
						break;
						
						
						break;
						case ImportState.STUDENTADJUDICATION:
						{
							var studentAdjudicationCheckerArray = ['STUDENTNUMBER','TERM','TERMAVG','TERMUNITSPASSED','TERMUNITSTOTALS','TERMADJUDICATION','SPECIALAVG','CUMAVG','CUMUNITSPASSED','CUMUNITSTOTALS'];
							var studentAdjudicationArray = [worksheet['A1'].v.toUpperCase(),worksheet['B1'].v.toUpperCase(),worksheet['C1'].v.toUpperCase(),worksheet['D1'].v.toUpperCase(),worksheet['E1'].v.toUpperCase(),worksheet['F1'].v.toUpperCase(),worksheet['G1'].v.toUpperCase(),worksheet['H1'].v.toUpperCase(),worksheet['I1'].v.toUpperCase(),worksheet['J1'].v.toUpperCase()];
							if (VerificationFunction(studentAdjudicationCheckerArray, studentAdjudicationArray))
							{
								self.setOutput("Importing student adjudication information.");
								var rollBackImport = false;
								var doneReading = false;
								var studentInformation = [];
								var cumStudentInformation = [];
								var currentStudentNumber = -1;
								var currentCumAvg = "";
								var currentCumUnitsPassed = "";
								var currentCumUnitsTotal = "";
								for (var i = 2; !doneReading; i++)
								{
									var studentNumber = worksheet['A' + i];
									var term = worksheet['B' + i];
									var termAVG = worksheet['C' + i];
									var termUnitsPassed = worksheet['D' + i];
									var termUnitsTotal = worksheet['E' + i];
									var cumAVG = worksheet['H' + i];
									var cumUnitsPassed = worksheet['I' + i];
									var cumUnitsTotal = worksheet['J' + i];

									if (studentNumber && term && termAVG && termUnitsPassed && termUnitsTotal && cumAVG && cumUnitsPassed && cumUnitsTotal)
									{
										if (!checkUniqueTerm(studentInformation, studentNumber.v, term.v))
										{											
											self.pushOutput("<span style='color:red'>Duplicate values found on row " + i + " for student number " + studentNumber.v + " and term " + term.v + ".</span>");
											rollbackImport = true;
											doneReading = true;
											Ember.$("#btnImport").removeClass("disabled");
										}
										else{
											studentInformation.push({"studentNumber": studentNumber.v, "termCode": term.v, "termAVG": termAVG.v, "termUnitsPassed": termUnitsPassed.v, "termUnitsTotal": termUnitsTotal.v});
											//if we are transitioning students
											
											if (currentStudentNumber != studentNumber.v)
											{
												cumStudentInformation.push({"studentNumber": studentNumber.v, "cumAVG": cumAVG.v, "cumUnitsPassed": cumUnitsPassed.v, "cumUnitsTotal": cumUnitsTotal.v});
											}						
											currentStudentNumber = studentNumber.v;
											cumStudentInformation[cumStudentInformation.length - 1].cumAVG = cumAVG.v;
											cumStudentInformation[cumStudentInformation.length - 1].cumUnitsTotal = cumUnitsTotal.v;
											cumStudentInformation[cumStudentInformation.length - 1].cumUnitsPassed = cumUnitsPassed.v;
										}
									}
									else if (studentNumber || term || termAVG || termUnitsPassed || termUnitsTotal || cumAVG || cumUnitsPassed || cumUnitsTotal)
									{
										self.pushOutput("<span style='color:red'>Imporperly formated data on row " + i + ".</span>");
										rollbackImport = true;
										doneReading = true;
										Ember.$("#btnImport").removeClass("disabled");
									}
									else{
										doneReading = true;
									}
								}
								if (!rollBackImport)
								{
									var importUG = self.get('importUndergrad');
									Ember.set(importUG.objectAt(2), "total", (cumStudentInformation.length + studentInformation.length)*2); 
									Ember.set(importUG.objectAt(2), "progress", cumStudentInformation.length + studentInformation.length);
									self.set('importUndergrad', importUG);
									self.pushOutput("Successful read of file has completed. Beginning import of " + cumStudentInformation.length + " student information records and " + studentInformation.length + " student term information records.");
									var numberOfCumStudentsImported = 0;
									var numberOfCumStudentsWithoutStudent = 0;
									var numberOfStudentTermsImported = 0;
									var numberOfStudentTermsWithoutStudent = 0;
									var doneImportingCumStudents = false;
									var inCumStudentMutexIndex = 0;
									var inCumStudentMutex = Mutex.create();
									for (var i = 0; i < cumStudentInformation.length; i++)
									{
										inCumStudentMutex.lock(function() {
											var inCumStudentMutexCount = inCumStudentMutexIndex++;
											var cumStudentNumber = cumStudentInformation[inCumStudentMutexCount].studentNumber;
											var cumStudentAVG = cumStudentInformation[inCumStudentMutexCount].cumAVG
											var cumStudentUnitsPassed = cumStudentInformation[inCumStudentMutexCount].cumUnitsPassed;
											var cumStudentUnitsTotal = cumStudentInformation[inCumStudentMutexCount].cumUnitsTotal;
											var currentStudentInformationToImport = []
											for (var k = 0; k < studentInformation.length; k++)
											{
												if (studentInformation[k].studentNumber == cumStudentNumber)
												{
													currentStudentInformationToImport.push(studentInformation[k]);
												}
											}
											self.get('store').queryRecord('student', {
												number: cumStudentNumber,
												findOneStudent: true
											}).then(function(studentOBJ) {
												if (studentOBJ)
												{
													studentOBJ.set('cumAVG', cumStudentAVG);
													studentOBJ.set('cumUnitsPassed', cumStudentUnitsPassed);
													studentOBJ.set('cumUnitsTotal', cumStudentUnitsTotal);
													studentOBJ.save().then(function() {
														Ember.set(importUG.objectAt(2), "progress", Ember.get(importUG.objectAt(2), "progress")+1);
														self.set('importUndergrad', importUG);
														numberOfCumStudentsImported++;
														var studentTermMutex = Mutex.create();
														var inStudentTermMutexIndex = 0;
														for (var n = 0; n < currentStudentInformationToImport.length; n++)
														{
															if (currentStudentInformationToImport[n].studentNumber == studentOBJ.get('studentNumber'))
															{	
																studentTermMutex.lock(function() {
																	var inStudentTermMutexCount = inStudentTermMutexIndex++;
																	var inTermMutexStudentNumber = studentOBJ.get('studentNumber');
																	var studentTermCode = currentStudentInformationToImport[inStudentTermMutexCount].termCode;
																	var studentTermAVG = currentStudentInformationToImport[inStudentTermMutexCount].termAVG;
																	var studentTermUnitsPassed = currentStudentInformationToImport[inStudentTermMutexCount].termUnitsPassed;
																	var studentTermUnitsTotal = currentStudentInformationToImport[inStudentTermMutexCount].termUnitsTotal;
																	self.get('store').queryRecord('term', {
																		studentNumber: inTermMutexStudentNumber,
																		name: studentTermCode
																	}).then(function (termOBJ) {
																		if (termOBJ)
																		{																	
																			termOBJ.set('termAVG', studentTermAVG);
																			termOBJ.set('termUnitsPassed', studentTermUnitsPassed);
																			termOBJ.set('termUnitsTotal', studentTermUnitsTotal);
																			termOBJ.save().then(function() {
																				Ember.set(importUG.objectAt(2), "progress", Ember.get(importUG.objectAt(2), "progress")+1);
																				self.set('importUndergrad', importUG);
																				numberOfStudentTermsImported++;		
																				if (cumStudentInformation.length + studentInformation.length == numberOfCumStudentsImported + numberOfCumStudentsWithoutStudent + numberOfStudentTermsImported + numberOfStudentTermsWithoutStudent && !doneImportingCumStudents)
																				{
																					doneImportingCumStudents = true;
																					self.pushOutput("<span style='color:green'>Import successful!</span>");
																					Ember.$("#btnFinish").removeClass("disabled");
																					Ember.$("#StudentAdjudication").addClass("completed");	
																				}
																			});
																		}
																		else{
																			numberOfStudentTermsWithoutStudent++;																			
																			Ember.set(importUG.objectAt(2), "progress", Ember.get(importUG.objectAt(2), "progress")+1);
																			self.set('importUndergrad', importUG);	
																			if (cumStudentInformation.length + studentInformation.length == numberOfCumStudentsImported + numberOfCumStudentsWithoutStudent + numberOfStudentTermsImported + numberOfStudentTermsWithoutStudent && !doneImportingCumStudents)
																			{
																				doneImportingCumStudents = true;
																				self.pushOutput("<span style='color:green'>Import successful!</span>");
																				Ember.$("#btnFinish").removeClass("disabled");
																				Ember.$("#StudentAdjudication").addClass("completed");	
																			}
																		}
																	});
																});
															}
														}
													});
												}
												else{													
													self.set('importUndergrad', importUG);
													numberOfCumStudentsWithoutStudent++;
													for (var j = 0; j < studentInformation.length; j++)
													{
														if (studentInformation[j].studentNumber == cumStudentNumber)
														{
															numberOfStudentTermsWithoutStudent++;
															Ember.set(importUG.objectAt(2), "progress", Ember.get(importUG.objectAt(2), "progress")+1);
														}
													}
													if (cumStudentInformation.length + studentInformation.length == numberOfCumStudentsImported + numberOfCumStudentsWithoutStudent + numberOfStudentTermsImported + numberOfStudentTermsWithoutStudent && !doneImportingCumStudents)
													{
														doneImportingCumStudents = true;
														self.pushOutput("<span style='color:green'>Import successful!</span>");
														Ember.$("#btnFinish").removeClass("disabled");
														Ember.$("#StudentAdjudication").addClass("completed");	
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
					};
					reader.readAsBinaryString(f);
				}
			},

			setIndex(index)
			{
				//console.log(index);
				this.set('changingIndex',index);
				//console.log("index is now " + this.get('changingIndex'));
			},

			continue(){
				Ember.$("#newFile" + this.get('importCount')).val('');
				this.set('changingIndex', this.get('changingIndex')+1);
				//console.log("changed Index to " + this.get('changingIndex'));
				var self = this;
				switch(this.get('changingIndex')){
					case 5:
						$("#faculty").addClass("active");
 						$("#faculty").removeClass("disabled");
 						$("#basic").removeClass("active");
  						$("#basic").addClass("completed");
  						self.set('importCount', 0);
  						self.set('importInProgress', false);
  						self.clearOutput();
  						break;
					case 8:
						$("#student").addClass("active");
 						$("#student").removeClass("disabled");
  						$("#faculty").removeClass("active");
  						$("#faculty").addClass("completed");
  						self.set('importCount', 0);
  						self.set('importInProgress', false);
  						self.clearOutput();
  						break;
  					case 15:
  						$("#highschool").addClass("active");
						$("#highschool").removeClass("disabled");
  						$("#student").removeClass("active");
  						$("#student").addClass("completed");
  						self.set('importCount', 0);
  						self.set('importInProgress', false);
  						self.clearOutput();
  						break;
  					case 17:
  						$("#undergraduate").addClass("active");
						$("#undergraduate").removeClass("disabled");
  						$("#highschool").removeClass("active");
  						$("#highschool").addClass("completed");
  						self.set('importCount', 0);
  						self.set('importInProgress', false);
  						self.clearOutput();
  						break;
  					default:
  						self.set('importCount', self.get('importCount')+1);
  						self.send("import");
  						break;
				}

			}
	}
});
