import Ember from 'ember';

export default Ember.Component.extend({
	barChartLabels: null,
	barChartVals: null,
	categoryModel: null,
	currentCategory: null,
	currentCategoryIndex: -1,
	currentTerm: null,
	pieChartLabels: null,
	pieChartVals: null,
	store: Ember.inject.service(),
	termModel: null,

	init(){
		this._super(...arguments);
		//load term data model
		var self=this;
	    this.get('store').findAll('termCode').then(function (records) {
	      self.set('termModel', records);
	      self.set('currentTerm', records.get('firstObject'));//initialize currentTerm to first dropdown item
	    });
	    //load adjudication categories
	    this.get('store').findAll('adjudicationCategory').then(function (records) {
	      self.set('categoryModel', records);
	    });
	},
	didRender(){
		$(".open").hide();
		$("#chart").hide();
	},
	barChartData: Ember.computed(function(){
  	return {
  		labels: ["Eligible", "Suppl. Exams", "Withdrew from courses", "Incomplete", "Granted special exam", "Repeat failed courses", "Repeat failed year", "Withdraw"],
  		datasets: [{
  			data: [100,30,22,10,4,8,3,2],
  			backgroundColor: [
  				'rgba(75, 192, 112, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(62, 173, 173, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(71, 23, 168, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
            	'rgba(75, 192, 112, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(62, 173, 173, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(95, 51, 183, 1)',
                'rgba(255,99,132,1)'
            ]
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
  	}
  },
  actions: {
   		generateReport(){
   			var self=this;
   			$(".open").show();
   			$("#chart").show();
   			
   			
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
                    adjudicationCategories: null
                }).then(function(assessmentCodes){
                    assessmentCodes.forEach(function(assessmentCode, codeIndex){ 
                        var assessmentCodeID = assessmentCode.get('id');
                        var termCodeID= currentTerm.get('id');
                        console.log("assesment id "+assessmentCodeID+" term id "+termCodeID);
                        self.get('store').query('adjudication', {
                            termCode: termCodeID,
                            assessmentCode: assessmentCodeID
                        }).then(function(adjudicationObjects){
                            barChartLabels.push(assessmentCode.name);
                            barChartVals.push(adjudicationObjects.get('length'));
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
                    adjudicationCategories: currentCategoryID
                }).then(function(assessmentCodes){
                    assessmentCodes.forEach(function(assessmentCode, codeIndex){ 
                        var assessmentCodeID = assessmentCode.get('id');
                        var termCodeID= currentTerm.get('id');
                        console.log("assesment id "+assessmentCodeID+" term id "+termCodeID);
                        self.get('store').query('adjudication', {
                            termCode: termCodeID,
                            assessmentCode: assessmentCodeID
                        }).then(function(adjudicationObjects){
                            pieChartLabels.push(assessmentCode.name);
                            pieChartVals.push(adjudicationObjects.get('length'));
                        });
                    });
                });
            }
   		},
   		selectTerm(index){
	      this.set('currentTerm', this.get('termModel').objectAt(Number(index)));
	      console.log("new index " + this.get('currentTerm'));
	      $(".open").hide();
		  $("#chart").hide();
	    },
	    selectCategory(index){
	      this.set('currentCategoryIndex', index);
	      this.set('currentCategory', this.get('categoryModel').objectAt(Number(index)));
	      console.log("new index " + this.get('currentCategoryIndex'));
	      $(".open").hide();
		  $("#chart").hide();
	    },
   }
});
