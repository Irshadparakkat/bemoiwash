import {escape} from '..';
/**
 * Function for Strip whitespace (or other characters) from the beginning of a string.
 * @param {String} strInput - Input string.
 *    |-> Eg: "***The way forward*"
 * @param {String} strMask - (Optional) You can also specify the characters
 * you want to strip.
 *    |-> Eg: "*"
 * @return {String} - Returns the modified string.
 *    |-> Eg: "The way forward*"
 */
export function ltrim(
  strInput: string,
  strMask: string = '\\s'
): string {
  if (!strInput) return strInput;
  if (strMask !== '\\s') strMask = escape(strMask);
  return strInput.replace(new RegExp('^[' + strMask + ']+', 'gm'), '');
}
