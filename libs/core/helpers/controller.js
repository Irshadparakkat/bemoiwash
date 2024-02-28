const moment = require('moment-timezone')
const errHandler = require("./errHandler");
// const {
//   createErrorLog
// } = require('../../common/functions/DB/errorLog')
const makeController = (controller) => {
  return (req, res) => {
    try {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        strEncryptedToken: req.strEncryptedToken,
        strUserId: req.strUserId,
        strFullName: req.strFullName,
        strType: req.strType,
        method: req.method,
        timReceived: moment().tz("Asia/Dubai").format('YYYY-MM-DD hh:mm:ss a'),
        path: req.originalUrl,
        strAudience: (req.get("str-audience") || '').toUpperCase(),
        headers: {
          "Content-Type": req.get("Content-Type"),
          Referer: req.get("referer"),
          "User-Agent": req.get("User-Agent")
        }
      };
     //  console.log(`${req.originalUrl} = > `,req.body);
      controller(httpRequest)
        .then(
          ({
            headers: headers = {
              "Content-Type": "application/json",
              "Last-Modified": new Date().toUTCString()
            },
            type = "json",
            statusCode: code = 200,
            body
          }) => {
            if (!body) throw new Error("EMPTY_RESPONSE");
          //  console.log("Response ",body);
            res.set(headers);
            res.type(type);
            res.status(code).send({
              success: true,
              message:"success",
              statusCode: 200,
              ...body
            });
          }
        )
        .catch(error => {
          let Responce = new errHandler(error).send();
          let errorCode = new Date().getTime();
          // createErrorLog({
          //   strTenantId: req.strTenantId,
          //   errorCode,
          //   req: {
          //     body: req.body,
          //     query: req.query,
          //     params: req.params,
          //     ip: req.ip,
          //     strEncryptedToken: req.strEncryptedToken,
          //     strUserId: req.strUserId,
          //     strTenantId: req.strTenantId,
          //     strFullName: req.strFullName,
          //     strType: req.strType,
          //     method: req.method,
          //   },
          //   res: Responce
          // })
          res
            .status(Responce.statusCode)
            .set({
              "Content-Type": "application/json",
              "Last-Modified": new Date().toUTCString()
            })
            .send({
              message:"failed",
              statusCode: Responce.statusCode ||  400,
              ...Responce.body,
              errorCode
            });
        });
    } catch (error) {
      let Responce = new errHandler(error).send();
      let errorCode = new Date().getTime();
      // createErrorLog({
      //   strTenantId: req.strTenantId,
      //   errorCode,
      //   req: {
      //     body: req.body,
      //     query: req.query,
      //     params: req.params,
      //     ip: req.ip,
      //     strEncryptedToken: req.strEncryptedToken,
      //     strUserId: req.strUserId,
      //     strTenantId: req.strTenantId,
      //     strFullName: req.strFullName,
      //     strType: req.strType,
      //     method: req.method,
      //   },
      //   res: Responce
      // })
      res
        .status(Responce.statusCode)
        .set({
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString()
        })
        .send({
          message:"failed",
          statusCode: Responce.statusCode ||  400,
          ...Responce.body,
          errorCode
        });
    }
  };
}

module.exports = makeController