import crypto from "crypto-js";
/**
 * Function for encrypt string
 * @param {Number} strConnection - Tenant Id
 * @param {String} strInput      - Input string.
 *    |-> Eg: "***The way forward*"
 * @return {String} - Returns the modified string.
 *    |-> Eg: "The way forward"
 */
export function encryptString(strConnection, strInput: string): string {
  if (!strInput) return strInput;
  let strEncryptString = crypto.AES.encrypt(
    strInput,
    "ABDU"
  );
  return strEncryptString.toString();
}
