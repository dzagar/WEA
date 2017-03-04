import Ember from 'ember';

export default Ember.Component.extend({
	danielaHover: false,
	tomHover: false,
	mikeHover: false,
	nickHover: false,
	danaHover: false,

	didInsertElement(){
		Ember.$('.headshot').hover(function(){
			$(this).transition('bounce');
		}, function(){});
	},

	actions: {
		onDanielaHover: function(){
			if (this.get('danielaHover')){
				this.set('danielaHover', false);
			} else {
				this.set('danielaHover', true);
				this.set('tomHover', false);
				this.set('mikeHover', false);
				this.set('nickHover', false);
				this.set('danaHover', false);
			}
		},

		onTomHover: function(){
			if (this.get('tomHover')){
				this.set('tomHover', false);
			} else {
				this.set('danielaHover', false);
				this.set('tomHover', true);
				this.set('mikeHover', false);
				this.set('nickHover', false);
				this.set('danaHover', false);
			}
		},

		onMikeHover: function(){
			if (this.get('mikeHover')){
				this.set('mikeHover', false);
			} else {
				this.set('danielaHover', false);
				this.set('tomHover', false);
				this.set('mikeHover', true);
				this.set('nickHover', false);
				this.set('danaHover', false);
			}
		},

		onNickHover: function(){
			if (this.get('nickHover')){
				this.set('nickHover', false);
			} else {
				this.set('danielaHover', false);
				this.set('tomHover', false);
				this.set('mikeHover', false);
				this.set('nickHover', true);
				this.set('danaHover', false);
			}
		},

		onDanaHover: function(){
			if (this.get('danaHover')){
				this.set('danaHover', false);
			} else {
				this.set('danielaHover', false);
				this.set('tomHover', false);
				this.set('mikeHover', false);
				this.set('nickHover', false);
				this.set('danaHover', true);
			}
		},

		onHoverAway: function(){
			this.set('danielaHover', false);
			this.set('tomHover', false);
			this.set('mikeHover', false);
			this.set('nickHover', false);
			this.set('danaHover', false);
		}
	}
});
