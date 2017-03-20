import Ember from 'ember';

export default Ember.Component.extend({

	boolId: null,
	currentField: null,
	fields: null,
	currentOpr: null,
	operators: null,
	currentVal: null,
    enforceBetweenVal: false,
    regOprs: null,
    courseGroupingOprs: null,
    currentVal1: null,
    currentVal2: null,
    enforceBooleanValueField: false,
    store: Ember.inject.service(),

    fieldObserver: Ember.observer('currentField', function(){
        var oprs = [];
        if (this.get('currentField') >= 4 && this.get('currentField') <= 9){
            this.set('currentOpr', null);
            this.set('enforceBooleanValueField', true);
            this.set('operators', this.get('courseGroupingOprs'));
        } else {
            this.set('currentOpr', null);
            this.set('enforceBooleanValueField', false);
            this.set('operators', this.get('regOprs'));
        }
    }),

    oprObserver: Ember.observer('currentOpr', function(){
        if (this.get('currentOpr') == 6 || this.get('currentOpr') == 7){  //between
            this.set('currentVal', null);
            this.set('enforceBetweenVal', true);
        } else {
            this.set('currentVal', null);
            this.set('enforceBetweenVal', false);
        }
    }),

    val1Observer: Ember.observer('currentVal1', function(){
        var newCurrentVal = this.get('currentVal1') + "-" + this.get('currentVal2');
        this.set('currentVal', newCurrentVal);
    }),

    val2Observer: Ember.observer('currentVal2', function(){
        var newCurrentVal = this.get('currentVal1') + "-" + this.get('currentVal2');
        this.set('currentVal', newCurrentVal);
    }),


	init(){
		this._super(...arguments);
		var self = this;

        this.get('store').findAll('course-grouping', function(courseGroupings){
            courseGroupings.forEach(function(grouping){
                var newOpr = {
                    "id": courseGrouping.get('id'),
                    "name": courseGrouping.get('name')
                };
                this.get('courseGroupingOprs').push(newOpr);
            });
        }).then(()=>{
            var fields = [ 
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
                    "name": "Each grade in failed credits"
                },
                {
                    "id": 4,
                    "name": "Number of credits completed in..."
                }, 
                {
                    "id": 5,
                    "name": "Overall average of courses in..."
                },
                {
                    "id": 6,
                    "name": "Withdrawn from course in..."
                },
                {
                    "id": 7,
                    "name": "Not completed course in..."
                },
                {
                    "id": 8,
                    "name": "Granted SPC in course in..."
                },
                {
                    "id": 9,
                    "name": "Failed credit in..."
                },
                {
                    "id": 10,
                    "name": "First occurrence of YWA"
                },
                {
                    "id": 11,
                    "name": "Second occurrence of YWA"
                },
                {
                    "id": 12,
                    "name": "Number of credits completed this term"
                }
            ];
            this.set('fields', fields);
            var regOprs = [
                {
                    "id": 0,
                    "name": "is equal to"
                },
                {
                    "id": 1,
                    "name": "is not equal to"
                },
                {
                    "id": 2,
                    "name": "is greater than"
                },
                {
                    "id": 3,
                    "name": "is greater than or equal to"
                },
                {
                    "id": 4,
                    "name": "is less than"
                },
                {
                    "id": 5,
                    "name": "is less than or equal to"
                },
                {
                    "id": 6,
                    "name": "is between (inclusive)"
                },
                {
                    "id": 7,
                    "name": "is between (exclusive)"
                }
            ];
            this.set('regOprs', regOprs);

            if (this.get('currentField')){
                if (this.get('currentField') >= 4 && this.get('currentField') <= 9){
                    this.set('operators', this.get('courseGroupingOprs'));
                    this.set('enforceBooleanValueField', true);
                } else {
                    this.set('operators', this.get('regOprs'));
                }
            }
        });
	}


});
