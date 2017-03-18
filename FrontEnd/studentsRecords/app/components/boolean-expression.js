import Ember from 'ember';

export default Ember.Component.extend({

	boolId: null,
	currentField: null,
	fields: null,
	currentOpr: null,
	operators: null,
	currentVal: null,

	init(){
		this._super(...arguments);
		var self = this;
		var fields = [  //TESTER
            {
                "id": 0,
                "name": "Yearly weighted average"
            },
            {
                "id": 1,
                "name": "Cumulatively weighted average"
            },
            {
                "id": 2,
                "name": "Number of failed credits"
            }, 
            {
                "id": 3,
                "name": "Number of credits"
            }
        ];
        var operators = [
            {
                "id": 0,
                "name": "is greater than"
            },
            {
                "id": 1,
                "name": "is less than"
            },
            {
                "id": 2,
                "name": "is greater than or equal to"
            },
            {
                "id": 3,
                "name": "is less than or equal to"
            },
            {
                "id": 4,
                "name": "is equal to"
            },
            {
                "id": 5,
                "name": "is not equal to"
            }
        ];
       	this.set('fields', fields);
       	this.set('operators', operators);
	}
});
