export default function(){
	this.transition(
		this.hasClass('loginTrans'),
		this.toValue(true),
		this.use('toLeft'),
		this.reverse('toRight')
	);
};