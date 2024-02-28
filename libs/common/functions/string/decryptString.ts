import crypto from "crypto-js";
/**
 * Function for decrypt string
 * @param {Number} strConnection - Tenant Id
 * @param {String} strInput - Input string.
 *    |-> Eg: "***The way forward*"
 * @return {String} - Returns the modified string.
 *    |-> Eg: "The way forward"
 */
export function decryptString(strConnection, strInput: string): string {
  if (!strInput) return strInput;
  let strDecrypt = crypto.AES.decrypt(
    strInput,
    "ABDU"
  );
  return strDecrypt.toString(crypto.enc.Utf8);
}
