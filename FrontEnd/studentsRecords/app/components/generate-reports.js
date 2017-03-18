import Ember from 'ember';

export default Ember.Component.extend({
	categoryModel: null,
	currentCategory: -1,
	currentTerm: null,
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
	graduateChartData: Ember.computed(function(){
  	return {
  		labels: ["Eligible", "Suppl. Exams", "Withdrew from courses", "Incomplete", "Granted special exam", "Repeat failed courses", "Repeat failed year", "Withdraw"],
  		datasets: [{
  			label: "axisLabel",
  			data: [100,30,22,10,4,8,3,2],
  			backgroundColor: [
  				'rgba(75, 192, 112, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(62, 173, 173, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(71, 23, 168, 0.2)',
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
	nonGraduateChartData: Ember.computed(function(){
  	return {
  		labels: ["Progress", "Conditional", "Failed-repeat","Withdraw     ","           ","                      ","                          ","                                 "],
  		datasets: [{
  			label: "axisLabel",
  			data: [101,60,12,3,0,0,0,0],
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
            //bar
            if (currentCategory == -1)
            {
                var barChartData = [];
                this.get('store').query('assessmentCode', {
                    adjudicationCategories: null
                }).then(function(assessmentCodes){
                    assessmentCodes.forEach(function(assessmentCode, codeIndex){ 
                        var assessmentCodeID = assessmentCode.get('id');
                        self.get('store').query('adjudication', {
                            termCode: currentTerm,
                            assessmentCode: assessmentCodeID
                        }).then(function(adjudicationObjects){
                            barChartData.push({
                                "name": "name of assessment Code",
                                "count": adjudicationObjects.get('length')
                            });
                        });
                    });
                });

            }
            //pie
            else{

            }
   		},
   		selectTerm(index){
	      this.set('currentTerm', this.get('termModel').objectAt(Number(index)));
	      console.log("new index " + this.get('currentTerm'));
	    },
	    selectCategory(index){
	      this.set('currentCategory', index);
	      console.log("new index " + this.get('currentCategory'));
	    },
   }
});
