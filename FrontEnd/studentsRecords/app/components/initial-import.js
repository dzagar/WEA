import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';

	function genderVerification(worksheet)
	{
	var currentString=worksheet['A1'];
	currentString=currentString.toUpperCase();
		if(currentString!='NAME')
		{
			DisplayErrorMessage();
		}
	}

	function residencyVerification(worksheet)
	{
	var currentString=worksheet['A1'];
	currentString=currentString.toUpperCase();
		if(currentString!='NAME')
		{
			DisplayErrorMessage();
		}
	}

	function termCodeVerification(worksheet)
	{
	var currentString=worksheet['A1'];
	currentString=currentString.toUpperCase();
		if(currentString!='NAME')
		{
			DisplayErrorMessage();
		}
	}

	function courseCodeVerification(worksheet)
	{
	var currentString=worksheet['A1'];
	currentString=currentString.toUpperCase();
		if(currentString!='STUDENTNUMBER')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['B1'];
	currentString=currentString.toUpperCase();
		if(currentString!='TERM')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['C1'];
	currentString=currentString.toUpperCase();
		if(currentString!='COURSELETTER')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['D1'];
	currentString=currentString.toUpperCase();
		if(currentString!='COURSENUMBER')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['E1'];
	currentString=currentString.toUpperCase();
		if(currentString!='SECTION')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['F1'];
	currentString=currentString.toUpperCase();
		if(currentString!='GRADE')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['G1'];
	currentString=currentString.toUpperCase();
		if(currentString!='NOTE')
		{
			DisplayErrorMessage();
		}
	}

	function studentVerification(worksheet)
	{
	currentString=worksheet['A1'];
	currentString=currentString.toUpperCase();
		if(currentString!='STUDENTNUMBER')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['B1'];
	currentString=currentString.toUpperCase();
		if(currentString!='FIRSTNAME')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['C1'];
	currentString=currentString.toUpperCase();
		if(currentString!='LASTNAME')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['D1'];
	currentString=currentString.toUpperCase();
		if(currentString!='GENDER')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['E1'];
	currentString=currentString.toUpperCase();
		if(currentString!='DOB')
		{
			DisplayErrorMessage();
		}

	currentString=worksheet['F1'];
	currentString=currentString.toUpperCase();
		if(currentString!='RESIDENCY')
		{
			DisplayErrorMessage();
		}

	}

function DisplayErrorMessage()
{
	console.log('You fucked up the import bruh!');
}

export default Ember.Component.extend({
	
	store: Ember.inject.service(),
	showDeleteConfirmation: false,
	importData: false,
	currentIndex: null,

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
			    reader.onload = function(e) {
			    	var data = e.target.result;
			    	var workbook;
			    	workbook = XLSX.read(data, {type: 'binary'});
					var currentWorkSheet=workbook.SheetNames[0];
					var worksheet=workbook.Sheets[currentWorkSheet];
		
			    	switch(currentIndex)
					{
						case 0: genderVerfication(worksheet);
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
			this.set('currentIndex',index);
		}	

	}
});
