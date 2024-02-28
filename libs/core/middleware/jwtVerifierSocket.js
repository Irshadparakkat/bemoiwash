const {
    jwtVerify
} = require('../helpers/jwtServices');
const {
    decryptString
} = require("../helpers/cryptoService")
const {
    STR_COMMON_DB_TENANT_ID,
    objOpenAPI
} = require('../../common/constants');
const jwtTokenCheckingSocket = async function (socket, next) {
    try {
        const strEncryptedToken = await  socket.handshake.query.token;
            if(strEncryptedToken){
            const strToken = await decryptString(STR_COMMON_DB_TENANT_ID, strEncryptedToken)
            if (strToken) {
                const objOption = {
                    issuer: "issuer",
                    subject: "IP",
                    audience: "ABDU"
                }
                //Verify token
                const objTokenDecoded = await jwtVerify(strToken, objOption);
                socket["strUserId"] = objTokenDecoded["strUserId"];
                socket["strFullName"] = objTokenDecoded["strFullName"];
                socket.id = objTokenDecoded["strUserId"];
                next()
            }  
        }  
    } catch (error) {
      console.log("error",error);
    }
}

module.exports = jwtTokenCheckingSocket