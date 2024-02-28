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
const jwtTokenChecking = async function (req, res, next) {
    let objResponceType = {
        "Content-Type": "application/json",
        "Last-Modified": new Date().toUTCString()
    };
    try {
        const strEncryptedToken = await req.headers["x-access-token"] || req.headers["authorization"];
        if (!objOpenAPI[req.originalUrl]) {
            if(strEncryptedToken){
            // const strRedisValue = await getRedisData(strEncryptedToken)
            // if(!strRedisValue){
            //     return res
            //         .status(401)
            //         .set(objResponceType)
            //         .send("INVALID_TOKEN_PROVIDED");
            // }
            const strToken = await decryptString(STR_COMMON_DB_TENANT_ID, strEncryptedToken)
            if (strToken) {
                const objOption = {
                    issuer: "issuer",
                    subject: "IP",
                    audience: "ABDU"
                }
                //Verify token
                const objTokenDecoded = await jwtVerify(strToken, objOption);
                req["strUserId"] = objTokenDecoded["strUserId"]
                req["strTenantId"] = objTokenDecoded["strTenantId"] || "medical"
                req["strType"] = objTokenDecoded["strType"]
                req["strFullName"] = objTokenDecoded["strFullName"]
                req["strEncryptedToken"] = strEncryptedToken
                next()
            } else {
                return res
                    .status(401)
                    .set(objResponceType)
                    .send("INVALID_TOKEN_PROVIDED");
                //No loginn
            }
        }
        } else {
            //Open api cheking
            //if not an open api
            req["strTenantId"] = req.headers["authorization"]  || "medical"
            if (objOpenAPI[req.originalUrl])
                next()
            else
                return res
                    .status(401)
                    .set(objResponceType)
                    .send("UNAUTHERIZED_CREDENTIALS");
        }
    } catch (error) {
        return res
            .status(401)
            .set(objResponceType)
            .send("UNAUTHERIZED_CREDENTIALS");
    }
}

module.exports = jwtTokenChecking