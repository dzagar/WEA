import Ember from 'ember';

export default Ember.Component.extend({
	backgroundColours: [],
	barChartLabels: ['1', '2','3'],
	barChartVals: [0.5,2,2],
	categoryModel: null,
	currentCategory: null,
	currentCategoryIndex: -1,
	currentTerm: null,
	pieChartLabels: [],
	pieChartVals: [],
	store: Ember.inject.service(),
	termModel: null,
	init(){
		this._super(...arguments);
		
		//load term data model
		var self=this;
	    this.get('store').findAll('termCode').then(function (records) {
	      self.set('termModel', records);
	      self.set('currentTerm', records.get('firstObject'));//initialize currentTerm to first dropdown item
	      
   			self.generateRandomData();
	    });
	    //load adjudication categories
	    this.get('store').findAll('adjudicationCategory').then(function (records) {
	      self.set('categoryModel', records);
	    });
	    this.set('backgroundColours', [this.getRandomColor(),this.getRandomColor(),this.getRandomColor()]);
	},
	barChartData: Ember.computed('barChartLabels', 'barChartVals', function(){
  	 return {
  		labels: this.get('barChartLabels'),
  		datasets: [{
  			data: this.get('barChartVals'),
  			borderWidth: 1,
  			label: "Assessment Code",
  			backgroundColor: this.get('backgroundColours')
  		}]
  	};
  }),
	pieChartData: Ember.computed(function(){
  	return {
  		labels: this.get('pieChartLabels'),
  		datasets: [{
  			label: "axisLabel",
  			data: this.get('pieChartVals'),
  			backgroundColor: [
                'rgba(75, 192, 112, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.0)',
                'rgba(255, 99, 132, 0.0)',
                'rgba(255, 99, 132, 0.0)',
                'rgba(255, 99, 132, 0.0)'
            ],
            borderColor: [
            	'rgba(75, 192, 112, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 0)',
                'rgba(255, 99, 132, 0)',
                'rgba(255, 99, 132, 0)',
                'rgba(255, 99, 132, 0)'
            ]
  		}]
  	};
  }),
  options: {
  	responsive: true,
  	legend: {
  		onClick: function(event, legendItem){
  			console.log("clicked "+legendItem.label);
  		}
  	},
  	scaleBeginAtZero : true
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
                        var assessmentCodeID = assessmentCode.get('id');
                        self.get('store').query('adjudication', {
                            termCode: termCodeID,
                            assessmentCode: assessmentCodeID
                        }).then(function(adjudicationObjects){
                            barChartLabels.push(assessmentCode.get('name'));
                            barChartVals.push(adjudicationObjects.get('length'));
                            self.set('barChartVals', barChartVals);
                            self.set('barChartLabels', barChartLabels);
                            self.get('backgroundColours').push(self.getRandomColor());
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
                        var assessmentCodeID = assessmentCode.get('id');
                        var termCodeID= currentTerm.get('id');
                        
                        self.get('store').query('adjudication', {
                            termCode: termCodeID,
                            assessmentCode: assessmentCodeID
                        }).then(function(adjudicationObjects){
                            pieChartLabels.push(assessmentCode.get('name'));
                            pieChartVals.push(adjudicationObjects.get('length'));
				            self.set('pieChartVals', pieChartVals);
				            self.set('pieChartLabels', pieChartLabels);
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
   }
});
