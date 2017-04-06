import Ember from 'ember';

export function inlineCompare(params/*, hash*/) {
  let op1 = params[0];
  let operation = params[1].trim();
  let op2 = params[2];

  switch (operation){
    case '==':
      return op1 == op2;
    case '!=':
      return op1 != op2;
    case '===':
      return op1 === op2;
    case '!==':
      return op1 !== op2;
    case '>':
      return op1 > op2;
    case '>=':
      return op1 >= op2;
    case '<':
      return op1 < op2;
    case '<=':
      return op1 <= op2;
    case '&&':
      return op1 && op2;
    case '||':
      return op1 || op2;
  }

  //console.log('inline compare failed with operation: ' + op1 + ' ' + operation + ' ' + op2);
  return false;
}

export default Ember.Helper.helper(inlineCompare);
