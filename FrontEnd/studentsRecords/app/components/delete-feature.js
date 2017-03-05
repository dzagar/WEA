import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {
    deleteOneFeature: function(id){
      var myStore = this.get('store');
      if (confirm ('If this a predefined system feature, then the only way to undo this process is to do a factory reset. \nAre you sure you need to delete this feature?')) {

        myStore.find('rolePermission',  id).then(function(feature) {
          feature.set('roleCode', null);
          feature.save().then(function(){
            feature.destroyRecord();
          });
        });

      }
    }
  }
});
