import Ember from 'ember';

export default Ember.Component.extend({
  isUsersShowing: true,
  isFeatureEditing: false,
  isRolesEditing: false,
  isAdjudicationRulesEditing: false,
  isAdjudicationCategoriesIsShowing: false,
  ADM01IsPermitted: Ember.computed(function(){ //Manage system roles
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("ADM01") >= 0);
    }
  }),

  didRender(){
    var previous = Ember.$('.ui.tab.segment.main.active');
    Ember.$('.menu.main .item').tab({
      'onVisible': function(tab){
        var current = Ember.$('.ui.tab.segment.main.active');
        // hide the current and show the previous, so that we can animate them
        previous.show();
        current.hide();
        // hide the previous tab - once this is done, we can show the new one
        previous.transition({
            animation: 'fade left',
            onComplete: function () {
                // finally, show the new tab again
                current.transition('fade right');
            }
        });
        // remember the current tab for next change
        previous = current;
      }
    });
    Ember.$('.ui.menu').find('.item').tab('change tab', 'second');
  }

});
