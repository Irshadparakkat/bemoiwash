const errHandler = require('../../core/helpers/errHandler')
const {
  STR_COMMON_DB
} = require('../../common/constants');
const {
  MongoClient
} = require("mongodb");
let objMongoConnection
let objMongoTransClient

async function createMongoDbConnection(isTrans = false) {
  try {

    if (isTrans) {
      objMongoTransClient = await MongoClient.connect("mongodb://127.0.0.1:27017/?retryWrites=true&w=majority&replicaSet=rs", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
     return objMongoTransClient.startSession();
    } else {
      objMongoConnection = await MongoClient.connect("mongodb://127.0.0.1:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
    }
    console.log("MongoClient Created");
  } catch (error) {
    throw new errHandler(error)
  }
}

async function getMongoDbConnection() {
  try {
    if (!objMongoConnection)
      await createMongoDbConnection();
    return objMongoConnection.db(STR_COMMON_DB);
  } catch (error) {
    throw new errHandler(error)
  }
}

async function getMongoTransConnection() {
  try {
      let session = await createMongoDbConnection(true);
                    await session.startTransaction();
      let objConnection = await objMongoTransClient.db(STR_COMMON_DB);
    return{
      session,
      objConnection
    }
  } catch (error) {
    throw new errHandler(error)
  }
}

const allDBInit = () => {

}

module.exports = {
  allDBInit,
  getMongoDbConnection,
  getMongoTransConnection
}