import {escape} from '..';
/**
 * Function for replacing multiple words at a time in a string.
 * @param {String} strInput - Input string.
 *    |-> Eg: "I have a cat and a dog"
 * @param {Object} arrMatched - Array for replace value.
 *    |-> Eg: { cat: 'Car', dog: 'Bike' }
 * @return {String} - Replaced string.
 *    |-> Eg: "I have a Car and a Bike"
 */
export function multiReplace(strInput: String, arrMatched: {}): String {
  let arrKey = [];
  for (let i in arrMatched) arrKey.push(escape(i));
  return strInput.replace(new RegExp(arrKey.join('|'), 'g'), function(strKey) {
    return arrMatched[strKey];
  });
}
