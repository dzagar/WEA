import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	currentName: "",
	authentication: Ember.inject.service('oudaAuth'),

	init(){
		this._super(...arguments);
		$(".appBody .content").css('margin-top', "");
	},

	willDestroy(){
		$(".appBody .content").css('margin-top', '50px');
	}
});
