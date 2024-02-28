 
 const moment = require('moment-timezone')
 const errHandler = require("./errHandler");
 function makeFileController(controller) {
  return (req, res) => {
    try {
      const httpRequest = {
        body: req.body,
        file: req.file,
        files:req.files,
        query: req.query,
        params: req.params,
        ip: req.ip,
        strUserId: req.strUserId,
        fkPackageId: req.fkPackageId,
        strType:req.strType,
        authorization:req.get("x-access-token"),
        method: req.method,
        timReceived: new Date().toUTCString(),
        path: req.originalUrl,
        strAudience: (req.get("str-audience")||'').toUpperCase(),
        headers: {
          "Content-Type": req.get("Content-Type"),
          Referer: req.get("referer"),
          "User-Agent": req.get("User-Agent")
        }
      };
      controller(httpRequest)
        .then(
          ({
            headers: headers = {
              "Content-Type": "text/plain",
              "Last-Modified": new Date().toUTCString()
            },
            type = "json",
            statusCode: code = 200,
            body
          }) => {
            console.log("jbksd",body);
            if (!body) throw new Error("EMPTY_RESPONSE");
            res.set(headers);
            res.type(type);
            res.status(code).send({
              success: true,
              message:"success",
              statusCode: 200,
              ...body});
          }
        )
        .catch(error => {
          let Responce = new errHandler(error).send();
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
              });
        });
    } catch (error) {
      let Responce = new errHandler(error).send();
      res
        .status(Responce.statusCode)
        .set({
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString()
        })
        .send({
          message:"failed",
          statusCode: Responce.statusCode ||  400,
          ...Responce.body
        });
    }
  };
}

module.exports = makeFileController