import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';

var ImportState = {
	GENDER : 1,
	RESIDENCY : 2,
	TERMCODE : 3,
	COURSECODE : 4,
	HIGHSCHOOL : 5
};

function genderVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage("Please fix the name header in the imported file!");
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
		DisplayErrorMessage("Please fix the name header in the imported file!");
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
		DisplayErrorMessage("Please fix the name header in the imported file!");
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
		DisplayErrorMessage("Please fix the studentnumber header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='TERM')
	{
		DisplayErrorMessage("Please fix the term header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSELETTER')
	{
		DisplayErrorMessage("Please fix the courseletter header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSENUMBER')
	{
		DisplayErrorMessage("Please fix the coursenumber header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SECTION')
	{
		DisplayErrorMessage("Please fix the section header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage("Please fix the grade header in the imported file!");
		return false;
	}

	currentString=worksheet['G1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NOTE')
	{
		DisplayErrorMessage("Please fix the note header in the imported file!");
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
		DisplayErrorMessage("Please fix the studentnumber header in the imported file!");
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='FIRSTNAME')
	{
		DisplayErrorMessage("Please fix the firstname header in the imported file!");
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LASTNAME')
	{
		DisplayErrorMessage("Please fix the lastname header in the imported file!");
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GENDER')
	{
		DisplayErrorMessage("Please fix the gender header in the imported file!");
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='DOB')
	{
		DisplayErrorMessage("Please fix the DOB header in the imported file!");
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='RESIDENCY')
	{
		DisplayErrorMessage("Please fix the residency header in the imported file!");
		return false;
	}

	return true;
}

function secondarySchoolVerification(worksheet)
{
	
}

function studentHighSchoolVerification(worksheet)
{

}

function ScholarshipVerification(worksheet)
{

}

function AdvancedStandingVerification(worksheet)
{

}

function UndergraduateRPVerification(worksheet)
{

}

function UndergraduateCGVerification(worksheet)
{

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
						// case ImportState.HIGHSCHOOL:	
						// 	studentVerification(worksheet);
						// 	break;
						// etc.
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
			this.set('changingIndex',index);
		}	

	}
});
