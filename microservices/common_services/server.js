const express = require('express')
const {
  intPort
} = require('./config/port')
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./router");
const {
  jwtTokenChecking
} = require('../../libs/core/middleware')

const objServiceApp = express();
try {
  objServiceApp.use(cors({
    origin: '*'
  }));
  objServiceApp.use(jwtTokenChecking)
  objServiceApp.use(bodyParser.json({
    limit:'100mb'
  }));
  objServiceApp.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  objServiceApp.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).send({
        errCommon: [{
          strMessage: "INVALID_JSON"
        }]
      });
    } else next();
  });
  objServiceApp.use("/", routes);
  objServiceApp.listen(intPort, function () {
    console.log('App is listening on port ' + intPort);
  });
} catch (error) {
  console.log(error);
}