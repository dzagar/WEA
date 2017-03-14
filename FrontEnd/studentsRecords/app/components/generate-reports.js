import Ember from 'ember';

export default Ember.Component.extend({
	chartData: Ember.computed(function(){
  	return {
  		labels: ["label", "label2"],
  		datasets: [{
  			label: "axisLabel",
  			data: [10,3],
  			backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ]
  		}]
  	};
  }),
  options: {
  	responsive:true
  }
});
