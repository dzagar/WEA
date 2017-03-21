import Ember from 'ember';
import Chart from 'npm:chart.js';
import jsPDF from 'npm:jspdf';
import XLSX from 'npm:xlsx-browserify-shim';

export default Ember.Component.extend({
	backgroundColours: [],
	barChart: null,
	barChartLabels: ["test"],
	barChartVals: [2],
	borderColours: [],
	categoryModel: null,
	currentCategory: null,
	currentCategoryIndex: -1,
	currentTerm: null,
	pieChartLabels: ["1","2"],
	pieChartVals: [2,4],
	store: Ember.inject.service(),
	termModel: null,
	init(){
		this._super(...arguments);
		
		//load term data model
		var self=this;
		this.get('store').findAll('termCode').then(function (records) {
			self.set('termModel', records);
	      	self.set('currentTerm', records.get('firstObject'));//initialize currentTerm to first dropdown item

   			//self.generateRandomData();
   		});
	    //load adjudication categories
	    this.get('store').findAll('adjudicationCategory').then(function (records) {
	    	self.set('categoryModel', records);
	    });

	},
	barChartData: Ember.computed('barChartLabels', 'barChartVals', function(){
		return{
			labels: this.get('barChartLabels'),
			datasets: [{
				data: this.get('barChartVals'),
				borderWidth: 0.5,
				label: "Students",
				backgroundColor: this.get('backgroundColours'),
				borderColor: this.get('borderColours')
			}]
		};
	}),

	pieChartData: Ember.computed('pieChartLabels', 'pieChartVals',function(){
		return {
			labels: this.get('pieChartLabels'),
			datasets: [{
				label: "axisLabel",
				data: this.get('pieChartVals'),
				backgroundColor: this.get('backgroundColours'),
				borderColor: this.get('borderColours')
			}]
		};
	}),
	generateRandomData(){
		var currentTerm = this.get('currentTerm');
		var self = this;
		var arrayOfTestAssessmentCodes = [];
		arrayOfTestAssessmentCodes[0] = this.get('store').createRecord('assessment-code', {name: "First", code: "123"});
		arrayOfTestAssessmentCodes[1] = this.get('store').createRecord('assessment-code', {name: "Second", code: "124"});
		arrayOfTestAssessmentCodes[2] = this.get('store').createRecord('assessment-code', {name: "Third", code: "125"});
		arrayOfTestAssessmentCodes[3] = this.get('store').createRecord('assessment-code', {name: "Fourth", code: "126"});
		arrayOfTestAssessmentCodes[4] = this.get('store').createRecord('assessment-code', {name: "Fifth", code: "127"});
		var numberToSave = 5;
		for (var i = 0; i < arrayOfTestAssessmentCodes.length; i++)
		{
			arrayOfTestAssessmentCodes[i].save().then(function()
			{
				numberToSave--;
				if (!numberToSave)
				{
					self.get('store').find('term-code', currentTerm.get('id')).then(function(currentTermCode){
						self.get('store').query('student', {offset: 0, limit: 100}).then(function(students){
							students.forEach(function(student, studentIndex){
								var firstNumber = Math.floor(Math.random() * (5));
								var secondNumber = Math.floor(Math.random() * (5));
								while (secondNumber === firstNumber)
								{
									secondNumber = Math.floor(Math.random() * (5));
								}
								var firstAssessmentID = arrayOfTestAssessmentCodes[firstNumber].get('id');
								var secondAssessmentID = arrayOfTestAssessmentCodes[secondNumber].get('id');
								var firstNewAdjudication = self.get('store').createRecord('adjudication', {
									date: "today"
								});
								firstNewAdjudication.set('termCode', currentTermCode);
								firstNewAdjudication.set('student', student);
								firstNewAdjudication.set('assessmentCode', arrayOfTestAssessmentCodes[firstNumber]);
								var secondNewAdjudication = self.get('store').createRecord('adjudication', {
									date: "today"
								});
								secondNewAdjudication.set('termCode', currentTermCode);
								secondNewAdjudication.set('student', student);
								secondNewAdjudication.set('assessmentCode', arrayOfTestAssessmentCodes[secondNumber]);
								firstNewAdjudication.save();
								secondNewAdjudication.save();
							});
						}); 
					});                                      
				}                
			});
		}



	},
	getRandomColour() {
		// var letters = '0123456789ABCDEF';
		// var color = '#';
		// for (var i = 0; i < 6; i++ ) {
		// 	color += letters[Math.floor(Math.random() * 16)];
		// }
		// return color;
		var hue = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256));
		return hue;
	},
	renderBarChart() {
		let ctx = Ember.$('#barChart');
		let myChart = new Chart(ctx, {
			type: 'bar',
			data: this.get('barChartData'),
			options: {
				scaleShowLabels: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				},
				legend: {
					display: false
				}
			}
		});

	},
    renderPieChart() {
    	let ctx = Ember.$('#pieChart');
    	let myChart = new Chart(ctx, {
    		type: 'pie',
    		data: this.get('pieChartData'),
    		options: {
				legend:{
					onClick: function(e,legendItem){
						console.log("Clicked " + legendItem.text);
					}
				}
    		}
    	});
    },
    destroyChart() {
    	$('#chart').replaceWith('<div id="chart"><canvas id="barChart"></canvas></div>');
    },

    actions: {
    	generateReport(){
    		var self=this;
    		$("#open").removeClass('hideChart');
    		$("#chart").removeClass('hideChart');

			var currentTerm = this.get('currentTerm');
			var termCodeID= currentTerm.get('id');
			var currentCategory = this.get('currentCategory');
			var barChartLabels=this.get('barChartLabels');
			var barChartVals=this.get('barChartVals');
			var pieChartLabels=this.get('pieChartLabels');
			var pieChartVals=this.get('barChartVals');
			console.log("category is "+currentCategory);
			console.log("currentTerm id is "+currentTerm.get('id'));
            //category 'Other' makes bar chart
            if (this.get('currentCategoryIndex') == -1)
            {

            	barChartLabels = [];
            	barChartVals = [];
            	this.get('store').query('assessmentCode', {
            		adjudicationCategory: null
            	}).then(function(assessmentCodes){
            		assessmentCodes.forEach(function(assessmentCode, codeIndex){ 
            			barChartLabels.push(assessmentCode.get('name'));
            			self.set('barChartLabels', barChartLabels);
            			var assessmentCodeID = assessmentCode.get('id');
            			self.get('store').query('adjudication', {
            				termCode: termCodeID,
            				assessmentCode: assessmentCodeID
            			}).then(function(adjudicationObjects){
            				barChartVals.push(adjudicationObjects.get('length'));
            				self.set('barChartVals', barChartVals);
            				var colour=self.getRandomColour();
            				self.get('backgroundColours').push(colour+',0.3)');
            				self.get('borderColours').push(colour+',1)');
            				self.destroyChart();
            				self.renderBarChart();
            			});
            		});
            	});


            }
            //other categories make pie chart
            else{
            	this.renderPieChart();
            	pieChartLabels = [];
            	pieChartVals = [];
            	var currentCategoryID= currentCategory.get('id');
            	this.get('store').query('assessmentCode', {
            		adjudicationCategory: currentCategoryID
            	}).then(function(assessmentCodes){
            		assessmentCodes.forEach(function(assessmentCode, codeIndex){ 
            			pieChartLabels.push(assessmentCode.get('name'));
            			self.set('pieChartLabels', pieChartLabels);
            			var assessmentCodeID = assessmentCode.get('id');
            			var termCodeID= currentTerm.get('id');
            			self.get('store').query('adjudication', {
            				termCode: termCodeID,
            				assessmentCode: assessmentCodeID
            			}).then(function(adjudicationObjects){
            				pieChartVals.push(adjudicationObjects.get('length'));
            				self.set('pieChartVals', pieChartVals);
            				var colour=self.getRandomColour();
            				self.get('backgroundColours').push(colour+',0.3)');
            				self.get('borderColours').push(colour+',1)');
            				self.destroyChart();
            				self.renderPieChart();
            			});
            		});
            	});
            }

        },
        selectTerm(index){
        	this.set('currentTerm', this.get('termModel').objectAt(Number(index)));
        	console.log("new index " + this.get('currentTerm'));
        	$("#open").addClass('hideChart');
        	$("#chart").addClass('hideChart');
        },
        selectCategory(index){
        	this.set('currentCategoryIndex', index);
        	this.set('currentCategory', this.get('categoryModel').objectAt(Number(index)));
        	console.log("new index " + this.get('currentCategoryIndex'));
        	$("#open").addClass('hideChart');
        	$("#chart").addClass('hideChart');
        },
        generatePDF() {
            console.log('Generating PDF document');
            let doc = new jsPDF("portrait", "mm", "letter");
            doc.setFontSize(11);
            let dataStrs = [];
            let assessmentCategory;
            if (this.get('currentCategoryIndex') === -1) {
                assessmentCategory = null;
            } else {
                this.get('currentCategory').get('id');
            }
            this.get('store').query('assessmentCode', {
                adjudicationCategory: null
            }).then(function (assessmentCodes) {
                let promiseArr = [];
                assessmentCodes.forEach(function (assessmentCode, index) {
                    assessmentCode.get('adjudications').forEach(function (adjudication, index) {
                        promiseArr.push(adjudication.get('student'));
                        dataStrs.push(adjudication.get('date') + ' ' + assessmentCode.get('name') + ' ' + assessmentCode.get('code'));
                        //.then(function (student) {
                            //let dataStr = student.get('firstName') + ' ' + student.get('lastName') + ' ' + student.get('studentNumber') + ' ' + adjudication.get('date') + ' ' + assessmentCode.get('name') + ' ' + assessmentCode.get('code');
                            //console.log(dataStr);
                        //});
                    });
                });
                return promiseArr;
            }).then(function(promiseArr) {
                console.log('Done getting promise array');
                return Ember.RSVP.all(promiseArr);
            }).then(function(students) {
                console.log('Done getting students');
                if (students.length === dataStrs.length) {
                    for (let i = 0; i < students.length; i++) {
                        let dataStr = students[i].get('firstName') + ' ' + students[i].get('lastName') + ' ' + students[i].get('studentNumber') + ' ' + dataStrs[i];
                        doc.text(dataStr, 25, 25 + (7 * (i % 32)));
                        if ((i + 1) % 32 === 0) {
                            doc.addPage();
                        }
                    }
                    doc.save("Report.pdf");
                } else {
                    console.log('Something went wrong! students: ' + students.length + ' datStrs: ' + dataStrs.length);
                }
            });
        }
        
    }

});
