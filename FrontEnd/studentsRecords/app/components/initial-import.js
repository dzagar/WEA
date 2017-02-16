import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';

function genderVerification(worksheet)
{
	var currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NAME')
	{
		DisplayErrorMessage();
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
		DisplayErrorMessage();
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
		DisplayErrorMessage();
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
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='TERM')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSELETTER')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='COURSENUMBER')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='SECTION')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GRADE')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['G1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='NOTE')
	{
		DisplayErrorMessage();
		return false;
	}

	return true;
}

function studentVerification(worksheet)
{
	currentString=worksheet['A1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='STUDENTNUMBER')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['B1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='FIRSTNAME')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['C1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='LASTNAME')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['D1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='GENDER')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['E1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='DOB')
	{
		DisplayErrorMessage();
		return false;
	}

	currentString=worksheet['F1'].v;
	currentString=currentString.toUpperCase();
	if(currentString!='RESIDENCY')
	{
		DisplayErrorMessage();
		return false;
	}

	return true;
}

function DisplayErrorMessage()
{
	console.log('You fucked up the import bruh!');
}

export default Ember.Component.extend({
	
	store: Ember.inject.service(),
	showDeleteConfirmation: false,
	importData: false,
	changingIndex: 0,
	
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
						case 0: genderVerification(worksheet);
						break;
						case 1:	residencyVerification(worksheet);
						break;
						case 2:	termCodeVerification(worksheet);
						break;
						case 3:	courseCodeVerification(worksheet);
						break;
						case 4:	studentVerification(worksheet);
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
