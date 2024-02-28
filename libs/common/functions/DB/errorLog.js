const {
    OBJ_DB_CONFIG
  } = require('../../constants');
  const {
    MongoClient
  } =require("mongodb");
//const {insertOneDB} = require('../DB')
  async function createErrorLog({
    errorCode,
    req,
    res
}) {
    // await insertOneDB({
    //   strCollection:'error',
    //   objDocument:{
    //     errorCode,
    //     req,
    //     res
    //  }})
    return true;
}
 


module.exports ={
    createErrorLog
}