/**
 * U for Upper case, L for Lower case and any other for no change
 */
type Typecast = 'U' | 'L' | null;
/**
 * Function for generate slugify string 
 * of a string.
 * @param {String} strInput - Input string.
 *    |-> Eg: "🐶*x*the way 4wrd* x"
 * @param {Typecast} chrTypecast - (Optional) U for Upper case, L for Lower 
 * case and null for no change.
 *    |-> Eg: "U"
 * @param {String} strReplace - (Optional) replace spaces with replacement.
 *    |-> Eg: "_"
 * @return {String} - Returns the modified string.
 *    |-> Eg: "___X_THE_WAY_4WRD__X"
 */
export function slugify(
  strInput: string,
  chrTypecast: Typecast = 'U',
  strReplace: string = '_'
): string {
  if (!strInput) return strInput;
  if (chrTypecast == 'L')
    return strInput.replace(/[^a-z0-9]/gi, strReplace).toLowerCase();
  if (chrTypecast == 'U')
    return strInput.replace(/[^a-z0-9]/gi, strReplace).toLocaleUpperCase();
  return strInput.replace(/[^a-z0-9]/gi, strReplace);
}
