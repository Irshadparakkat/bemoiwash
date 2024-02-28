/**
 * Function for escaping regular expression string.
 * @param {String} strInput - Input string.
 *    |-> Eg: "e|y-"
 * @return {String} - Replaced string.
 *    |-> Eg: "e\|y\-"
 */

export function escape(strInput: string): string {
  return strInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
