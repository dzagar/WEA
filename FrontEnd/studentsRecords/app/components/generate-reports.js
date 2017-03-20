import Ember from 'ember';
import Chart from 'npm:chart.js';

export default Ember.Component.extend({
	backgroundColours: [],
	barChart: null,
	barChartLabels: [],
	barChartVals: [],
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

		var barData=
		{
			labels: this.get('barChartLabels'),
			datasets: [{
				data: this.get('barChartVals'),
				borderWidth: 0.5,
				label: "Students",
				backgroundColor: this.get('backgroundColours')
			}]
		};
		console.log(barData);
		return barData;
	}),

	pieChartData: Ember.computed(function(){
		return {
			labels: this.get('pieChartLabels'),
			datasets: [{
				label: "axisLabel",
				data: this.get('pieChartVals'),
				backgroundColor: this.get('backgroundColours')
			}]
		};
	}),
	options: {
		legend: {
			onClick: function(event, legendItem){
				console.log("clicked "+legendItem.label);
			}
		},
		scales:{
			yAxes:[{
				ticks:{
					beginAtZero:true
				}
			}]
		},
		legend: {
			display: false
		}
	},
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
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},

	didRender() {
        // console.log('did render triggered');
        // let ctx = Ember.$('#myChart');
        // let myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: this.get('barChartData'),
        //     options: {
        //         scales: {
        //             yAxes: [{
        //                 ticks: {
        //                     beginAtZero:true
        //                 }
        //             }]
        //         }
        //     }
        // });
    },
    renderChart() {
        	let ctx = Ember.$('#myChart');
        	let myChart = new Chart(ctx, {
        		type: 'bar',
        		data: this.get('barChartData'),
        		options: {
        			scales: {
        				yAxes: [{
        					ticks: {
        						beginAtZero:true
        					}
        				}]
        			}
        		}
        	});
    },
    actions: {
    	generateReport(){
    		var self=this;
    		$("#open").removeClass('hideChart');
    		$("#chart").removeClass('hideChart');
    		

   			// this.set('adjudications',this.get('termModel').objectAt(this.get('termIndex')).adjudications);
   			// console.log(this.get('termModel').objectAt(this.get('termIndex')).adjudications);
			// console.log(this.get('adjudications'));

			// this.get('store').query('termCode', {
			//       name: self.get('termIndex')
			//     }).then(function (records) {
			//     	self.set('currentTerm',records);
			//     }
			// });

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
            				self.get('backgroundColours').push(self.getRandomColor());
            				self.renderChart();
            			});
            		});
            	});


            }
            //other categories make pie chart
            else{
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
            				self.get('backgroundColours').push(self.getRandomColor());
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
        }
        
    }

});
