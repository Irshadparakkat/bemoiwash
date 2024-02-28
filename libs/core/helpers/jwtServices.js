const jwt = require("jsonwebtoken");
const fs = require('fs')
const jwtSignIn = async function (objPayload, objOption) {
  try {
    let strKey = await fs.readFileSync(__dirname + '/config/private.key', 'utf-8');
    let objOptions = await {
      issuer: objOption["issuer"],
      subject: objOption["subject"],
      audience: objOption["audience"],
      algorithm: "RS256"
    };
    let strToken = await jwt.sign(objPayload, strKey, objOptions);
    return strToken;
  } catch (error) {
    throw Error(error);
  }
}

const jwtVerify = async function (strToken, objOption) {
  try {
    let strKey = await fs.readFileSync(__dirname + '/config/public.key', 'utf-8');
    let objOptions = {
      issuer: objOption["issuer"],
      subject: objOption["subject"],
      audience: objOption["audience"],
      algorithm: 'RS256'
    };
    return jwt.verify(strToken, strKey, objOptions)
  } catch (error) {
    throw Error(error);
  }
}

/**
 * @param token jwt token passing
 */
const jwtDecode = async function (strToken) {
  try {
    return jwt.decode(strToken, {
      complete: true
    });
  } catch (error) {
    throw Error(error);
  }
}

module.exports = {
  jwtSignIn,
  jwtVerify,
  jwtDecode
}