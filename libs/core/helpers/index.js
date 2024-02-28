const makeController = require('./controller');
const makeFileController = require('./fileController')
const {
    getMongoDbConnection,
    getMongoTransConnection
} = require('./DBconnection');
const errHandler = require("./errHandler")
const cryptoService = require('./cryptoService');
const jwtServices = require('./jwtServices');
 const multiFilesToS3 = require('./multiFilesUploadToS3');

module.exports = {
    makeController,
    makeFileController,
    getMongoDbConnection,
    getMongoTransConnection,
    multiFilesToS3,
    errHandler,
    ...cryptoService,
    ...jwtServices,
    // redisService,
}