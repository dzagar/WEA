import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';

export default Ember.Component.extend({

	store: Ember.inject.service(),
	showDeleteConfirmation: false,
	importData: false,

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
			    	/* DO SOMETHING WITH workbook HERE */
			    	console.log(workbook.SheetNames[0]);
		    	};
		    reader.readAsBinaryString(f);
			}
		}
		
	}



});
