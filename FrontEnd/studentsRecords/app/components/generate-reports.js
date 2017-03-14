import Ember from 'ember';

export default Ember.Component.extend({
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
                'rgba(255,99,132,1)',
                'rgba(255,99,132,0)',
                'rgba(255,99,132,0)',
                'rgba(255,99,132,0)',
                'rgba(255,99,132,0)'
            ]
  		}]
  	};
  }),
  options: {
  	responsive:true
  }
});
