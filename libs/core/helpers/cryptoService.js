const bcrypt = require("bcryptjs");
const crypto = require('crypto-js')
const hashString = function (strTenantId, strInput) {
  return new Promise(function (resolve, reject) {
    try {
      if (strInput?.length > 0) {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(strInput, salt, function (err, hash) {
            resolve(hash);
          });
        });
      } else {
        reject("NULL_INPUT_RECVD");
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}

const compareHashAndText = function (strTenantId, strPassword, strHashPassword) {
  return new Promise(async function (resolve, reject) {
    try {
      if (strPassword && strHashPassword) {
        const match = await bcrypt.compareSync(strPassword, strHashPassword);
        resolve(match);
      } else {
        reject("NULL_INPUT_RECVD");
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}

const encryptString = async function (strTenantId, strInput) {
  if (!strInput) return strInput;
  let strSecreteKey = "ABDR"
  let strEncryptString = await crypto.AES.encrypt(
    strInput,
    strSecreteKey
  );
  return strEncryptString.toString();
}

const decryptString = async function (strTenantId, strInput) {
  if (!strInput) return strInput;
  let strSecreteKey = "ABDR"
  let strDecrypt = await crypto.AES.decrypt(
    strInput,
    strSecreteKey
  );
  return strDecrypt.toString(crypto.enc.Utf8);
}

module.exports = {
  hashString,
  compareHashAndText,
  encryptString,
  decryptString
}