import Ember from 'ember';

export default Ember.Component.extend({
    adjudicationCategories: null,
    newCategoryName: null,
    newCategoryYear: null,
	store: Ember.inject.service(),
	init(){
		this._super(...arguments);
        var self = this;
        this.get('store').findAll('adjudication-category').then(function(records) {
            self.set('adjudicationCategories', records);
        });
    },

    actions: {
        saveCategory(adjudicationCategory){
            adjudicationCategory.save();
        },
        addCategory(){
            var self = this;
            var newCategoryName = this.get('newCategoryName');
            var newCategoryYear = this.get('newCategoryYear');
            var newCategory = this.get('store').createRecord('adjudication-category', {
                name: newCategoryName,
                programYear: newCategoryYear,
                assessmentCodes: []
            });
            newCategory.save().then(function(){
                self.set('newCategoryName', "");
            });
        },
        deleteCategory(adjudicationCategory){
            adjudicationCategory.destroyRecord();
        }
    }
});
