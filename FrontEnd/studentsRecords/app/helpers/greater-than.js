import Ember from 'ember';

export function greaterThan(params/*, hash*/) {
  let op1 = params[0];
  let op2 = params[1];
  return op1 > op2;
}

export default Ember.Helper.helper(greaterThan);
