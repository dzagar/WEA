import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    residencyModel: null,
    genderModel: null,
    showDeleteGenderConfirmation: false,
    showDeleteResidencyConfirmation: false,
    currentGender: null,
    newGenderName: "",
    newGenderObj: null,

    init() {
        this._super(...arguments);
        var self = this;
        
        // load Residency data model
        this.get('store').findAll('residency').then(function (records) {
            self.set('residencyModel', records);
        });

        // load Gender data model 
        this.get('store').findAll('gender').then(function (records) {
            self.set('genderModel',records);
        });
    },
    
    didRender() {
    Ember.$('.menu .item').tab();
    },


    actions:
    {
        addGender()
        {
            this.set('newGenderObj', this.get('store').createRecord('gender', {
                name: this.get('newGenderName')
            }));
            this.get('newGenderObj').save();
            this.set('newGenderName', "");
        },

        editGender()
        {

        },

        deleteGender(gender)
        {
            this.set('currentGender', gender);
            this.set('showGenderDeleteConfirmation', true);
            this.set('showResidencyDeleteConfirmation', false);
        },

        addResidency()
        {

        },

        editResidency()
        {

        },

        deleteResidency()
        {

        },

    }


});
