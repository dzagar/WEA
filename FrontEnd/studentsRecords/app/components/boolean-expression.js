import Ember from 'ember';

export default Ember.Component.extend({

	boolId: null,
	currentField: null,
    fieldName: null,
	fields: null,
    currentOpr: null,
    oprName: null,
	currentOpr1: null,
    currentOpr2: null,
	operators: null,
	currentVal: null,
    enforceBetweenVal: false,
    regOprs: null,
    courseGroupingOprs: [],
    currentVal1: null,
    currentVal2: null,
    enforceBooleanValueField: false,
    enforceDoubleOpr: false,
    store: Ember.inject.service(),
    selectByCourseGrouping: false,
    isReadOnly: null,

    fieldObserver: Ember.observer('currentField', function(){
        //console.log('called field observer');
        if (this.get('currentField') >= 4 && this.get('currentField') <= 9){
            this.set('selectByCourseGrouping', true);
            if (this.get('currentField') == 5 || this.get('currentField') == 4){
                this.set('enforceDoubleOpr', true);
            }
        } else {
            this.set('selectByCourseGrouping', false);
        }
    }),

    oprObserver: Ember.observer('currentOpr', function(){
        //console.log('called opr observer');
        if (this.get('currentOpr') == 6 || this.get('currentOpr') == 7){  //between
            this.set('currentVal', null);
            this.set('enforceBetweenVal', true);
        } else if (this.get('enforceDoubleOpr')){
            this.set('currentVal', null);
            if (this.get('currentOpr2') == 6 || this.get('currentOpr2') == 7) this.set('enforceBetweenVal', true);
        } else {
            this.set('currentVal', null);
            this.set('enforceBetweenVal', false);
        }
    }),

    opr1Observer: Ember.observer('currentOpr1', function(){
        var newCurrentOpr = this.get('currentOpr1') + "+" + this.get('currentOpr2');
        this.set('currentOpr', newCurrentOpr);
    }),

    opr2Observer: Ember.observer('currentOpr2', function(){
        var newCurrentOpr = this.get('currentOpr1') + "+" + this.get('currentOpr2');
        this.set('currentOpr', newCurrentOpr);
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
        this.set('fields', fields);
        //console.log('in init');
        this.set('courseGroupingOprs', []);
        this.get('store').findAll('course-grouping').then(function(courseGroupings){
            //console.log('went into findall');
            courseGroupings.forEach(function(courseGrouping){
                var newOpr = {
                    "id": courseGrouping.get('id'),
                    "name": courseGrouping.get('name')
                };
                self.get('courseGroupingOprs').push(newOpr);
            });
            if (self.get('isReadOnly') != null){
                self.set('fieldName', fields[self.get('currentField')].name);
                var courseGrouping = self.get('courseGroupingOprs').filter(function ( obj ) {
                    return obj.id === self.get('currentOpr');
                })[0];
                if (self.get('currentOpr').indexOf('+') > -1){
                    var oprArr = self.get('currentOpr');
                    oprArr = oprArr.split("+");
                    courseGrouping = self.get('courseGroupingOprs').filter(function ( obj ) {
                                        return obj.id === oprArr[0];
                                    })[0];
                    var opr = courseGrouping.name + " / " + regOprs[oprArr[1]].name; 
                    self.set('oprName', opr);
                    self.set('valName', self.get('currentVal'));
                } else if (courseGrouping){
                    self.set('oprName', courseGrouping.name);
                    if (self.get('currentVal') == 1) self.set('valName', "True");
                    else self.set('valName', "False");
                } else {
                    self.set('oprName', regOprs[self.get('currentOpr')].name);
                    self.set('valName', self.get('currentVal'));
                }
            }
        });
	}


});
